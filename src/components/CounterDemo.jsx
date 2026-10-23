/**
 * ============================================================================
 * FILE: src/components/CounterDemo.jsx
 * ============================================================================
 * TOPIC: React State Management with useState vs Flutter StatefulWidget
 * ============================================================================
 * 
 * FLUTTER EQUIVALENT:
 * ```dart
 * class CounterWidget extends StatefulWidget {
 *   const CounterWidget({super.key});
 *   @override
 *   State<CounterWidget> createState() => _CounterWidgetState();
 * }
 * 
 * class _CounterWidgetState extends State<CounterWidget> {
 *   int _count = 0;
 *   int _step = 1;
 * 
 *   void _increment() {
 *     setState(() {
 *       _count += _step;
 *     });
 *   }
 * 
 *   @override
 *   Widget build(BuildContext context) {
 *     return Column(
 *       children: [
 *         Text('Counter: $_count'),
 *         ElevatedButton(onPressed: _increment, child: const Text('Add')),
 *       ],
 *     );
 *   }
 * }
 * ```
 */

import { useState } from 'react';

export default function CounterDemo() {
  /**
   * 1. THE `useState` HOOK:
   * 
   * In Flutter:
   *   `int _count = 0;` inside `_CounterWidgetState`.
   * 
   * In React:
   *   `const [count, setCount] = useState(0);`
   * 
   * - `count`: The current state value (Read-only!).
   * - `setCount`: The updater function (calls React reconciliation).
   * - `0`: Initial value.
   * 
   * CRITICAL DIFFERENCE FROM FLUTTER:
   * In Flutter, you can write:
   *   setState(() { _count++; }); // Direct mutation is allowed inside setState()!
   * In React, state is STRICTLY IMMUTABLE:
   *   count++;          // ❌ RUNTIME ERROR! Assignment to constant variable.
   *   setCount(count + 1); // ✅ CORRECT. Always pass a new value.
   */
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState([]);

  /**
   * 2. FUNCTIONAL UPDATER (Prevents race conditions / batching bugs):
   * 
   * In Flutter:
   *   If you call `setState(() => _count++)` multiple times synchronously,
   *   it executes synchronously on `this._count`.
   * In React:
   *   `setCount` is ASYNCHRONOUS and BATCHED!
   *   If you call `setCount(count + 1)` twice in the same handler, both see the SAME
   *   snapshot of `count`, resulting in +1 instead of +2.
   *   Using `setCount(prev => prev + 1)` guarantees you receive the freshest state!
   */
  const handleIncrement = () => {
    setCount((prev) => {
      const next = prev + step;
      // Record history (showing array immutability)
      // Flutter: `_history.add(next);` (mutation)
      // React: `[...prevHistory, next]` (spread operator creates a brand new list!)
      setHistory((prevHistory) => [
        ...prevHistory,
        `+${step} -> ${next} at ${new Date().toLocaleTimeString()}`,
      ]);
      return next;
    });
  };

  const handleDecrement = () => {
    setCount((prev) => {
      const next = prev - step;
      setHistory((prevHistory) => [
        ...prevHistory,
        `-${step} -> ${next} at ${new Date().toLocaleTimeString()}`,
      ]);
      return next;
    });
  };

  const handleReset = () => {
    // Resetting state
    // Flutter: `setState(() { _count = 0; _history.clear(); });`
    setCount(0);
    setHistory([]);
  };

  /**
   * 3. WIDGET BUILD VS JSX RETURN:
   * 
   * Flutter:
   *   `@override Widget build(BuildContext context) { return ... }`
   * React:
   *   Function returns JSX (JavaScript XML syntax extension).
   *   - `<div>`: Container / Column / Row (configured via CSS Flexbox)
   *   - `<button onClick={...}>`: `ElevatedButton(onPressed: ...)`
   *   - `className="..."`: Flutter `decoration: BoxDecoration(...)` or CSS class
   *   - `{count}`: Text interpolation, like `Text('$count')`
   */
  return (
    <div className="demo-card" id="counter-demo-section">
      <div className="demo-header">
        <span className="badge badge-state">Stateful Concept</span>
        <h3>1. useState vs Flutter's StatefulWidget & setState()</h3>
      </div>

      <p className="demo-explanation">
        In Flutter, mutable state lives in a companion <code>State&lt;T&gt;</code> class and you call <code>setState()</code>.
        In modern React, components are pure JavaScript functions and we use the <code>useState</code> hook.
      </p>

      {/* Interactive Playground */}
      <div className="interactive-box">
        <div className="counter-display">
          <span className="counter-label">Current Count (State)</span>
          <span className="counter-number">{count}</span>
        </div>

        {/* Step Selector (Segmented control) */}
        <div className="step-selector">
          <span className="text-muted">Increment Step:</span>
          {[1, 5, 10].map((val) => (
            <button
              key={val}
              id={`step-btn-${val}`}
              className={`pill-btn ${step === val ? 'pill-active' : ''}`}
              onClick={() => setStep(val)}
            >
              ±{val}
            </button>
          ))}
        </div>

        {/* Action Buttons (Flutter: Row(children: [ElevatedButton(...), ...])) */}
        <div className="button-row">
          <button
            id="counter-decrement-btn"
            className="action-btn btn-danger"
            onClick={handleDecrement}
          >
            - Decrement ({step})
          </button>

          <button
            id="counter-reset-btn"
            className="action-btn btn-secondary"
            onClick={handleReset}
          >
            ↺ Reset
          </button>

          <button
            id="counter-increment-btn"
            className="action-btn btn-primary"
            onClick={handleIncrement}
          >
            + Increment ({step})
          </button>
        </div>

        {/* State Change Log / History */}
        {history.length > 0 && (
          <div className="history-log">
            <span className="history-title">Re-render Event Log (Latest 4):</span>
            <ul>
              {history.slice(-4).map((entry, idx) => (
                <li key={idx}><code>{entry}</code></li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Side-by-Side Code Comparison */}
      <div className="comparison-grid">
        <div className="code-column">
          <div className="code-header flutter-header">Flutter Equivalent</div>
          <pre className="code-content">
{`// 1. Declare state in State class
int _count = 0;

// 2. Trigger rebuild (markNeedsBuild)
void _increment() {
  setState(() {
    _count++; // Mutation inside setState
  });
}`}
          </pre>
        </div>

        <div className="code-column">
          <div className="code-header react-header">React (Functional Hook)</div>
          <pre className="code-content">
{`// 1. Hook returns [value, setter]
const [count, setCount] = useState(0);

// 2. Trigger re-render with new value
const handleIncrement = () => {
  // Never mutate: count++ ❌
  setCount(prev => prev + 1); // ✅
};`}
          </pre>
        </div>
      </div>
    </div>
  );
}
