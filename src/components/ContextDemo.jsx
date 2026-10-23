/**
 * ============================================================================
 * FILE: src/components/ContextDemo.jsx
 * ============================================================================
 * TOPIC: React Context API vs Flutter InheritedWidget / Provider / Riverpod
 * ============================================================================
 * 
 * FLUTTER EQUIVALENT:
 * ```dart
 * // 1. Definition (InheritedWidget)
 * class AppConfigScope extends InheritedWidget {
 *   final String accentColor;
 *   final Function(String) setAccentColor;
 * 
 *   const AppConfigScope({
 *     required this.accentColor,
 *     required this.setAccentColor,
 *     required super.child,
 *     super.key,
 *   });
 * 
 *   static AppConfigScope of(BuildContext context) {
 *     return context.dependOnInheritedWidgetOfExactType<AppConfigScope>()!;
 *   }
 * 
 *   @override
 *   bool updateShouldNotify(AppConfigScope oldWidget) => accentColor != oldWidget.accentColor;
 * }
 * 
 * // 2. Consumption anywhere deep in the tree:
 * final config = AppConfigScope.of(context);
 * config.setAccentColor('emerald');
 * ```
 */

import { useTheme } from '../context/ThemeContext';

// Deep child component with NO props passed to it!
function DeeplyNestedButton() {
  /**
   * FLUTTER EQUIVALENT:
   * `final theme = Theme.of(context);`
   * Or `context.watch<AppConfigNotifier>();`
   * 
   * Notice: We did NOT pass `accentColor` or `setAccentColor` down through props!
   * React looks UP the Fiber tree until it finds the matching `<ThemeContext.Provider>`.
   */
  const { accentColor, setAccentColor, userRole, setUserRole } = useTheme();

  return (
    <div className="deep-nested-container">
      <div className="nested-header">
        <span className="nested-badge">Deep Child Component (No Props Passed!)</span>
        <span>Active Context Accent: <strong className="text-capitalize">{accentColor}</strong></span>
      </div>

      <p className="nested-desc">
        I read and update global configuration directly using <code>useContext(ThemeContext)</code>,
        bypassing intermediate components completely—exactly like <code>InheritedWidget.of(context)</code> in Flutter!
      </p>

      <div className="context-action-row">
        <span className="text-secondary text-sm">Select Global Accent Color:</span>
        <div className="button-group-clean">
          {['blue', 'indigo', 'emerald', 'purple'].map((color) => (
            <button
              key={color}
              id={`context-color-${color}`}
              className={`pill-btn ${accentColor === color ? 'pill-active' : ''}`}
              onClick={() => setAccentColor(color)}
            >
              {color.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="user-role-edit mt-3">
        <span className="text-secondary text-sm">Active User Role:</span>
        <input
          type="text"
          className="text-input text-sm mt-1"
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
        />
      </div>
    </div>
  );
}

export default function ContextDemo() {
  const { accentColor, userRole } = useTheme();

  return (
    <div className="demo-card" id="context-demo-section">
      <div className="demo-header">
        <span className="badge badge-purple">Global State Concept</span>
        <h3>6. React Context vs InheritedWidget & Provider / Riverpod</h3>
      </div>

      <p className="demo-explanation">
        In Flutter, <code>InheritedWidget</code> allows data to be accessed anywhere down the element tree via <code>BuildContext</code>.
        In React, the <strong>Context API</strong> (<code>createContext</code>, <code>Provider</code>, <code>useContext</code>) solves the same &quot;prop-drilling&quot; challenge.
      </p>

      {/* Interactive Box */}
      <div className="interactive-box">
        <div className="context-visualizer">
          <div className="tree-diagram">
            <div className="tree-node root-node">
              <code>&lt;ThemeProvider&gt;</code> (InheritedWidget Provider: accent=&quot;{accentColor}&quot;, role=&quot;{userRole}&quot;)
            </div>
            <div className="tree-line">&darr;</div>
            <div className="tree-node intermediate-node">
              <code>&lt;App&gt; &rarr; &lt;MainLayout&gt;</code> (Intermediate components without theme props)
            </div>
            <div className="tree-line">&darr;</div>
            <div className="tree-node consumer-node">
              <code>&lt;DeeplyNestedButton&gt;</code> (Consumer via <code>useContext()</code>)
            </div>
          </div>

          <DeeplyNestedButton />
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="comparison-grid">
        <div className="code-column">
          <div className="code-header flutter-header">Flutter (InheritedWidget / Provider)</div>
          <pre className="code-content">
{`// 1. In Flutter tree:
Provider<AppConfig>(
  create: (_) => AppConfig(),
  child: MyApp(),
)

// 2. Access in any descendant:
Widget build(BuildContext context) {
  // Subscribes to updates via context
  final config = context.watch<AppConfig>();
  return Text(config.accentColor);
}`}
          </pre>
        </div>

        <div className="code-column">
          <div className="code-header react-header">React (Context API)</div>
          <pre className="code-content">
{`// 1. In React tree:
<ThemeContext.Provider value={{ accent, setAccent }}>
  <App />
</ThemeContext.Provider>

// 2. Access in any descendant:
function ChildComponent() {
  // Subscribes to updates via Hook
  const { accent, setAccent } = useContext(ThemeContext);
  return <span>{accent}</span>;
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
