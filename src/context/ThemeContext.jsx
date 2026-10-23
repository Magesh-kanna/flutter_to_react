/**
 * ============================================================================
 * FILE: src/context/ThemeContext.jsx
 * ============================================================================
 * FLUTTER EQUIVALENT: InheritedWidget / InheritedNotifier / Provider<T>
 * 
 * In Flutter:
 *   class AppConfigScope extends InheritedWidget {
 *     final String accentColor;
 *     final String activeRole;
 *     final Function(String) setAccentColor;
 *     ...
 *     static AppConfigScope of(BuildContext context) => 
 *       context.dependOnInheritedWidgetOfExactType<AppConfigScope>()!;
 *   }
 *
 * In React:
 *   1. `createContext()` creates the Context object (InheritedWidget definition).
 *   2. `<ThemeContext.Provider value={...}>` wraps the subtree to inject data.
 *   3. `useContext(ThemeContext)` consumes it anywhere in any child widget!
 * ============================================================================
 */

import { createContext, useState, useContext } from 'react';

// Step 1: Create Context with default fallback values
export const ThemeContext = createContext({
  accentColor: 'blue',
  setAccentColor: () => {},
  userRole: 'Senior Flutter Engineer',
  setUserRole: () => {},
});

/**
 * Step 2: Provider Component (InheritedWidget Provider Wrapper)
 * 
 * FLUTTER EQUIVALENT:
 * A StatefulWidget wrapping `InheritedWidget` so that when state changes,
 * all dependent widgets subscribed via `useContext` automatically rebuild!
 */
export function ThemeProvider({ children }) {
  const [accentColor, setAccentColor] = useState('blue'); // 'blue' | 'indigo' | 'emerald' | 'purple'
  const [userRole, setUserRole] = useState('Senior Flutter Engineer');

  return (
    <ThemeContext.Provider
      value={{
        accentColor,
        setAccentColor,
        userRole,
        setUserRole,
      }}
    >
      {/* `children` is equivalent to `final Widget child;` in Flutter! */}
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Step 3: Custom Hook for Clean Consumer Access
 * 
 * FLUTTER EQUIVALENT:
 * static AppConfigScope of(BuildContext context) => ...
 * 
 * Usage in any descendant component:
 *   const { accentColor, setAccentColor } = useTheme();
 * Flutter equivalent:
 *   final config = AppConfigScope.of(context);
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider (Missing InheritedWidget ancestor!)');
  }
  return context;
}
