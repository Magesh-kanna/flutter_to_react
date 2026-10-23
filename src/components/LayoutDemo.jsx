/**
 * ============================================================================
 * FILE: src/components/LayoutDemo.jsx
 * ============================================================================
 * TOPIC: CSS Flexbox vs Flutter Column, Row, Wrap, Expanded, & Spacer
 * ============================================================================
 * 
 * FLUTTER EQUIVALENT:
 * ```dart
 * Row(
 *   mainAxisAlignment: MainAxisAlignment.spaceBetween,
 *   crossAxisAlignment: CrossAxisAlignment.center,
 *   children: [
 *     Text('Left'),
 *     const Spacer(),
 *     Expanded(child: Container(color: Colors.blue)),
 *     Text('Right'),
 *   ],
 * )
 * ```
 */

import { useState } from 'react';

export default function LayoutDemo() {
  const [direction, setDirection] = useState('row'); // 'row' | 'column'
  const [justify, setJustify] = useState('space-between'); // 'flex-start' | 'center' | 'space-between'
  const [align, setAlign] = useState('center'); // 'flex-start' | 'center' | 'stretch'
  const [gap, setGap] = useState(12);

  return (
    <div className="demo-card" id="layout-demo-section">
      <div className="demo-header">
        <span className="badge badge-cyan">Layout System Concept</span>
        <h3>11. CSS Flexbox vs Flutter Column, Row, Wrap, & Spacer</h3>
      </div>

      <p className="demo-explanation">
        Flutter&apos;s <code>Column</code> and <code>Row</code> widgets were directly inspired by <strong>CSS Flexbox</strong>.
        In React, you style standard <code>&lt;div&gt;</code> elements with flexbox properties instead of needing separate container widgets.
      </p>

      {/* Interactive Controls */}
      <div className="interactive-box">
        <div className="layout-controls-grid">
          <div className="control-cell">
            <label>Flex Direction (Column vs Row):</label>
            <div className="button-group-clean">
              <button
                className={`pill-btn ${direction === 'row' ? 'pill-active' : ''}`}
                onClick={() => setDirection('row')}
              >
                Row (Horizontal)
              </button>
              <button
                className={`pill-btn ${direction === 'column' ? 'pill-active' : ''}`}
                onClick={() => setDirection('column')}
              >
                Column (Vertical)
              </button>
            </div>
          </div>

          <div className="control-cell">
            <label>Justify Content (mainAxisAlignment):</label>
            <div className="button-group-clean">
              {['flex-start', 'center', 'space-between'].map((j) => (
                <button
                  key={j}
                  className={`pill-btn ${justify === j ? 'pill-active' : ''}`}
                  onClick={() => setJustify(j)}
                >
                  {j === 'flex-start' ? 'Start' : j === 'center' ? 'Center' : 'SpaceBetween'}
                </button>
              ))}
            </div>
          </div>

          <div className="control-cell">
            <label>Gap Spacing (SizedBox replacement):</label>
            <div className="button-group-clean">
              {[8, 16, 24].map((g) => (
                <button
                  key={g}
                  className={`pill-btn ${gap === g ? 'pill-active' : ''}`}
                  onClick={() => setGap(g)}
                >
                  {g}px
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Playground Canvas */}
        <div className="layout-preview-canvas mt-3">
          <div
            className="flex-demo-box"
            style={{
              display: 'flex',
              flexDirection: direction,
              justifyContent: justify,
              alignItems: align,
              gap: `${gap}px`,
              minHeight: '140px',
            }}
          >
            <div className="flex-box-item item-1">
              <span>Widget A</span>
              <small>Flex Item 1</small>
            </div>

            <div className="flex-box-item item-2">
              <span>Widget B</span>
              <small>Flex Item 2</small>
            </div>

            <div className="flex-box-item item-3" style={{ flex: direction === 'row' ? '1' : 'none' }}>
              <span>Widget C (Expanded / flex: 1)</span>
              <small>Fills available space!</small>
            </div>
          </div>
        </div>

        <div className="current-styles-code mt-2">
          <code>
            {`display: flex; flex-direction: ${direction}; justify-content: ${justify}; gap: ${gap}px;`}
          </code>
        </div>
      </div>

      {/* Code Comparison */}
      <div className="comparison-grid">
        <div className="code-column">
          <div className="code-header flutter-header">Flutter Layout Widgets</div>
          <pre className="code-content">
{`// Flutter uses dedicated widgets:
Row(
  mainAxisAlignment: MainAxisAlignment.spaceBetween,
  children: [
    WidgetA(),
    const SizedBox(width: 16), // Gap
    Expanded(child: WidgetB()), // flex: 1
    WidgetC(),
  ],
)`}
          </pre>
        </div>

        <div className="code-column">
          <div className="code-header react-header">React / CSS Flexbox</div>
          <pre className="code-content">
{`// React uses styling on standard containers:
<div style={{
  display: 'flex',
  justifyContent: 'space-between',
  gap: '16px', // No SizedBox needed!
}}>
  <WidgetA />
  <div style={{ flex: 1 }}><WidgetB /></div>
  <WidgetC />
</div>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
