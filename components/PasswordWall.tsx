import React, { useState, useEffect } from 'react';

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
      // If a digit has been entered for this position, show filled dot
      // Otherwise show empty circle
      const isFilled = i < enteredDigits.length;

      dots.push(
        <div
          key={i}
          className={`
            w-4 h-4 rounded-full border-2 transition-all duration-200
            ${isFilled
              ? 'bg-pink-500 border-pink-500 scale-110' // Filled dot (pink)
              : 'bg-white border-gray-300'               // Empty circle
            }
          `}
        />
      );
    }

    return dots;
  };

  /**
   * Renders a single number button for the keypad
   */
  const renderNumberButton = (digit: string) => (
    <button
      key={digit}
      onClick={() => handleNumberClick(digit)}
      disabled={enteredDigits.length >= 4} // Disable when 4 digits entered
      className="
        w-20 h-20 rounded-2xl bg-white text-gray-900 text-2xl font-semibold
        shadow-md hover:shadow-lg hover:scale-105 active:scale-95
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
      "
    >
      {digit}
    </button>
  );

  // MAIN COMPONENT RENDER
  // =====================

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* HEADER SECTION */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Enter PIN
          </h1>
          <p className="text-gray-600">
            Enter the 4-digit code to continue
          </p>
        </div>

        {/* PIN DISPLAY AREA */}
        <div
          className={`
            bg-white rounded-3xl p-8 mb-8 shadow-lg
            ${isShaking ? 'animate-shake' : ''}         // Shake on wrong PIN
            ${isSuccess ? 'animate-success' : ''}       // Success animation
          `}
        >
          <div className="flex justify-center gap-6">
            {renderPinDisplay()}
          </div>
        </div>

        {/* NUMERIC KEYPAD */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          {/* Number grid: 1-9 */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(renderNumberButton)}
          </div>

          {/* Bottom row: Delete, 0, Empty space */}
          <div className="grid grid-cols-3 gap-4">
            {/* Delete button */}
            <button
              onClick={handleDelete}
              disabled={enteredDigits.length === 0}
              className="
                w-20 h-20 rounded-2xl bg-red-50 text-red-500 text-xl font-semibold
                shadow-md hover:shadow-lg hover:scale-105 active:scale-95
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              ⌫
            </button>

            {/* Zero button */}
            {renderNumberButton('0')}

            {/* Empty space for visual balance */}
            <div />
          </div>
        </div>
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

        /* Success animation for correct PIN */
        @keyframes success {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); background-color: #bbf7d0; }
          100% { transform: scale(1); background-color: #bbf7d0; }
        }

        .animate-success {
          animation: success 0.8s;
        }
      `}</style>
    </div>
  );
}
