/**
 * ============================================================================
 * FILE: src/data/flutterReactMapping.js
 * ============================================================================
 * Complete Dictionary & Cheat Sheet: Flutter vs React
 * ============================================================================
 */

export const FLUTTER_REACT_DICTIONARY = [
  {
    category: 'Architecture & Roots',
    flutter: 'lib/main.dart (void main() => runApp(MyApp()))',
    react: 'src/main.jsx (createRoot(document.getElementById("root")).render(<App />))',
    detail: 'Both mount the root UI component tree to the platform runtime.',
  },
  {
    category: 'Package Manager',
    flutter: 'pubspec.yaml + flutter pub get',
    react: 'package.json + npm install (or pnpm / yarn / bun)',
    detail: 'Both specify external libraries, dev tools, and project scripts.',
  },
  {
    category: 'Component Model',
    flutter: 'StatelessWidget (immutable configuration)',
    react: 'Functional Component receiving props',
    detail: 'Pure function taking inputs and returning UI representation.',
  },
  {
    category: 'Stateful Components',
    flutter: 'StatefulWidget + State<T> class',
    react: 'Functional Component with useState or useReducer hooks',
    detail: 'React deprecated Class Components in favor of Hooks since 2019.',
  },
  {
    category: 'Triggering Rebuilds',
    flutter: 'setState(() { _counter++; })',
    react: 'setCounter((prev) => prev + 1)',
    detail: 'CRITICAL: In Flutter you mutate the variable inside setState; in React, state is STRICTLY immutable.',
  },
  {
    category: 'UI Declaration',
    flutter: 'Widget build(BuildContext context) { return Column(...); }',
    react: 'function Component() { return ( <div className="...">...</div> ); }',
    detail: 'Flutter uses Dart classes; React uses JSX (HTML-like syntax inside JS).',
  },
  {
    category: 'Constructor Parameters',
    flutter: 'MyWidget({required this.title, this.subtitle})',
    react: 'function MyWidget({ title, subtitle = "default" })',
    detail: 'Object destructuring in React corresponds directly to Dart named parameters.',
  },
  {
    category: 'Child Slot',
    flutter: 'final Widget child; or List<Widget> children;',
    react: 'const { children } = props;',
    detail: 'React reserves the special prop name children for nested JSX elements.',
  },
  {
    category: 'Lifecycle: Init',
    flutter: 'initState() in State class',
    react: 'useEffect(() => { ... }, []) (empty dependency array)',
    detail: 'Runs exactly once after the component mounts on the screen.',
  },
  {
    category: 'Lifecycle: Cleanup',
    flutter: 'dispose() (e.g. _controller.dispose(), timer.cancel())',
    react: 'useEffect(() => { return () => { cleanup(); }; }, [])',
    detail: 'The returned function from useEffect executes when the component unmounts.',
  },
  {
    category: 'Lifecycle: Parameter Updates',
    flutter: 'didUpdateWidget(covariant MyWidget oldWidget)',
    react: 'useEffect(() => { ... }, [propA, propB])',
    detail: 'Re-runs whenever values in the dependency array change across renders.',
  },
  {
    category: 'Rendering Collections',
    flutter: 'ListView.builder(itemCount: n, itemBuilder: ...)',
    react: 'items.map((item) => <Item key={item.id} />)',
    detail: 'Array.map transforms Dart/JS collections into JSX nodes.',
  },
  {
    category: 'Element Identity / Keys',
    flutter: 'Key("id") or ValueKey(item.id)',
    react: 'key={item.id} prop on the root JSX element in loop',
    detail: 'Preserves component identity during reconciliation/diffing.',
  },
  {
    category: 'Text Input',
    flutter: 'TextEditingController + TextField(controller: ...)',
    react: 'Controlled input: <input value={val} onChange={e => setVal(e.target.value)} />',
    detail: 'React inputs mirror state directly; no manual controller disposal needed.',
  },
  {
    category: 'Dependency Injection / Inherited State',
    flutter: 'InheritedWidget, Provider.of(context), Riverpod ref.watch',
    react: 'React.createContext + <Context.Provider> + useContext(Context)',
    detail: 'Allows passing data through the tree without prop-drilling.',
  },
  {
    category: 'DOM / Focus / Ref',
    flutter: 'FocusNode + GlobalKey<State>()',
    react: 'useRef(null) (inputRef.current.focus())',
    detail: 'Direct access to DOM nodes and mutable values that do not trigger re-render on change.',
  },
  {
    category: 'Optimization & Subtree Caching',
    flutter: 'const MyWidget() + Selector<T, S>()',
    react: 'React.memo(Component) + useMemo(() => calc(val), [val])',
    detail: 'Skipping unnecessary subtree rebuilds and memoizing expensive computations.',
  },
  {
    category: 'Callback Stability',
    flutter: 'Method tear-offs (onPressed: _handleTap)',
    react: 'useCallback(() => { ... }, [deps])',
    detail: 'Preserves function pointer identity across re-renders to prevent child invalidation.',
  },
  {
    category: 'Reusable Logic',
    flutter: 'Mixins (TickerProviderStateMixin) / Service Notifiers',
    react: 'Custom Hooks (useWindowDimensions, useDebounce)',
    detail: 'Extracting stateful lifecycle logic into standalone reusable functions.',
  },
  {
    category: 'Asynchronous UI & Futures',
    flutter: 'FutureBuilder<T>(future: ..., builder: ...)',
    react: 'useEffect + useState({ data, loading, error }) + AbortController',
    detail: 'Handling loading, data, and error states over the network with cancellation.',
  },
  {
    category: 'Request Cancellation',
    flutter: 'Dio CancelToken.cancel() on dispose',
    react: 'const controller = new AbortController(); signal: controller.signal',
    detail: 'Halts ongoing fetch requests when the component unmounts.',
  },
  {
    category: 'Layout: Flex Containers',
    flutter: 'Column(children: [...]), Row(children: [...])',
    react: '<div style={{ display: "flex", flexDirection: "column" | "row" }}>',
    detail: 'CSS Flexbox is the web foundation that Flutter flex layout was based on.',
  },
  {
    category: 'Layout: Spacing',
    flutter: 'SizedBox(height: 16), Padding(padding: ...)',
    react: 'CSS gap: 16px; or padding: 16px; or margin: 16px;',
    detail: 'Web uses the CSS Box Model (margin, border, padding, content).',
  },
  {
    category: 'Layout: Expanded & Spacer',
    flutter: 'Spacer(), Expanded(child: ...)',
    react: 'flex: 1; or margin-left: auto;',
    detail: 'Expands to consume remaining flex space in the axis.',
  },
];

