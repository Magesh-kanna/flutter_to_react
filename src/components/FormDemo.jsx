/**
 * ============================================================================
 * FILE: src/components/FormDemo.jsx
 * ============================================================================
 * TOPIC: Controlled Forms & Inputs vs Flutter TextEditingController
 * ============================================================================
 * 
 * FLUTTER EQUIVALENT:
 * ```dart
 * class MyFormWidget extends StatefulWidget {
 *   const MyFormWidget({super.key});
 *   @override
 *   State<MyFormWidget> createState() => _MyFormWidgetState();
 * }
 * 
 * class _MyFormWidgetState extends State<MyFormWidget> {
 *   final _formKey = GlobalKey<FormState>();
 *   final _nameController = TextEditingController();
 *   final _emailController = TextEditingController();
 *   String _level = 'Senior';
 * 
 *   @override
 *   void dispose() {
 *     _nameController.dispose();
 *     _emailController.dispose();
 *     super.dispose();
 *   }
 * 
 *   void _submit() {
 *     if (_formKey.currentState!.validate()) {
 *       print('Name: \${_nameController.text}');
 *     }
 *   }
 * }
 * ```
 */

import { useState } from 'react';

export default function FormDemo() {
  /**
   * 1. CONTROLLED FORM STATE:
   * 
   * In Flutter:
   *   You create multiple controllers:
   *   `final nameCtrl = TextEditingController();`
   *   `final emailCtrl = TextEditingController();`
   *   and MUST remember to `dispose()` them in `dispose()`.
   * 
   * In React:
   *   The standard approach is a "Controlled Component":
   *   Form state lives in React state, and the input's displayed value
   *   is locked to that state via `value={formData.name}` and updated on `onChange`.
   *   Zero memory leaks, no manual controllers to dispose!
   */
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    flutterExperience: '2-4 years',
    goal: 'Build Full-stack React apps in 90 days',
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [errors, setErrors] = useState({});

  // Single generic change handler for multiple inputs!
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Immutably copy previous state and update the targeted key
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error on type
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * 2. FORM SUBMISSION & e.preventDefault():
   * 
   * CRITICAL WEB GOTCHA FOR FLUTTER DEVELOPERS:
   * In HTML, clicking a submit button automatically triggers a browser HTTP request
   * and REFRESHES the entire webpage!
   * Calling `e.preventDefault()` halts this default browser behavior so your
   * React SPA handles the submission in-memory.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Equivalent to preventing full application restart

    // Validation (like Flutter's `validator: (val) => ...`)
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmittedData({ ...formData, timestamp: new Date().toLocaleTimeString() });
  };

  return (
    <div className="demo-card" id="form-demo-section">
      <div className="demo-header">
        <span className="badge badge-forms">Inputs & Forms Concept</span>
        <h3>5. Controlled Components vs TextEditingController & Form</h3>
      </div>

      <p className="demo-explanation">
        In Flutter, text inputs are managed by instantiating and disposing <code>TextEditingController</code> instances.
        In React, inputs are <strong>Controlled Components</strong> where the UI reflects state directly and updates via <code>onChange</code>.
      </p>

      {/* Interactive Form */}
      <div className="interactive-box">
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label htmlFor="input-fullName">Developer Name:</label>
            <input
              id="input-fullName"
              name="fullName"
              type="text"
              className={`text-input ${errors.fullName ? 'input-error' : ''}`}
              placeholder="e.g. Alex Rivera"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="input-email">Email Address:</label>
            <input
              id="input-email"
              name="email"
              type="email"
              className={`text-input ${errors.email ? 'input-error' : ''}`}
              placeholder="developer@flutter.dev"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="input-flutterExp">Flutter Experience:</label>
            <select
              id="input-flutterExp"
              name="flutterExperience"
              className="text-input"
              value={formData.flutterExperience}
              onChange={handleChange}
            >
              <option value="1-2 years">1-2 years (Junior / Mid)</option>
              <option value="2-4 years">2-4 years (Mid-level)</option>
              <option value="5+ years">5+ years (Senior / Lead Production)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="input-goal">90-Day Learning Goal:</label>
            <input
              id="input-goal"
              name="goal"
              type="text"
              className="text-input"
              value={formData.goal}
              onChange={handleChange}
            />
          </div>

          <button id="submit-form-btn" type="submit" className="action-btn btn-primary full-width">
            Submit Form (Dispatch Action)
          </button>
        </form>

        {/* Display Live Controlled State */}
        <div className="live-preview-box">
          <div className="preview-header">
            <span>● Live State Mirror (No TextEditingController needed!)</span>
          </div>
          <pre className="state-json-view">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>

        {submittedData && (
          <div className="submission-success">
            <h4>✅ Form Submitted Successfully at {submittedData.timestamp}</h4>
            <p>Welcome aboard, <strong>{submittedData.fullName}</strong> ({submittedData.flutterExperience} Flutter background)!</p>
          </div>
        )}
      </div>

      {/* Code Comparison */}
      <div className="comparison-grid">
        <div className="code-column">
          <div className="code-header flutter-header">Flutter (TextEditingController)</div>
          <pre className="code-content">
{`// 1. Controller instantiated
final _nameCtrl = TextEditingController();

// 2. Bound to widget
TextField(
  controller: _nameCtrl,
  onChanged: (val) => setState(() {}),
)

// 3. MUST manually dispose!
@override
void dispose() {
  _nameCtrl.dispose();
  super.dispose();
}`}
          </pre>
        </div>

        <div className="code-column">
          <div className="code-header react-header">React (Controlled Input)</div>
          <pre className="code-content">
{`// 1. Pure state in component
const [name, setName] = useState('');

// 2. Bound directly via value & onChange
<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

// 3. No controllers to dispose!
// Automatically garbage collected 
// when component unmounts.`}
          </pre>
        </div>
      </div>
    </div>
  );
}
