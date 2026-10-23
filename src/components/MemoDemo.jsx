/**
 * ============================================================================
 * FILE: src/components/MemoDemo.jsx
 * ============================================================================
 * TOPIC: React Performance Optimization (useMemo, useCallback, React.memo)
 * ============================================================================
 * 
 * FLUTTER EQUIVALENT:
 * ```dart
 * // 1. Flutter `const` constructors prevent child widget rebuilds!
 * const MyExpensiveWidget(title: 'Static');
 * 
 * // 2. Selector / ValueListenableBuilder re-computes only when needed:
 * Selector<AppModel, int>(
 *   selector: (_, model) => model.expensiveCalculation,
 *   builder: (_, value, __) => Text('$value'),
 * );
 * 
 * // 3. Method tear-offs in Dart have stable reference identities:
 * ElevatedButton(onPressed: _handleTap, child: ...);
 * ```
 */

import React, { useState, useMemo, useCallback } from 'react';

/**
 * CHILD COMPONENT WRAPPED IN React.memo:
 * 
 * FLUTTER EQUIVALENT:
 * `const ChildWidget({required this.onClick})`
 * 
 * In React, by default, when a parent component re-renders, ALL of its children
 * re-render too! Wrapping in `React.memo(...)` checks if props changed via shallow equality.
 * If props haven't changed, React skips re-rendering this child!
 */
const ExpensiveChild = React.memo(function ExpensiveChild({ label, onClick }) {
  console.log(`[ExpensiveChild Rendered] label: ${label}`);
  return (
    <div className="memo-child-card">
      <div className="memo-child-info">
        <span className="badge badge-indigo">React.memo (like Flutter const Widget)</span>
        <strong>{label}</strong>
      </div>
      <button className="action-btn btn-secondary" onClick={onClick}>
        Click Stable Callback
      </button>
    </div>
  );
});

export default function MemoDemo() {
  const [count, setCount] = useState(0);
  const [calculationNumber, setCalculationNumber] = useState(20);
  const [clicks, setClicks] = useState(0);

  /**
   * 1. `useMemo`: Memoize Expensive Calculation
   * 
   * FLUTTER EQUIVALENT:
   * A getter cached until inputs change, or `Selector<Model, S>`.
   * Only recomputes the return value when `calculationNumber` changes.
   */
  const computedFactorial = useMemo(() => {
    console.log('[useMemo] Running heavy factorial calculation...');
    let result = 1;
    for (let i = 1; i <= Math.min(calculationNumber, 25); i++) {
      result *= i;
    }
    return result;
  }, [calculationNumber]); // Only recompute when calculationNumber changes

  /**
   * 2. `useCallback`: Stable Function Reference Identity
   * 
   * In Dart/Flutter:
   *   Method tear-offs `onPressed: _onTap` retain the same memory pointer.
   * In JavaScript/React:
   *   Every re-render creates a brand new function in memory:
   *   `() => setClicks(...)` !== previous `() => setClicks(...)`
   *   This would break `React.memo` on the child!
   *   `useCallback` caches the function instance so its reference never changes.
   */
  const handleStableClick = useCallback(() => {
    setClicks((prev) => prev + 1);
  }, []); // Empty deps = function identity NEVER changes

  return (
    <div className="demo-card" id="memo-demo-section">
      <div className="demo-header">
        <span className="badge badge-emerald">Performance Concept</span>
        <h3>8. useMemo, useCallback & React.memo vs Flutter const & Selector</h3>
      </div>

      <p className="demo-explanation">
        In Flutter, you optimize rebuilds using <code>const</code> constructors, <code>RepaintBoundary</code>, and <code>Selector</code>.
        In React, we use <code>React.memo</code> for components, <code>useMemo</code> for computed values, and <code>useCallback</code> for stable function references.
      </p>

      {/* Interactive Playground */}
      <div className="interactive-box">
        <div className="controls-row">
          <div>
            <span className="text-muted">Parent State (Triggers App Re-render): </span>
            <strong className="text-primary">{count}</strong>
          </div>
          <button
            id="parent-rebuild-btn"
            className="action-btn btn-primary"
            onClick={() => setCount((c) => c + 1)}
          >
            Re-render Parent ({count})
          </button>
        </div>

        {/* Section A: useMemo */}
        <div className="memo-section-box">
          <h4 className="section-subtitle">A. useMemo (Cached Calculation)</h4>
          <p className="text-secondary text-sm">
            Factorial of <strong>{calculationNumber}</strong> = <code>{computedFactorial.toLocaleString()}</code>
          </p>
          <div className="button-row mt-2">
            {[10, 15, 20].map((n) => (
              <button
                key={n}
                className={`pill-btn ${calculationNumber === n ? 'pill-active' : ''}`}
                onClick={() => setCalculationNumber(n)}
              >
                Calc Factorial({n})
              </button>
            ))}
          </div>
        </div>

        {/* Section B: useCallback & React.memo */}
        <div className="memo-section-box mt-3">
          <h4 className="section-subtitle">B. useCallback + React.memo (Preventing Child Rebuilds)</h4>
          <p className="text-secondary text-sm mb-2">
            Child click counter: <strong>{clicks}</strong>.
            Clicking &quot;Re-render Parent&quot; above will NOT re-render this child because its callback is wrapped in <code>useCallback</code>!
          </p>
          <ExpensiveChild
            label="Memoized Subtree Component"
            onClick={handleStableClick}
          />
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="comparison-grid">
        <div className="code-column">
          <div className="code-header flutter-header">Flutter (const & Selector)</div>
          <pre className="code-content">
{`// 1. Const skips subtree rebuild
const ExpensiveChild(
  onPressed: _handleTap, // Stable tear-off
);

// 2. Selector recomputes on change
Selector<Model, int>(
  selector: (_, m) => m.factorial(n),
  builder: (_, result, __) => Text('$result'),
);`}
          </pre>
        </div>

        <div className="code-column">
          <div className="code-header react-header">React (useMemo & useCallback)</div>
          <pre className="code-content">
{`// 1. React.memo skips re-render
const ExpensiveChild = React.memo(Child);

// 2. Stable function pointer
const handleTap = useCallback(() => {
  setClicks(c => c + 1);
}, []);

// 3. Cache computed value
const val = useMemo(() => calc(n), [n]);`}
          </pre>
        </div>
      </div>
    </div>
  );
}
