import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * PasswordWall Component
 *
 * A full-screen numeric password entry interface that blocks access
 * until the correct 4-digit PIN (2014) is entered.
 *
 * Features:
 * - Numeric keypad (0-9)
 * - Visual feedback with dots (••••)
 * - Delete/backspace functionality
 * - Shake animation on wrong code
 * - Success animation on correct code
 */

interface PasswordWallProps {
  /** Callback function called when correct password is entered */
  onUnlock: () => void;
  /** Optional: Custom correct PIN (defaults to "2014") */
  correctPin?: string;
}

export default function PasswordWall({ onUnlock, correctPin = "2014" }: PasswordWallProps) {
  // STATE MANAGEMENT
  // ================

  // Array to store entered digits (e.g., ['2', '0', '1', '4'])
  const [enteredDigits, setEnteredDigits] = useState<string[]>([]);

  // Controls shake animation when wrong PIN is entered
  const [isShaking, setIsShaking] = useState(false);

  // Controls success animation when correct PIN is entered
  const [isSuccess, setIsSuccess] = useState(false);

  // VALIDATION LOGIC
  // ================

  /**
   * This effect runs every time the user enters a digit
   * When 4 digits are entered, it checks if they match the correct PIN
   */
  useEffect(() => {
    // Only check when exactly 4 digits have been entered
    if (enteredDigits.length === 4) {
      const enteredPin = enteredDigits.join(''); // Convert ['2','0','1','4'] to '2014'

      if (enteredPin === correctPin) {
        // ✅ CORRECT PIN
        setIsSuccess(true);

        // Wait 800ms to show success animation, then unlock
        setTimeout(() => {
          onUnlock();
        }, 800);
      } else {
        // ❌ WRONG PIN
        setIsShaking(true);

        // Wait 500ms to show shake animation, then clear the input
        setTimeout(() => {
          setIsShaking(false);
          setEnteredDigits([]); // Clear entered digits
        }, 500);
      }
    }
  }, [enteredDigits, correctPin, onUnlock]);

  // KEYPAD HANDLERS
  // ===============

  /**
   * Called when user clicks a number button
   * Only adds digit if less than 4 digits are entered
   */
  const handleNumberClick = (digit: string) => {
    if (enteredDigits.length < 4) {
      setEnteredDigits([...enteredDigits, digit]);
    }
  };

  /**
   * Called when user clicks the delete button
   * Removes the last entered digit
   */
  const handleDelete = () => {
    setEnteredDigits(enteredDigits.slice(0, -1)); // Remove last element
  };

  // RENDER FUNCTIONS
  // ================

  /**
   * Renders the PIN display area
   * Shows dots (•) for entered digits and empty circles (○) for remaining slots
   */
  const renderPinDisplay = () => {
    const dots = [];

    for (let i = 0; i < 4; i++) {
      const isFilled = i < enteredDigits.length;

      dots.push(
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className={`
            w-5 h-5 rounded-full border-2 transition-all duration-300
            ${isFilled
              ? 'bg-gradient-to-br from-orange-500 to-orange-600 border-orange-600 scale-125 shadow-lg' // Filled dot (orange!)
              : 'bg-white border-gray-300 shadow-sm'  // Empty circle
            }
          `}
        />
      );
    }

    return dots;
  };

  /**
   * Renders a single number button for the keypad - Colorful!
   */
  const renderNumberButton = (digit: string) => (
    <motion.button
      key={digit}
      onClick={() => handleNumberClick(digit)}
      disabled={enteredDigits.length >= 4}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="
        w-20 h-20 rounded-2xl bg-gradient-to-br from-white to-primary/10 text-foreground text-2xl font-bold font-display
        shadow-lg hover:shadow-xl border-2 border-primary/20 hover:border-primary/40
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
      "
    >
      {digit}
    </motion.button>
  );

  // MAIN COMPONENT RENDER
  // =====================

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 flex items-center justify-center p-4">
      {/* Fun floating food emojis in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 text-6xl opacity-20"
          animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          🍕
        </motion.div>
        <motion.div
          className="absolute top-40 right-32 text-5xl opacity-20"
          animate={{ y: [0, -15, 0], rotate: [0, -10, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        >
          🍜
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-40 text-6xl opacity-20"
          animate={{ y: [0, -25, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        >
          🍔
        </motion.div>
        <motion.div
          className="absolute bottom-40 right-20 text-5xl opacity-20"
          animate={{ y: [0, -20, 0], rotate: [0, -10, 10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, delay: 0.5 }}
        >
          🌮
        </motion.div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* HEADER SECTION - Playful! */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="text-7xl mb-6"
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🔐
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-display">
            <span className="text-primary">Halulu</span> is Locked! 😋
          </h1>
          <p className="text-lg text-foreground/70 font-body">
            Enter the secret 4-digit code to start your food adventure! 🍴
          </p>
        </motion.div>

        {/* PIN DISPLAY AREA - Colorful! */}
        <motion.div
          className={`
            bg-gradient-to-br from-white via-white to-primary/5 rounded-3xl p-8 mb-8 shadow-xl border-2 border-primary/20
            ${isShaking ? 'animate-shake' : ''}
            ${isSuccess ? 'animate-success' : ''}
          `}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-center gap-6">
            {renderPinDisplay()}
          </div>
        </motion.div>

        {/* NUMERIC KEYPAD - Colorful! */}
        <motion.div
          className="bg-gradient-to-br from-white via-white to-accent/5 rounded-3xl p-6 shadow-xl border-2 border-accent/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Number grid: 1-9 */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(renderNumberButton)}
          </div>

          {/* Bottom row: Delete, 0, Empty space */}
          <div className="grid grid-cols-3 gap-4">
            {/* Delete button - Fun! */}
            <motion.button
              onClick={handleDelete}
              disabled={enteredDigits.length === 0}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="
                w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600 text-2xl font-bold
                shadow-lg hover:shadow-xl border-2 border-orange-300 hover:border-orange-400
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              ⌫
            </motion.button>

            {/* Zero button */}
            {renderNumberButton('0')}

            {/* Empty space for visual balance */}
            <div />
          </div>
        </motion.div>
      </div>

      {/* CUSTOM ANIMATIONS - Added to the page via inline styles */}
      <style>{`
        /* Shake animation for wrong PIN */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }

        .animate-shake {
          animation: shake 0.5s;
        }

        /* Success animation for correct PIN - Green! */
        @keyframes success {
          0% { transform: scale(1); }
          50% {
            transform: scale(1.05);
            background: linear-gradient(135deg, #86efac 0%, #4ade80 100%);
            border-color: #22c55e;
          }
          100% {
            transform: scale(1);
            background: linear-gradient(135deg, #86efac 0%, #4ade80 100%);
            border-color: #22c55e;
          }
        }

        .animate-success {
          animation: success 0.8s;
        }
      `}</style>
    </div>
  );
}
