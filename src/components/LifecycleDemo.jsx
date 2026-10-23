/**
 * ============================================================================
 * FILE: src/components/LifecycleDemo.jsx
 * ============================================================================
 * TOPIC: useEffect vs Flutter Lifecycle (initState, didUpdateWidget, dispose)
 * ============================================================================
 * 
 * FLUTTER EQUIVALENT:
 * ```dart
 * class TimerWidget extends StatefulWidget {
 *   final int intervalSeconds;
 *   const TimerWidget({super.key, required this.intervalSeconds});
 * 
 *   @override
 *   State<TimerWidget> createState() => _TimerWidgetState();
 * }
 * 
 * class _TimerWidgetState extends State<TimerWidget> {
 *   Timer? _timer;
 *   int _seconds = 0;
 * 
 *   @override
 *   void initState() {
 *     super.initState();
 *     _startTimer(); // 1. Run once on mount
 *   }
 * 
 *   @override
 *   void didUpdateWidget(covariant TimerWidget oldWidget) {
 *     super.didUpdateWidget(oldWidget);
 *     if (oldWidget.intervalSeconds != widget.intervalSeconds) {
 *       // 2. React to prop/parameter changes
 *       _restartTimer();
 *     }
 *   }
 * 
 *   @override
 *   void dispose() {
 *     _timer?.cancel(); // 3. Cancel subscriptions / prevent memory leaks!
 *     super.dispose();
 *   }
 * }
 * ```
 */

import { useState, useEffect } from 'react';

// Sub-component that will be mounted and unmounted to demonstrate `dispose()`
function ActiveTimer({ speedMs }) {
  const [ticks, setTicks] = useState(0);

  /**
   * FLUTTER EQUIVALENT:
   * Combines `initState()`, `didUpdateWidget()`, and `dispose()` into ONE hook!
   */
  useEffect(() => {
    // ==========================================
    // 1. THIS RUNS ON MOUNT (like initState)
    // AND ALSO WHEN `speedMs` CHANGES (like didUpdateWidget)
    // ==========================================
    console.log(`[Timer] Started interval with speed: ${speedMs}ms`);

    const intervalId = setInterval(() => {
      setTicks((prev) => prev + 1);
    }, speedMs);

    // ==========================================
    // 2. THE CLEANUP FUNCTION (like dispose in Flutter)
    // ==========================================
    // React automatically runs this return function when:
    // a) The component UNMOUNTS (removed from widget tree / DOM).
    // b) BEFORE the effect re-runs because `speedMs` changed.
    return () => {
      console.log(`[Timer] Disposing / clearing interval: ${intervalId}`);
      clearInterval(intervalId); // CRITICAL: Prevents memory leaks (just like _timer?.cancel())
    };
  }, [speedMs]); // 3. DEPENDENCY ARRAY (tells React when to re-trigger this effect)

  return (
    <div className="active-timer-card">
      <div className="timer-badge">● LIVE TIMER RUNNING</div>
      <div className="timer-value">{ticks} <span className="text-muted">ticks</span></div>
      <p className="timer-hint">Current interval speed: {speedMs}ms</p>
    </div>
  );
}

export default function LifecycleDemo() {
  const [showTimer, setShowTimer] = useState(true);
  const [speed, setSpeed] = useState(1000);
  const [docTitleCount, setDocTitleCount] = useState(0);

  /**
   * DEMONSTRATION 2: One-time Initialization
   * Flutter equivalent: `initState()`
   * Notice the EMPTY dependency array `[]`!
   */
  useEffect(() => {
    console.log('[LifecycleDemo] Component MOUNTED (initState equivalent)');
    return () => {
      console.log('[LifecycleDemo] Component UNMOUNTED (dispose equivalent)');
    };
  }, []); // Empty array = run ONCE on initial mount

  /**
   * DEMONSTRATION 3: Syncing with external system on state change
   * Flutter equivalent: `didUpdateWidget` or running code whenever a specific variable changes
   */
  useEffect(() => {
    // Updates browser tab title whenever `docTitleCount` changes
    document.title = `Clicked ${docTitleCount}x | React Learnings`;
  }, [docTitleCount]); // Only re-runs when docTitleCount changes

  return (
    <div className="demo-card" id="lifecycle-demo-section">
      <div className="demo-header">
        <span className="badge badge-lifecycle">Lifecycle Concept</span>
        <h3>3. useEffect vs initState(), didUpdateWidget(), & dispose()</h3>
      </div>

      <p className="demo-explanation">
        In Flutter, lifecycle is divided across distinct override methods (<code>initState</code>, <code>didUpdateWidget</code>, <code>dispose</code>).
        In React, the <code>useEffect</code> hook unifies all three using a declarative <strong>dependency array</strong> and a <strong>cleanup return function</strong>.
      </p>

      {/* Interactive Controls */}
      <div className="interactive-box">
        <div className="controls-row">
          <button
            id="toggle-timer-btn"
            className={`action-btn ${showTimer ? 'btn-danger' : 'btn-success'}`}
            onClick={() => setShowTimer((prev) => !prev)}
          >
            {showTimer ? '⏹ Unmount Widget (Call dispose)' : '▶ Mount Widget (Call initState)'}
          </button>

          <div className="speed-buttons">
            <span className="text-muted">Timer Frequency:</span>
            {[500, 1000, 2000].map((s) => (
              <button
                key={s}
                className={`pill-btn ${speed === s ? 'pill-active' : ''}`}
                onClick={() => setSpeed(s)}
                disabled={!showTimer}
              >
                {s}ms
              </button>
            ))}
          </div>
        </div>

        {/* Conditional rendering: Flutter's `if (showTimer) ActiveTimer(...)` */}
        <div className="mount-container">
          {showTimer ? (
            <ActiveTimer speedMs={speed} />
          ) : (
            <div className="unmounted-placeholder">
              <span>🛑 Component Unmounted! Clean-up function was executed. Memory freed.</span>
            </div>
          )}
        </div>

        {/* Sync Effect trigger */}
        <div className="sync-row">
          <span>Browser Title Sync Effect: </span>
          <button
            className="pill-btn pill-active"
            onClick={() => setDocTitleCount((c) => c + 1)}
          >
            Update Tab Title ({docTitleCount})
          </button>
        </div>
      </div>

      {/* Code Comparison Table */}
      <div className="comparison-grid">
        <div className="code-column">
          <div className="code-header flutter-header">Flutter Lifecycle Methods</div>
          <pre className="code-content">
{`@override
void initState() {
  super.initState();
  _timer = Timer.periodic(...);
}

@override
void didUpdateWidget(old) {
  if (old.speed != widget.speed) {
    _restartTimer();
  }
}

@override
void dispose() {
  _timer?.cancel(); // cleanup!
  super.dispose();
}`}
          </pre>
        </div>

        <div className="code-column">
          <div className="code-header react-header">React (Unified in useEffect)</div>
          <pre className="code-content">
{`useEffect(() => {
  // 1. Run on mount & when 'speed' changes
  // (initState + didUpdateWidget)
  const timer = setInterval(..., speed);

  // 2. Return cleanup function
  // (dispose)
  return () => {
    clearInterval(timer);
  };
}, [speed]); 
// 3. Dependency Array:
// []      = run once on mount (initState)
// [speed] = re-run if speed changes
// none    = run on EVERY render`}
          </pre>
        </div>
      </div>
    </div>
  );
}
