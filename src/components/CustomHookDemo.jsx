/**
 * ============================================================================
 * FILE: src/components/CustomHookDemo.jsx
 * ============================================================================
 * TOPIC: Custom React Hooks vs Flutter Mixins & Service Notifiers
 * ============================================================================
 * 
 * FLUTTER EQUIVALENT:
 * ```dart
 * // 1. Custom Mixin or ChangeNotifier
 * mixin WindowSizeAware<T extends StatefulWidget> on State<T> {
 *   Size _size = Size.zero;
 *   @override
 *   void didChangeMetrics() { ... }
 * }
 * 
 * // Or Riverpod / Provider Notifier:
 * class CounterController extends StateNotifier<int> {
 *   CounterController() : super(0);
 *   void increment() => state++;
 * }
 * ```
 */

import { useState, useEffect } from 'react';

/**
 * CUSTOM HOOK 1: useWindowSize
 * 
 * In Flutter:
 *   `MediaQuery.of(context).size` or `WidgetsBindingObserver`
 * 
 * In React:
 *   Any JavaScript function that starts with `use...` and calls other hooks
 *   is a "Custom Hook". It packages lifecycle & state for reuse across components!
 */
function useWindowDimensions() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Like Flutter's didChangeMetrics()
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    // Cleanup on unmount (like removeObserver in dispose)
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
}

/**
 * CUSTOM HOOK 2: useToggle
 * Lightweight boolean toggle logic
 */
function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);
  const toggle = () => setState((prev) => !prev);
  return [state, toggle];
}

export default function CustomHookDemo() {
  // Consuming our Custom Hooks:
  const { width, height } = useWindowDimensions();
  const [isExpanded, toggleExpanded] = useToggle(false);
  const [isMuted, toggleMuted] = useToggle(true);

  return (
    <div className="demo-card" id="custom-hook-section">
      <div className="demo-header">
        <span className="badge badge-purple">Reusable Logic Concept</span>
        <h3>9. Custom Hooks vs Flutter Mixins & Service Notifiers</h3>
      </div>

      <p className="demo-explanation">
        In Flutter, you share logic using <strong>Mixins</strong> (e.g. <code>TickerProviderStateMixin</code>) or <strong>ChangeNotifiers</strong>.
        In React, you extract any combination of hooks into custom functions starting with <code>use...</code>.
      </p>

      {/* Interactive Box */}
      <div className="interactive-box">
        {/* Custom Hook 1: Window Size */}
        <div className="hook-feature-box">
          <div className="hook-title-row">
            <span className="badge badge-indigo">Hook: useWindowDimensions()</span>
            <span className="text-muted">Flutter: MediaQuery.of(context).size</span>
          </div>
          <div className="dimensions-display">
            <div className="dim-card">
              <span className="dim-label">Viewport Width:</span>
              <strong className="dim-val">{width}px</strong>
            </div>
            <div className="dim-card">
              <span className="dim-label">Viewport Height:</span>
              <strong className="dim-val">{height}px</strong>
            </div>
            <div className="dim-card">
              <span className="dim-label">Device Category:</span>
              <strong className="dim-val">
                {width < 640 ? '📱 Mobile' : width < 1024 ? '💻 Tablet' : '🖥️ Desktop'}
              </strong>
            </div>
          </div>
          <p className="text-secondary text-sm mt-2">
            Resize your browser window! The <code>useWindowDimensions()</code> custom hook automatically captures resize events and updates state.
          </p>
        </div>

        {/* Custom Hook 2: useToggle */}
        <div className="hook-feature-box mt-3">
          <div className="hook-title-row">
            <span className="badge badge-emerald">Hook: useToggle()</span>
            <span className="text-muted">Simple reusable state machine</span>
          </div>
          <div className="toggle-demo-row">
            <button
              id="toggle-expand-btn"
              className={`action-btn ${isExpanded ? 'btn-primary' : 'btn-secondary'}`}
              onClick={toggleExpanded}
            >
              {isExpanded ? '📂 Collapse Details' : '📁 Expand Details'}
            </button>

            <button
              id="toggle-mute-btn"
              className={`action-btn ${isMuted ? 'btn-danger' : 'btn-secondary'}`}
              onClick={toggleMuted}
            >
              {isMuted ? '🔇 Audio Muted' : '🔊 Audio Active'}
            </button>
          </div>

          {isExpanded && (
            <div className="expanded-callout mt-2">
              <strong>🎉 Custom Hook Benefit:</strong>
              <p className="text-secondary text-sm">
                Custom hooks don&apos;t return JSX—they return pure values and action functions (<code>[state, toggle]</code>).
                Multiple independent widgets can invoke <code>useToggle()</code> and each gets isolated, private state!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Code Comparison */}
      <div className="comparison-grid">
        <div className="code-column">
          <div className="code-header flutter-header">Flutter (Mixin or Notifier)</div>
          <pre className="code-content">
{`// 1. Shared logic via Mixin
mixin WindowAware<T extends StatefulWidget> 
    on State<T>, WidgetsBindingObserver {
  Size size = Size.zero;
  
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }
  
  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }
}`}
          </pre>
        </div>

        <div className="code-column">
          <div className="code-header react-header">React (Custom Hook)</div>
          <pre className="code-content">
{`// 1. Pure function starting with 'use'
function useWindowDimensions() {
  const [dim, setDim] = useState({...});

  useEffect(() => {
    const onResize = () => setDim({...});
    window.addEventListener('resize', onResize);
    return () => 
      window.removeEventListener('resize', onResize);
  }, []);

  return dim;
}

// 2. Consume in ANY component:
const { width, height } = useWindowDimensions();`}
          </pre>
        </div>
      </div>
    </div>
  );
}
