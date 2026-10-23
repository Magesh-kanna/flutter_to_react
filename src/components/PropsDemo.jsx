/**
 * ============================================================================
 * FILE: src/components/PropsDemo.jsx
 * ============================================================================
 * TOPIC: React Props vs Flutter StatelessWidget Constructor Arguments
 * ============================================================================
 * 
 * FLUTTER EQUIVALENT:
 * ```dart
 * class CustomCard extends StatelessWidget {
 *   final String title;
 *   final String subtitle;
 *   final Color color;
 *   final VoidCallback onTap;
 *   final Widget? child; // Equivalent to React's `children` prop!
 * 
 *   const CustomCard({
 *     super.key,
 *     required this.title,
 *     this.subtitle = 'Default description',
 *     this.color = Colors.blue,
 *     required this.onTap,
 *     this.child,
 *   });
 * 
 *   @override
 *   Widget build(BuildContext context) {
 *     return Card(
 *       color: color,
 *       child: InkWell(
 *         onTap: onTap,
 *         child: Column(
 *           children: [
 *             Text(title),
 *             Text(subtitle),
 *             if (child != null) child!,
 *           ],
 *         ),
 *       ),
 *     );
 *   }
 * }
 * ```
 */

import { useState } from 'react';

/**
 * CHILD COMPONENT 1: CustomCard
 * 
 * In React, props are passed as a single JavaScript object to the function:
 *   function CustomCard(props) { ... }
 * 
 * Standard practice is OBJECT DESTRUCTURING with default values:
 *   function CustomCard({ title, subtitle = '...', badge, variant = 'primary', onClick, children })
 * 
 * This is 100% equivalent to Dart's named parameters with defaults:
 *   CustomCard({required this.title, this.subtitle = '...', ...})
 */
function CustomCard({
  title,
  subtitle = 'Default subtitle if not provided',
  badge,
  variant = 'indigo',
  onClick,
  children, // Special prop in React for nested elements (like Flutter's `Widget? child`)
}) {
  return (
    <div
      className={`card-widget variant-${variant}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="card-top">
        <h4 className="card-title">{title}</h4>
        {/* Conditional rendering: Flutter's `if (badge != null) Chip(...)` */}
        {badge && <span className="card-badge">{badge}</span>}
      </div>

      <p className="card-subtitle">{subtitle}</p>

      {/* 
        FLUTTER EQUIVALENT:
        `if (child != null) child!`
        In React, any JSX passed inside `<CustomCard> <CHILD /> </CustomCard>` 
        is automatically captured in the `children` prop!
      */}
      {children && <div className="card-child-slot">{children}</div>}

      <div className="card-footer">
        <span className="tap-hint">Tap card to fire callback prop &rarr;</span>
      </div>
    </div>
  );
}

/**
 * PARENT COMPONENT: PropsDemo
 * Demonstrates how a parent widget passes properties & callbacks to child widgets.
 */
export default function PropsDemo() {
  const [clickedCard, setClickedCard] = useState('None');
  const [accent, setAccent] = useState('indigo');

  return (
    <div className="demo-card" id="props-demo-section">
      <div className="demo-header">
        <span className="badge badge-props">Data Flow Concept</span>
        <h3>2. Props & Children vs Flutter Widget Constructors</h3>
      </div>

      <p className="demo-explanation">
        In Flutter, data flows downward via <strong>named constructor arguments</strong> (<code>CustomWidget(title: 'Hello')</code>).
        In React, attributes placed on JSX tags become properties inside a single <code>props</code> object.
      </p>

      {/* Controller to change parent state */}
      <div className="interactive-box">
        <div className="status-row">
          <span>Active Variant Prop: <strong>{accent}</strong></span>
          <span>Last Clicked: <span className="highlight-text">{clickedCard}</span></span>
        </div>

        <div className="theme-switcher-row">
          <label>Select Card Accent Prop:</label>
          {['indigo', 'cyan', 'emerald'].map((v) => (
            <button
              key={v}
              className={`pill-btn ${accent === v ? 'pill-active' : ''}`}
              onClick={() => setAccent(v)}
            >
              {v.toUpperCase()}
            </button>
          ))}
        </div>

        {/* 
          Passing Props & Children to Child Components:
          Flutter equivalent:
          Row(
            children: [
              CustomCard(
                title: 'Flutter Widget',
                subtitle: 'StatelessWidget representation',
                badge: 'Dart',
                variant: accent,
                onTap: () => setState(() => clickedCard = 'Flutter Card'),
                child: Container(...),
              ),
              ...
            ],
          )
        */}
        <div className="cards-grid">
          <CustomCard
            title="Flutter StatelessWidget"
            subtitle="Constructor parameters are final fields initialized once."
            badge="Flutter"
            variant={accent}
            onClick={() => setClickedCard('Flutter Card')}
          >
            {/* This is passed as the `children` prop */}
            <div className="nested-box">
              <span>💡 I am nested inside (like Flutter's <code>child: Widget</code>)</span>
            </div>
          </CustomCard>

          <CustomCard
            title="React Functional Component"
            subtitle="Props are immutable arguments passed every time parent re-renders."
            badge="React"
            variant="cyan"
            onClick={() => setClickedCard('React Card')}
          >
            <div className="nested-box">
              <span>⚛️ Props are Read-Only (Unidirectional Data Flow)</span>
            </div>
          </CustomCard>
        </div>
      </div>

      {/* Code Comparison */}
      <div className="comparison-grid">
        <div className="code-column">
          <div className="code-header flutter-header">Flutter (Constructor Params)</div>
          <pre className="code-content">
{`class MyCard extends StatelessWidget {
  final String title;
  final Widget? child; // Nested slot
  final VoidCallback onTap;

  const MyCard({
    super.key,
    required this.title,
    this.child,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Column(
        children: [
          Text(title),
          if (child != null) child!,
        ],
      ),
    );
  }
}`}
          </pre>
        </div>

        <div className="code-column">
          <div className="code-header react-header">React (Props & Destructuring)</div>
          <pre className="code-content">
{`// Destructure props object directly
function MyCard({ title, children, onClick }) {
  return (
    <div onClick={onClick}>
      <h4>{title}</h4>
      {/* 'children' is the built-in child slot */}
      {children}
    </div>
  );
}

// Usage in parent:
<MyCard title="Hello" onClick={handleTap}>
  <p>Inside children slot!</p>
</MyCard>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
