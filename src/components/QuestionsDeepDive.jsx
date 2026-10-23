/**
 * ============================================================================
 * FILE: src/components/QuestionsDeepDive.jsx
 * ============================================================================
 * TOPIC: Comprehensive React vs Flutter Architectural Deep-Dive Q&A
 * ============================================================================
 * 
 * Detailed questions and answers specifically tailored for engineers
 * with production Flutter knowledge transitioning to React.
 */

import { useState } from 'react';

const QUESTIONS_DATA = [
  {
    id: 'q1',
    category: 'State & Reactivity',
    question: 'Why does React require strict immutability (e.g. [...prev, item]) while Flutter allows mutating fields inside setState()?',
    flutterConcept: 'State<T>._list.add(item) inside setState()',
    reactConcept: 'setList(prev => [...prev, item]) (Reference Equality)',
    summary: 'React relies on shallow reference comparison (Object.is) to know whether to re-render. If you mutate the existing object or array in place, its memory reference remains identical, causing React to skip re-rendering entirely.',
    flutterComparison: `// In Flutter:
class _MyState extends State<MyWidget> {
  List<String> _items = ['A', 'B'];

  void _addItem() {
    setState(() {
      _items.add('C'); // ✅ Allowed! Mutation happens in-place,
                       // and setState() explicitly calls markNeedsBuild().
    });
  }
}`,
    reactComparison: `// In React:
function MyComponent() {
  const [items, setItems] = useState(['A', 'B']);

  const addItem = () => {
    // ❌ CRITICAL BUG:
    // items.push('C'); 
    // setItems(items); // React sees prevItems === nextItems (same memory address!) -> SKIPS RENDER

    // ✅ CORRECT: Create a brand new array with spread operator
    setItems(prev => [...prev, 'C']);
  };
}`,
    deepDive: `In Flutter, the framework marks the current Element as dirty via 'markNeedsBuild()' whenever you call 'setState()', regardless of whether the fields inside changed references. 
In React, the reconciliation engine compares the previous state snapshot with the next state snapshot using 'Object.is(prev, next)'. If the memory pointer has not changed, React assumes nothing has changed and bailouts of rendering the subtree. Always treat React state as read-only.`,
    gotcha: 'Pushing to an array (array.push) or modifying an object key (user.name = "John") will not trigger a re-render in React. Always use spread syntax: {...user, name: "John"}.'
  },
  {
    id: 'q2',
    category: 'Component Composition',
    question: 'Why did my nested elements not render inside a custom component? How does the "children" prop work?',
    flutterConcept: 'final Widget? child; or List<Widget> children;',
    reactConcept: 'function Header({ children }) { return <div>{children}</div>; }',
    summary: 'In React, whenever you nest tags between an opening and closing component tag (e.g. <Header><nav>...</nav></Header>), React passes them inside the "children" prop. If your component forgets to place {children} in its return statement, the nested content is ignored.',
    flutterComparison: `// In Flutter:
class CustomHeader extends StatelessWidget {
  final Widget? child; // Explicit slot
  const CustomHeader({super.key, this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      child: child, // If you omit 'child' here, nested widgets vanish!
    );
  }
}`,
    reactComparison: `// In React:
function Header({ children }) {
  // ⚠️ If you don't destructure or place {children}, nothing inside renders!
  return (
    <header className="header-bar">
      <h1>My App Header</h1>
      {/* Slot for nested children (like child: Widget in Flutter) */}
      <div className="header-slot">{children}</div>
    </header>
  );
}

// In Usage:
<Header>
  <nav>
    <ul>
      <li>Home</li>
      <li>Profile</li>
    </ul>
  </nav>
</Header>`,
    deepDive: `Also note common HTML/JSX typos: HTML has no tag called '<ui>'. Unordered lists are '<ul>' (Unordered List) and each item must be wrapped in '<li>' (List Item).
Furthermore, in JSX, use 'className' instead of 'class' (because 'class' is a reserved keyword in JavaScript), and 'htmlFor' instead of 'for'.`,
    gotcha: 'Never create an HTML tag called <ui>. The correct tags are <ul> for the list container and <li> for list items.'
  },
  {
    id: 'q3',
    category: 'Architecture',
    question: 'What is the Virtual DOM, and how does it map to Flutter\'s Three Trees (Widget, Element, RenderObject)?',
    flutterConcept: 'Widget Tree -> Element Tree -> RenderObject Tree',
    reactConcept: 'JSX (Blueprint) -> Fiber Node Tree (Instance) -> Real DOM (Renderer)',
    summary: 'Flutter and React use the exact same three-tier architecture to achieve high performance without destroying and recreating native UI nodes on every frame.',
    flutterComparison: `Flutter Three Trees Architecture:
1. Widget Tree: Lightweight, immutable declarative configurations (instantiated repeatedly on build).
2. Element Tree: Persistent structural nodes managing state, lifecycle, and component identity.
3. RenderObject Tree: Heavyweight objects responsible for layout, sizing (BoxConstraints), and painting on the canvas.`,
    reactComparison: `React Three Tiers Architecture:
1. JSX Elements: Lightweight plain JavaScript objects created when calling React.createElement() on render.
2. React Fiber Tree: Persistent linked-list nodes managing hooks, state, memoized props, and reconciliation.
3. Real HTML DOM: The actual browser DOM nodes (document.createElement) updated via diffing patches.`,
    deepDive: `When you call 'setState()' in Flutter, Flutter inspects the Widget tree against the existing Element tree. If 'Widget.canUpdate(oldWidget, newWidget)' is true (same runtimeType and Key), it reuses the Element and simply updates the RenderObject.
In React, when state changes, React builds a work-in-progress Fiber tree. The reconciliation algorithm checks if element.type and key match. If so, it reuses the Fiber node and issues a minimal DOM patch to the browser!`,
    gotcha: 'The Virtual DOM is not faster than direct DOM manipulation; it is fast enough while providing declarative superpowers and automatic diffing.'
  },
  {
    id: 'q4',
    category: 'JSX & Layout',
    question: 'Why does JSX require a single root element or Fragment (<>...</>) in component returns?',
    flutterConcept: 'Functions cannot return two widgets without Column or Row',
    reactConcept: 'React Fragments: <> <ChildA /> <ChildB /> </>',
    summary: 'JSX is syntactic sugar for JavaScript function calls (React.createElement). In JavaScript, a function cannot return two separate values without wrapping them in an array or object.',
    flutterComparison: `// In Flutter:
// A method cannot return two widgets:
// Widget build(context) => Text('A'), Text('B'); // ❌ Syntax error!
// You must wrap in a container:
Widget build(context) => Column(children: [Text('A'), Text('B')]);`,
    reactComparison: `// In React:
// ❌ FAILS:
// return ( <h1>Title</h1> <p>Text</p> );
// Because it compiles to:
// return React.createElement('h1') React.createElement('p'); // Invalid JS!

// ✅ CORRECT: Use React Fragment (does not create extra DOM elements)
return (
  <>
    <h1>Title</h1>
    <p>Text</p>
  </>
);`,
    deepDive: `React Fragments ('<>...</>' or '<React.Fragment key={id}>') let you group a list of children without adding extra nodes to the browser DOM. This keeps your HTML semantic and avoids breaking CSS Flexbox or Grid layouts with useless wrapper divs.`,
    gotcha: 'If you need to pass a "key" to a fragment in a loop, you must write out the full syntax: <React.Fragment key={item.id}>...</React.Fragment>.'
  },
  {
    id: 'q5',
    category: 'Lifecycle & Side Effects',
    question: 'What happens if you omit the dependency array in useEffect? How does it differ from [] and [val]?',
    flutterConcept: 'initState() vs didUpdateWidget() vs build() side-effects',
    reactConcept: 'useEffect(fn) vs useEffect(fn, []) vs useEffect(fn, [val])',
    summary: 'The dependency array controls WHEN the effect re-runs. Passing no array runs the effect after every single render. Passing [] runs it once on mount. Passing [val] runs it only when val changes.',
    flutterComparison: `Flutter Equivalents:
1. initState(): Runs once when state is inserted into tree.
2. didUpdateWidget(oldWidget): Runs when parent rebuilds and sends new properties.
3. dispose(): Runs when widget is permanently removed.
4. Danger in Flutter: Never make HTTP requests directly inside build()!`,
    reactComparison: `// Case 1: Empty dependency array (initState)
useEffect(() => {
  fetchInitialData(); // Runs ONCE on mount
}, []);

// Case 2: Dependencies provided (didUpdateWidget)
useEffect(() => {
  searchQuery(query); // Runs on mount AND whenever 'query' changes
}, [query]);

// Case 3: ⚠️ NO DEPENDENCY ARRAY (DANGER)
useEffect(() => {
  console.log('Runs on EVERY SINGLE render!');
  // If you call setState here -> INFINITE LOOP CRASH!
});`,
    deepDive: `The most common bug for beginners is calling a state updater function inside a 'useEffect' with no dependency array:
1. Component renders.
2. Effect fires and calls 'setState()'.
3. State changes -> Component re-renders.
4. Effect fires again -> calls 'setState()' -> Infinite loop and browser freezes!`,
    gotcha: 'Always specify dependencies in useEffect. If you want it to run once on mount (like initState), provide an empty array [].'
  },
  {
    id: 'q6',
    category: 'Lists & Performance',
    question: 'Why is using array index as key (key={index}) dangerous in React and Flutter dynamic lists?',
    flutterConcept: 'ReorderableListView without ValueKey(item.id)',
    reactConcept: 'key={item.id} vs key={index}',
    summary: 'Using index as key tells React that the item at position 0 is always the same component, even if you delete, insert, or reorder items. This leads to input state mismatches, incorrect animations, and corrupted form fields.',
    flutterComparison: `// In Flutter:
// If you create a list of stateful widgets without keys:
ListView(
  children: items.map((i) => StatefulTodoItem(title: i.title)).toList(),
  // If you delete index 0, the first Stateful widget stays mounted,
  // but receives item 1's title! Internal state like checkboxes will remain checked!
)`,
    reactComparison: `// In React:
// ❌ WRONG for dynamic/sortable lists:
{items.map((item, index) => (
  <TodoItem key={index} item={item} />
))}

// ✅ CORRECT: Use permanent business identifier
{items.map((item) => (
  <TodoItem key={item.id} item={item} />
))}`,
    deepDive: `React uses keys to correlate Virtual DOM nodes across renders. If you delete the item at index 0, the previous item at index 1 now has index 0. React believes the first item simply changed its props rather than being removed, keeping all uncontrolled DOM state (like input text or focus) on the wrong element!`,
    gotcha: 'Only use key={index} if the list is strictly static, will never be filtered, re-ordered, or deleted, and items have no state.'
  },
  {
    id: 'q7',
    category: 'Global State',
    question: 'Context API vs Zustand vs Redux Toolkit: Which should a Flutter engineer choose?',
    flutterConcept: 'InheritedWidget vs Riverpod vs BLoC',
    reactConcept: 'React Context vs Zustand vs Redux Toolkit (RTK)',
    summary: 'React Context is built-in (InheritedWidget). Zustand is modern, lightweight, and atomic (Riverpod). Redux Toolkit is strictly event-driven with actions and reducers (BLoC).',
    flutterComparison: `Flutter State Landscape:
- InheritedWidget / Provider: Great for themes, localized scopes, auth tokens.
- Riverpod: Clean, decoupled, reactive, minimal boilerplate.
- BLoC (Business Logic Component): Events -> BLoC -> States. Strict, predictable for enterprise.`,
    reactComparison: `React State Landscape:
- React Context: Built-in. Great for low-frequency updates (theme, auth user).
- Zustand: Tiny, hook-based, no boilerplate. The most popular modern choice (feels identical to Riverpod!).
- Redux Toolkit (RTK): The BLoC of React. Uses actions, reducers, and predictable state snapshots. Ideal for massive enterprise apps.`,
    deepDive: `The main drawback of React Context: It lacks selector optimizations out of the box. When any property in a Context value changes, EVERY component calling 'useContext' for that provider re-renders, even if it only cared about a property that didn't change! Zustand and Redux solve this by allowing selector subscriptions: 'useStore(state => state.onlyThisField)'.`,
    gotcha: 'Do not use React Context for rapidly changing state (like keystrokes or timer ticks). Use Zustand or component-local state.'
  },
  {
    id: 'q8',
    category: 'Forms & Inputs',
    question: 'How do form validation and state capture work in React without GlobalKey<FormState>()?',
    flutterConcept: 'final _formKey = GlobalKey<FormState>(); _formKey.currentState!.validate();',
    reactConcept: 'Controlled Components with state or React Hook Form with Zod schema',
    summary: 'In React, forms are either Controlled (inputs mirror state directly via value and onChange) or managed through libraries like React Hook Form that validate schemas without re-rendering the whole form.',
    flutterComparison: `// In Flutter:
final _formKey = GlobalKey<FormState>();

Form(
  key: _formKey,
  child: TextFormField(
    validator: (val) => val!.isEmpty ? 'Required' : null,
  ),
);

void _submit() {
  if (_formKey.currentState!.validate()) { ... }
}`,
    reactComparison: `// In React (Native Controlled pattern):
const [formData, setFormData] = useState({ email: '' });
const [errors, setErrors] = useState({});

const handleSubmit = (e) => {
  e.preventDefault(); // Stop page reload!
  const newErrors = {};
  if (!formData.email) newErrors.email = 'Required';
  if (Object.keys(newErrors).length > 0) return setErrors(newErrors);
  // Proceed with valid submission
};`,
    deepDive: `In Flutter, 'FormState' is kept in an Element referenced via 'GlobalKey'.
In React, for production apps, the industry standard is 'React Hook Form' paired with 'Zod'. Zod lets you declare your validation schema declaratively (like a Dart class with validation rules), and React Hook Form validates without triggering re-renders on every keystroke.`,
    gotcha: 'Always call e.preventDefault() in your form submit handler, or the browser will make a GET request and reload your whole Single Page App!'
  },
  {
    id: 'q9',
    category: 'Routing & Navigation',
    question: 'How does client-side routing in React compare to Flutter\'s Navigator 2.0 / GoRouter?',
    flutterConcept: 'Navigator.pushNamed(), GoRouter, RouteInformationParser',
    reactConcept: 'React Router v6: <BrowserRouter>, <Routes>, <Route>, useNavigate()',
    summary: 'React uses client-side routing where URL changes update component state without fetching a new HTML page from the server. Navigating with <a href="..."> causes a full page reload; always use <Link to="..."> or useNavigate().',
    flutterComparison: `// In Flutter (GoRouter):
final router = GoRouter(
  routes: [
    GoRoute(path: '/', builder: (_, __) => HomeScreen()),
    GoRoute(path: '/details/:id', builder: (ctx, state) => DetailsScreen(id: state.params['id']!)),
  ],
);

// Navigation:
context.go('/details/42');`,
    reactComparison: `// In React (React Router v6):
const router = createBrowserRouter([
  { path: '/', element: <HomeScreen /> },
  { path: '/details/:id', element: <DetailsScreen /> },
]);

// Navigation inside component:
const navigate = useNavigate();
navigate('/details/42');

// In JSX:
<Link to="/details/42">Go to Details</Link>`,
    deepDive: `In Flutter Web, GoRouter parses browser address bar changes via 'RouteInformationParser'. In React, the browser's HTML5 History API ('window.history.pushState') is used behind the scenes by React Router. This keeps your single-page application loaded in memory while updating the browser address bar and history stack seamlessly.`,
    gotcha: 'Never use plain <a href="/path"> tags in a React SPA unless navigating to an external website. It will trigger a complete page refresh and wipe in-memory state.'
  },
  {
    id: 'q10',
    category: 'Layout & Box Model',
    question: 'How does CSS Box Model differ from Flutter\'s "Constraints go down, sizes go up, parent sets position"?',
    flutterConcept: 'BoxConstraints (minWidth, maxWidth, minHeight, maxHeight)',
    reactConcept: 'CSS Box Model: Content -> Padding -> Border -> Margin',
    summary: 'Flutter uses a strict 2-pass constraint system where parents enforce constraints on children. Web layout uses CSS where elements calculate their own dimensions based on display mode (block, inline, flex), box-sizing, and content.',
    flutterComparison: `Flutter Layout Mantra:
1. Constraints go down (Parent passes min/max constraints).
2. Sizes go up (Child decides its size within those constraints).
3. Parent sets position (Parent places child on the coordinate plane).`,
    reactComparison: `CSS Box Model:
- Content box: The width/height of the text or elements.
- Padding: Space between content and border (inside the box).
- Border: Outline of the element.
- Margin: Outer spacing separating this element from siblings.
- Box Sizing: Always use 'box-sizing: border-box;' so padding doesn't expand total width!`,
    deepDive: `In Flutter, a child cannot simply say 'I want to be 500px wide' if the parent only provides a maxWidth of 300px.
On the web, if an element has a fixed width of 500px inside a 300px container, it will cause an overflow by default unless configured with 'overflow: hidden' or flexbox shrinking! CSS Flexbox ('display: flex') is the closest mental match to Flutter's Column and Row.`,
    gotcha: 'Always ensure "box-sizing: border-box;" is set in your CSS. Otherwise, adding 20px padding to a 100px width element turns its total width into 140px!'
  }
];