export const NINETY_DAY_ROADMAP = [
  {
    phase: 'Phase 1: Foundation (Days 1–14)',
    title: 'Modern JS/ES6+ & React Mental Model Shift',
    focus: [
      'Master Arrow Functions, Object & Array Destructuring, Spread/Rest (...)',
      'JavaScript Array methods: .map(), .filter(), .reduce(), .find()',
      'Async JavaScript: Promises, async/await, fetch() vs Dart Futures/Streams',
      'Mental Model: Declarative Component Tree, Virtual DOM Fiber vs Flutter RenderObject Tree',
    ],
    milestone: 'Build this exact interactive React demo project from scratch without hesitation.',
  },
  {
    phase: 'Phase 2: Core React Mastery (Days 15–30)',
    title: 'Hooks, Lifecycle, and Component Architecture',
    focus: [
      'useState and state immutability patterns (nested objects, lists)',
      'useEffect lifecycle mechanics, dependency arrays, cleanup functions',
      'useRef (DOM access & mutable variables that do not trigger re-render)',
      'useMemo and useCallback (Performance optimization, compare to Flutter const constructors)',
      'Custom Hooks: Extracting reusable business logic (equivalent to Flutter mixins / service classes)',
    ],
    milestone: 'Create a fully functional Multi-step Dashboard with Custom Hooks.',
  },
  {
    phase: 'Phase 3: Routing, Styling & Forms (Days 31–45)',
    title: 'Modern Web UX & Navigation',
    focus: [
      'Client-side Routing: React Router v6 (createBrowserRouter, Outlet, useNavigate, useParams)',
      'Styling Architectures: Tailwind CSS, CSS Modules, or Styled Components',
      'Production Form Management: React Hook Form + Zod Schema Validation',
      'Web-specific gotchas: Browser history, Query params, Responsive CSS vs MediaQuery in Flutter',
    ],
    milestone: 'Build an E-commerce product catalog with search, filter, and detail pages.',
  },
  {
    phase: 'Phase 4: State Management at Scale (Days 46–60)',
    title: 'Context vs Zustand vs Redux Toolkit',
    focus: [
      'React Context API for lightweight global theme/auth (InheritedWidget equivalent)',
      'Zustand (Micro state manager, feels very intuitive like Flutter Riverpod / GetX)',
      'Redux Toolkit (RTK) (Predictable state container, exact conceptual counterpart to Flutter BLoC)',
      'State architecture: Server State vs Client State separation',
    ],
    milestone: 'Build a Kanban Task Board or Social Feed with complex global state & local persistence.',
  },
  {
    phase: 'Phase 5: Server State & API Integration (Days 61–75)',
    title: 'TanStack React Query & Real-Time Data',
    focus: [
      'TanStack React Query: Automatic caching, background refetching, retry logic, mutations',
      'Compare React Query to Flutter Dio + Repository pattern + StateNotifier',
      'Handling Auth: JWT Tokens, HTTP-only cookies, Axios/Fetch interceptors',
      'WebSockets / Server-Sent Events for real-time live data',
    ],
    milestone: 'Build a Real-time Analytics Dashboard with mock REST & WebSocket feeds.',
  },
  {
    phase: 'Phase 6: Full-Stack React with Next.js (Days 76–90)',
    title: 'Next.js App Router, SSR, and Production Deployment',
    focus: [
      'Next.js 15: Server Components (RSC) vs Client Components ("use client")',
      'Server-Side Rendering (SSR), Static Site Generation (SSG), Incremental Static Regeneration (ISR)',
      'API Route Handlers (Serverless functions) & Server Actions',
      'Web Core Vitals, SEO optimization, and Deployment to Vercel / Docker',
    ],
    milestone: 'Deploy a production-ready, SEO-optimized SaaS or Portfolio application to production.',
  },
];
