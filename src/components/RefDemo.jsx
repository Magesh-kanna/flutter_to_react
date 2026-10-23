/**
 * ============================================================================
 * FILE: src/components/RefDemo.jsx
 * ============================================================================
 * TOPIC: useRef Hook vs Flutter GlobalKey, FocusNode, & Instance Variables
 * ============================================================================
 * 
 * FLUTTER EQUIVALENT:
 * ```dart
 * class MyWidgetState extends State<MyWidget> {
 *   // 1. Focus control
 *   final FocusNode _focusNode = FocusNode();
 * 
 *   // 2. Direct widget/renderbox reference
 *   final GlobalKey _cardKey = GlobalKey();
 * 
 *   // 3. Mutable value that does NOT trigger rebuild when changed
 *   int _backgroundCounter = 0; 
 * 
 *   @override
 *   void dispose() {
 *     _focusNode.dispose();
 *     super.dispose();
 *   }
 * }
 * ```
 */

import { useState, useRef } from 'react';

export default function RefDemo() {
  /**
   * USE CASE 1: Mutable value that does NOT trigger a re-render
   * 
   * In Flutter:
   *   You can declare `int _clickCountWithoutRebuild = 0;` inside `_MyWidgetState`.
   *   When you do `_clickCountWithoutRebuild++`, the variable updates, but
   *   NO build() method is called until you explicitly call `setState()`.
   * 
   * In React:
   *   If you declare a normal `let x = 0;`, it resets back to 0 on EVERY render!
   *   `useRef(0)` returns an object `{ current: 0 }` that PERSISTS across renders
   *   and changing `.current` DOES NOT trigger a re-render.
   */
  const renderCountRef = useRef(1);
  const clickTrackerRef = useRef(0);

  // State variable (updating this WILL trigger a re-render)
  const [renderTrigger, setRenderTrigger] = useState(0);

  // Track total renders
  renderCountRef.current = renderCountRef.current + 1;

  /**
   * USE CASE 2: Direct DOM / Element Access (FocusNode & GlobalKey)
   * 
   * In Flutter:
   *   `final FocusNode _nameFocusNode = FocusNode();`
   *   `_nameFocusNode.requestFocus();`
   * 
   * In React:
   *   `const inputRef = useRef(null);`
   *   `<input ref={inputRef} />`
   *   `inputRef.current.focus();`
   */
  const inputRef = useRef(null);
  const boxRef = useRef(null);
  const [measuredWidth, setMeasuredWidth] = useState(null);

  const handleFocusInput = () => {
    // Flutter: `_focusNode.requestFocus();`
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  };

  const handleMeasureBox = () => {
    /**
     * FLUTTER EQUIVALENT:
     * final renderBox = _cardKey.currentContext?.findRenderObject() as RenderBox?;
     * final size = renderBox?.size;
     */
    if (boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect();
      setMeasuredWidth(Math.round(rect.width));
    }
  };

  return (
    <div className="demo-card" id="ref-demo-section">
      <div className="demo-header">
        <span className="badge badge-indigo">DOM & Reference Concept</span>
        <h3>7. useRef vs FocusNode, GlobalKey & Mutable Instance Fields</h3>
      </div>

      <p className="demo-explanation">
        In Flutter, you use <code>FocusNode</code> to manage keyboard focus, <code>GlobalKey</code> to inspect RenderBoxes, and simple private fields for values that change without rebuilding.
        In React, the <code>useRef</code> hook solves all three needs without triggering re-renders.
      </p>

      {/* Interactive Section 1: Focus Node */}
      <div className="interactive-box">
        <h4 className="section-subtitle">A. DOM Element Reference (Flutter FocusNode Equivalent)</h4>
        <div className="input-group-row">
          <input
            ref={inputRef}
            type="text"
            className="text-input"
            defaultValue="Tap button below to programmatically focus me!"
          />
          <button
            id="focus-input-btn"
            className="action-btn btn-primary"
            onClick={handleFocusInput}
          >
            ⚡ Focus Field (FocusNode.requestFocus)
          </button>
        </div>
      </div>

      {/* Interactive Section 2: Render Object Measurement */}
      <div className="interactive-box">
        <h4 className="section-subtitle">B. Measuring Elements (Flutter GlobalKey & findRenderObject Equivalent)</h4>
        <div ref={boxRef} className="measurement-box">
          <span>📐 Measurable Container Box (Inspect my pixel dimensions)</span>
          {measuredWidth && (
            <span className="measured-result">Current Width: <strong>{measuredWidth}px</strong></span>
          )}
        </div>
        <button
          id="measure-box-btn"
          className="action-btn btn-secondary mt-2"
          onClick={handleMeasureBox}
        >
          Measure Box Dimensions (findRenderObject().size)
        </button>
      </div>

      {/* Interactive Section 3: Non-rebuilding state */}
      <div className="interactive-box">
        <h4 className="section-subtitle">C. Value Persistence without Re-render (Flutter State field without setState)</h4>
        <div className="stats-row-clean">
          <div className="stat-card">
            <span className="stat-label">Component Total Re-renders:</span>
            <span className="stat-number">{renderCountRef.current}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Silent Click Ref (No Re-render):</span>
            <span className="stat-number">{clickTrackerRef.current}</span>
          </div>
        </div>

        <div className="button-row mt-2">
          <button
            id="silent-ref-btn"
            className="action-btn btn-secondary"
            onClick={() => {
              clickTrackerRef.current += 1;
              console.log('Silent Ref incremented:', clickTrackerRef.current);
              alert(`Silent Ref value is now: ${clickTrackerRef.current} (Notice the UI did NOT re-render!)`);
            }}
          >
            Increment Ref (Silent - No Re-render)
          </button>

          <button
            id="trigger-render-btn"
            className="action-btn btn-primary"
            onClick={() => setRenderTrigger((c) => c + 1)}
          >
            Trigger Real Re-render (setState)
          </button>
        </div>
      </div>

      {/* Side-by-side Code Comparison */}
      <div className="comparison-grid">
        <div className="code-column">
          <div className="code-header flutter-header">Flutter (FocusNode & GlobalKey)</div>
          <pre className="code-content">
{`// 1. Focus management
final _focusNode = FocusNode();
TextField(focusNode: _focusNode);
_focusNode.requestFocus();

// 2. Measure RenderBox
final _key = GlobalKey();
Container(key: _key);
final box = _key.currentContext
  ?.findRenderObject() as RenderBox?;

// 3. Variable without rebuild
int _silentCount = 0;
_silentCount++; // No setState()`}
          </pre>
        </div>

        <div className="code-column">
          <div className="code-header react-header">React (useRef)</div>
          <pre className="code-content">
{`// 1. Focus management
const inputRef = useRef(null);
<input ref={inputRef} />
inputRef.current.focus();

// 2. Measure DOM node
const boxRef = useRef(null);
<div ref={boxRef} />
const rect = boxRef.current
  .getBoundingClientRect();

// 3. Variable without re-render
const countRef = useRef(0);
countRef.current += 1; // No re-render`}
          </pre>
        </div>
      </div>
    </div>
  );
}