export default function QuestionsDeepDive() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState('q1');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Quiz State
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const categories = ['All', 'State & Reactivity', 'Component Composition', 'Architecture', 'JSX & Layout', 'Lifecycle & Side Effects', 'Lists & Performance', 'Global State', 'Forms & Inputs', 'Routing & Navigation', 'Layout & Box Model'];

  const filteredQuestions = QUESTIONS_DATA.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.flutterConcept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reactConcept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Quiz questions dataset
  const QUIZ_DATA = [
    {
      q: 'In React, why will `items.push("New Item"); setItems(items);` NOT cause a component to re-render?',
      options: [
        'Because React does not support array state.',
        'Because Object.is sees the same memory reference and skips rendering.',
        'Because setItems can only be called from useEffect.',
        'Because push is a Dart method, not JavaScript.',
      ],
      correct: 1,
      explanation: 'React compares previous and next state references using Object.is. Mutating the array in place does not change its memory address, so React considers state unchanged.'
    },
    {
      q: 'What is the correct way to pass nested widgets/JSX inside a parent component in React?',
      options: [
        'Pass them into the child prop explicitly.',
        'Destructure and place the built-in `children` prop inside the component JSX.',
        'Call renderChildren() inside build().',
        'Wrap them in a GlobalKey.',
      ],
      correct: 1,
      explanation: 'In React, elements nested between opening and closing tags are automatically passed inside the `children` prop, matching Flutter\'s `Widget? child` or `List<Widget> children`.'
    },
    {
      q: 'What is the React equivalent of cancelling a Dio CancelToken when a Flutter widget is disposed?',
      options: [
        'Calling cancel() inside initState.',
        'Using an AbortController and calling controller.abort() in useEffect\'s cleanup return function.',
        'Setting the state to null.',
        'Calling navigator.pop().',
      ],
      correct: 1,
      explanation: 'Returning a cleanup function from useEffect runs when the component unmounts (like dispose in Flutter). Calling abort() on an AbortController stops active fetch requests.'
    },
    {
      q: 'Which hook should you use for mutable values (like FocusNode or timer counters) that should NOT trigger a re-render when changed?',
      options: [
        'useState()',
        'useMemo()',
        'useRef()',
        'useContext()',
      ],
      correct: 2,
      explanation: 'useRef() returns a persistent object { current: value } whose mutation never triggers reconciliation, identical to private instance variables in Flutter State classes.'
    }
  ];

  const handleQuizAnswer = (idx) => {
    setSelectedAnswer(idx);
    if (idx === QUIZ_DATA[currentQuizIdx].correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIdx + 1 < QUIZ_DATA.length) {
      setCurrentQuizIdx((i) => i + 1);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="demo-card" id="questions-deepdive-section">
      <div className="demo-header">
        <span className="badge badge-indigo">Architectural FAQ & Mastery</span>
        <h3>13. Deep-Dive Questions & Answers: React for Flutter Engineers</h3>
      </div>

      <p className="demo-explanation">
        Comprehensive answers to the most critical conceptual questions, common pitfalls, and architectural decisions you will encounter when transitioning from Flutter to React.
      </p>

      {/* Mode Switcher */}
      <div className="interactive-box">
        <div className="controls-row">
          <div className="button-group-clean">
            <button
              className={`pill-btn ${!quizMode ? 'pill-active' : ''}`}
              onClick={() => setQuizMode(false)}
            >
              📖 Question & Answer Encyclopedia ({QUESTIONS_DATA.length} Questions)
            </button>
            <button
              className={`pill-btn ${quizMode ? 'pill-active' : ''}`}
              onClick={() => setQuizMode(true)}
            >
              🎯 Interactive Knowledge Check (Self-Test Quiz)
            </button>
          </div>
        </div>

        {/* MODE A: ENCYCLOPEDIA */}
        {!quizMode && (
          <div>
            {/* Search and Filters */}
            <div className="dict-header-row mt-2">
              <input
                type="text"
                className="text-input"
                placeholder="Search questions (e.g. immutability, children, Virtual DOM, keys, routing)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div className="category-chips-row">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`pill-btn ${selectedCategory === cat ? 'pill-active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions Accordion List */}
            <div className="questions-accordion-list mt-3">
              {filteredQuestions.length === 0 ? (
                <div className="p-4 text-center text-muted">No questions matched your query.</div>
              ) : (
                filteredQuestions.map((q) => {
                  const isExpanded = expandedId === q.id;
                  return (
                    <div key={q.id} className={`qa-card ${isExpanded ? 'qa-card-expanded' : ''}`}>
                      <div
                        className="qa-question-header"
                        onClick={() => setExpandedId(isExpanded ? null : q.id)}
                      >
                        <div className="qa-title-left">
                          <span className="badge badge-state">{q.category}</span>
                          <h4 className="qa-question-text">{q.question}</h4>
                        </div>
                        <span className="qa-chevron">{isExpanded ? '▲' : '▼'}</span>
                      </div>

                      {isExpanded && (
                        <div className="qa-content-body">
                          {/* Conceptual Bridge Strip */}
                          <div className="bridge-comparison-strip">
                            <div className="bridge-item flutter-bridge">
                              <span className="tag-label">Flutter Equivalent:</span>
                              <code>{q.flutterConcept}</code>
                            </div>
                            <div className="bridge-item react-bridge">
                              <span className="tag-label">React Concept:</span>
                              <code>{q.reactConcept}</code>
                            </div>
                          </div>

                          {/* Quick Summary */}
                          <div className="qa-summary-box">
                            <strong>⚡ Core Answer:</strong> {q.summary}
                          </div>

                          {/* Side-by-Side Code Comparison */}
                          <div className="comparison-grid mt-2">
                            <div className="code-column">
                              <div className="code-header flutter-header">Flutter Paradigm</div>
                              <pre className="code-content">{q.flutterComparison}</pre>
                            </div>
                            <div className="code-column">
                              <div className="code-header react-header">React Paradigm</div>
                              <pre className="code-content">{q.reactComparison}</pre>
                            </div>
                          </div>

                          {/* Deep-Dive Explanation */}
                          <div className="qa-deep-dive-text mt-2">
                            <h5>💡 Architectural Insight:</h5>
                            <p>{q.deepDive}</p>
                          </div>

                          {/* Gotcha Alert */}
                          <div className="qa-gotcha-box mt-2">
                            <strong>⚠️ Senior Gotcha / Common Bug:</strong> {q.gotcha}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* MODE B: INTERACTIVE QUIZ */}
        {quizMode && (
          <div className="quiz-container">
            {!quizFinished ? (
              <div className="quiz-card">
                <div className="quiz-progress-bar">
                  <span>Question {currentQuizIdx + 1} of {QUIZ_DATA.length}</span>
                  <span>Score: {score}</span>
                </div>

                <h4 className="quiz-question-title mt-2">
                  {QUIZ_DATA[currentQuizIdx].q}
                </h4>

                <div className="quiz-options-list mt-3">
                  {QUIZ_DATA[currentQuizIdx].options.map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === QUIZ_DATA[currentQuizIdx].correct;
                    let btnClass = 'quiz-opt-btn';

                    if (selectedAnswer !== null) {
                      if (isCorrect) btnClass += ' opt-correct';
                      else if (isSelected) btnClass += ' opt-wrong';
                    }

                    return (
                      <button
                        key={idx}
                        className={btnClass}
                        onClick={() => selectedAnswer === null && handleQuizAnswer(idx)}
                        disabled={selectedAnswer !== null}
                      >
                        <span className="opt-letter">{String.fromCharCode(65 + idx)}.</span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedAnswer !== null && (
                  <div className="quiz-explanation-box mt-3">
                    <strong>
                      {selectedAnswer === QUIZ_DATA[currentQuizIdx].correct ? '🎉 Correct!' : '❌ Not quite!'}
                    </strong>
                    <p className="text-secondary text-sm mt-1">
                      {QUIZ_DATA[currentQuizIdx].explanation}
                    </p>
                    <button className="action-btn btn-primary mt-2" onClick={handleNextQuiz}>
                      {currentQuizIdx + 1 < QUIZ_DATA.length ? 'Next Question &rarr;' : 'Finish Quiz & View Results'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="quiz-results-card text-center">
                <h3>🏆 Knowledge Check Completed!</h3>
                <p className="mt-1 text-secondary">
                  You scored <strong>{score} out of {QUIZ_DATA.length}</strong> ({Math.round((score / QUIZ_DATA.length) * 100)}%)!
                </p>
                <div className="button-row mt-3">
                  <button className="action-btn btn-primary" onClick={resetQuiz}>
                    ↺ Retake Quiz
                  </button>
                  <button className="action-btn btn-secondary" onClick={() => setQuizMode(false)}>
                    Browse Q&A Encyclopedia
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
