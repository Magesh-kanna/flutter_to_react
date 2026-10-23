/**
 * ============================================================================
 * FILE: src/App.jsx
 * ============================================================================
 * FLUTTER EQUIVALENT: lib/app.dart (or MaterialApp / Scaffold top-level widget)
 * 
 * In Flutter:
 *   class MyApp extends StatelessWidget {
 *     const MyApp({super.key});
 * 
 *     @override
 *     Widget build(BuildContext context) {
 *       return MaterialApp(
 *         title: 'React for Flutter Devs',
 *         theme: ThemeData.light(),
 *         home: Scaffold(
 *           appBar: AppBar(...),
 *           body: ...,
 *         ),
 *       );
 *     }
 *   }
 * ============================================================================
 */

import { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import CounterDemo from './components/CounterDemo';
import PropsDemo from './components/PropsDemo';
import LifecycleDemo from './components/LifecycleDemo';
import ListDemo from './components/ListDemo';
import FormDemo from './components/FormDemo';
import ContextDemo from './components/ContextDemo';
import RefDemo from './components/RefDemo';
import MemoDemo from './components/MemoDemo';
import CustomHookDemo from './components/CustomHookDemo';
import AsyncDataDemo from './components/AsyncDataDemo';
import LayoutDemo from './components/LayoutDemo';
import QuestionsDeepDive from './components/QuestionsDeepDive';
import RoadmapAndCheatSheet from './components/RoadmapAndCheatSheet';
import './App.css';

/**
 * Main Content Component
 * Wrapped by ThemeProvider so it can consume the app context.
 */
function MainLayout() {
  const { accentColor, userRole } = useTheme();

  // Tab State: Like Flutter's DefaultTabController or BottomNavigationBar `currentIndex`
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: '🌟 All Concepts', flutterTag: 'Overview' },
    { id: 'state', label: '1. useState', flutterTag: 'StatefulWidget' },
    { id: 'props', label: '2. Props & Children', flutterTag: 'StatelessWidget' },
    { id: 'lifecycle', label: '3. useEffect', flutterTag: 'initState/dispose' },
    { id: 'lists', label: '4. Lists & Keys', flutterTag: 'ListView.builder' },
    { id: 'forms', label: '5. Forms & Inputs', flutterTag: 'TextEditingController' },
    { id: 'context', label: '6. Context API', flutterTag: 'InheritedWidget' },
    { id: 'ref', label: '7. useRef & DOM', flutterTag: 'FocusNode/GlobalKey' },
    { id: 'memo', label: '8. useMemo & memo', flutterTag: 'const/Selector' },
    { id: 'custom-hook', label: '9. Custom Hooks', flutterTag: 'Mixins/Notifiers' },
    { id: 'async', label: '10. Async Fetching', flutterTag: 'FutureBuilder' },
    { id: 'layout', label: '11. Flexbox Layout', flutterTag: 'Column/Row/Spacer' },
    { id: 'qa', label: '12. Deep Q&A & Quiz', flutterTag: 'Interview & Gotchas' },
    { id: 'roadmap', label: '13. 90-Day Roadmap', flutterTag: 'Architecture' },
  ];

  return (
    <div className={`app-shell accent-${accentColor}`}>
      {/* 
        FLUTTER EQUIVALENT: 
        Scaffold(appBar: AppBar(...))
      */}
      <header className="app-header">
        <div className="header-container">
          <div className="brand-group">
            <div className="logos-bridge">
              <span className="flutter-logo-badge">Flutter</span>
              <span className="bridge-icon">&rarr;</span>
              <span className="react-logo-badge">React 19</span>
            </div>
            <div>
              <h1 className="main-title">ReactJS for Flutter Engineers</h1>
              <p className="subtitle">Single Page App &bull; Clean Light Mode &bull; Production Concepts</p>
            </div>
          </div>

          <div className="header-meta">
            <span className="user-role-badge">👤 {userRole}</span>
            <button
              className="roadmap-header-btn"
              onClick={() => setActiveTab('roadmap')}
            >
              🎯 90-Day Plan
            </button>
          </div>
        </div>

        {/* 
          FLUTTER EQUIVALENT:
          TabBar(isScrollable: true, tabs: [...])
        */}
        <nav className="tab-navigation">
          <div className="tab-scroll-container">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                className={`tab-btn ${activeTab === tab.id ? 'tab-btn-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.label}</span>
                <span className="tab-flutter-pill">{tab.flutterTag}</span>
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* 
        FLUTTER EQUIVALENT:
        Body of Scaffold with IndexedStack or conditional Widget selection:
        `body: switch (activeTab) { ... }`
      */}
      <main className="app-main-content">
        {/* Quick Orientation Banner */}
        <div className="welcome-banner">
          <div className="banner-left">
            <h3>From Flutter Production to React Mastery</h3>
            <p>
              Declarative state machines, component trees, and reconciliation algorithms are identical between Flutter and React.
              Explore the 11 concept modules below with live interactive demos and line-by-line Flutter equivalent comments.
            </p>
          </div>
          <div className="banner-right">
            <span className="concept-count-pill">{tabs.length - 2} Core Concepts</span>
          </div>
        </div>

        {/* Dynamic Display based on activeTab */}
        {(activeTab === 'all' || activeTab === 'state') && <CounterDemo />}
        {(activeTab === 'all' || activeTab === 'props') && <PropsDemo />}
        {(activeTab === 'all' || activeTab === 'lifecycle') && <LifecycleDemo />}
        {(activeTab === 'all' || activeTab === 'lists') && <ListDemo />}
        {(activeTab === 'all' || activeTab === 'forms') && <FormDemo />}
        {(activeTab === 'all' || activeTab === 'context') && <ContextDemo />}
        {(activeTab === 'all' || activeTab === 'ref') && <RefDemo />}
        {(activeTab === 'all' || activeTab === 'memo') && <MemoDemo />}
        {(activeTab === 'all' || activeTab === 'custom-hook') && <CustomHookDemo />}
        {(activeTab === 'all' || activeTab === 'async') && <AsyncDataDemo />}
        {(activeTab === 'all' || activeTab === 'layout') && <LayoutDemo />}
        {(activeTab === 'all' || activeTab === 'qa') && <QuestionsDeepDive />}
        {(activeTab === 'all' || activeTab === 'roadmap') && <RoadmapAndCheatSheet />}
      </main>

      <footer className="app-footer">
        <p>Built with React 19 & Vite &bull; Designed strictly for Flutter Production Engineers mastering React &bull; Light Mode System</p>
      </footer>
    </div>
  );
}

/**
 * Root App Component
 * FLUTTER EQUIVALENT:
 * MultiProvider(
 *   providers: [ChangeNotifierProvider(create: (_) => ThemeNotifier())],
 *   child: const MainLayout(),
 * )
 */
export default function App() {
  return (
    <ThemeProvider>
      <MainLayout />
    </ThemeProvider>
  );
}
