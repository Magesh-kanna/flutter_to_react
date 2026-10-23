/**
 * ============================================================================
 * FILE: src/main.jsx
 * ============================================================================
 * FLUTTER EQUIVALENT: lib/main.dart
 * 
 * In Flutter:
 *   void main() {
 *     runApp(
 *       const MyApp(), // Top-level root widget
 *     );
 *   }
 *
 * In React:
 *   createRoot(document.getElementById('root')).render(<App />);
 * ============================================================================
 */

// 1. IMPORTING DEPENDENCIES
// Flutter: `import 'package:flutter/material.dart';`
// React: Named imports from 'react' package (like Dart's `import ... show StrictMode`)
import { StrictMode } from 'react';

// `react-dom` is the bridge between React's Virtual DOM and browser's real HTML DOM.
// Flutter equivalent: The Flutter Engine embedding layer (e.g. FlutterView / FlutterWebRenderer)
// which takes the RenderObject tree and paints it onto the Skia / Impeller canvas.
import { createRoot } from 'react-dom/client';

// Global stylesheet (equivalent to AppTheme or ThemeData defined in Flutter's MaterialApp)
import './index.css';

// Root Component (equivalent to your top-level `MyApp` StatelessWidget in Flutter)
import App from './App.jsx';

/**
 * 2. MOUNTING TO THE DOM:
 * 
 * `document.getElementById('root')`:
 *   Finds `<div id="root"></div>` in index.html.
 * 
 * `createRoot(...)`:
 *   Initializes the React Fiber reconciliation engine on that DOM container.
 * 
 * `.render(...)`:
 *   FLUTTER EQUIVALENT: `runApp(const MyApp());`
 *   Kicks off the initial build of the component tree and displays it on screen.
 * 
 * `<StrictMode>`:
 *   FLUTTER EQUIVALENT: Debug-mode assertions and checks (`assert(...)`).
 *   In development mode, StrictMode renders components TWICE to detect unexpected side-effects,
 *   deprecated APIs, and memory leaks. It has ZERO overhead in production (`npm run build`).
 */
const rootElement = document.getElementById('root');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
