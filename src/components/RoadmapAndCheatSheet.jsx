/**
 * ============================================================================
 * FILE: src/components/RoadmapAndCheatSheet.jsx
 * ============================================================================
 * TOPIC: Flutter Developer's 90-Day Transition Roadmap & Terminology Dictionary
 * ============================================================================
 */

import { useState } from 'react';
import { FLUTTER_REACT_DICTIONARY, NINETY_DAY_ROADMAP } from '../data/flutterReactMapping';

export default function RoadmapAndCheatSheet() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('all');

  const filteredDict = FLUTTER_REACT_DICTIONARY.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.flutter.toLowerCase().includes(q) ||
      item.react.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.detail.toLowerCase().includes(q)
    );
  });

  return (
    <div className="demo-card" id="roadmap-section">
      <div className="demo-header">
        <span className="badge badge-roadmap">90-Day Mastery Plan</span>
        <h3>7. Flutter-to-React Architecture Dictionary & 90-Day Roadmap</h3>
      </div>

      <p className="demo-explanation">
        You already know state machines, reconciliation, widget trees, and reactive programming from Flutter.
        Use this interactive dictionary and curated 90-day trajectory to map your existing expertise into the React & Next.js ecosystem.
      </p>

      {/* SECTION A: CLI COMMAND COMPARISON */}
      <div className="interactive-box cli-comparison-box">
        <h4 className="section-subtitle">⚡ Everyday CLI Commands: Flutter vs React (Vite)</h4>
        <div className="cli-table-wrapper">
          <table className="cli-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Flutter CLI Command</th>
                <th>React (Vite / npm) Command</th>
                <th>What it Does</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Create Project</strong></td>
                <td><code>flutter create my_app</code></td>
                <td><code>npm create vite@latest my_app -- --template react</code></td>
                <td>Scaffolds template project structure</td>
              </tr>
              <tr>
                <td><strong>Install Packages</strong></td>
                <td><code>flutter pub get</code></td>
                <td><code>npm install</code></td>
                <td>Downloads dependencies to node_modules</td>
              </tr>
              <tr>
                <td><strong>Add a Package</strong></td>
                <td><code>flutter pub add dio</code></td>
                <td><code>npm install axios</code></td>
                <td>Adds dependency to package.json & installs it</td>
              </tr>
              <tr>
                <td><strong>Start Dev Server</strong></td>
                <td><code>flutter run -d chrome</code></td>
                <td><code>npm run dev</code></td>
                <td>Spins up Vite dev server with instant Hot Module Replacement (HMR)</td>
              </tr>
              <tr>
                <td><strong>Stop Server</strong></td>
                <td><code>q</code> or <code>Ctrl + C</code></td>
                <td><code>Ctrl + C</code></td>
                <td>Kills the development Node process</td>
              </tr>
              <tr>
                <td><strong>Hot Reload</strong></td>
                <td>Press <code>r</code> in terminal</td>
                <td>Automatic on file save (<code>Cmd+S</code> / <code>Ctrl+S</code>)</td>
                <td>Vite Fast Refresh swaps the component in &lt;50ms</td>
              </tr>
              <tr>
                <td><strong>Production Build</strong></td>
                <td><code>flutter build web --release</code></td>
                <td><code>npm run build</code></td>
                <td>Compiles minified static bundle to <code>dist/</code></td>
              </tr>
              <tr>
                <td><strong>Preview Build</strong></td>
                <td>Local web server on <code>build/web</code></td>
                <td><code>npm run preview</code></td>
                <td>Locally serves production <code>dist/</code> folder</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION B: SEARCHABLE FLUTTER TO REACT DICTIONARY */}
      <div className="interactive-box">
        <div className="dict-header-row">
          <h4 className="section-subtitle">📖 Side-by-Side Terminology Dictionary</h4>
          <input
            id="dict-search-input"
            type="text"
            className="text-input dict-search"
            placeholder="Search concept (e.g. setState, StatelessWidget, Column, FutureBuilder)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="dict-grid">
          {filteredDict.map((entry, idx) => (
            <div key={idx} className="dict-card">
              <span className="dict-category">{entry.category}</span>
              <div className="dict-term-row">
                <div className="term-box flutter-box">
                  <span className="tech-tag flutter-tag">Flutter</span>
                  <div className="term-code">{entry.flutter}</div>
                </div>
                <div className="term-arrow">&harr;</div>
                <div className="term-box react-box">
                  <span className="tech-tag react-tag">React</span>
                  <div className="term-code">{entry.react}</div>
                </div>
              </div>
              <p className="dict-detail">{entry.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION C: 90-DAY STEP-BY-STEP CURRICULUM */}
      <div className="interactive-box">
        <h4 className="section-subtitle">🎯 Your Tailored 90-Day Transition Roadmap</h4>
        <div className="roadmap-timeline">
          {NINETY_DAY_ROADMAP.map((item, index) => (
            <div key={index} className="roadmap-phase-card">
              <div className="phase-marker">
                <span className="phase-number">{index + 1}</span>
              </div>
              <div className="phase-content">
                <div className="phase-header">
                  <span className="phase-tag">{item.phase}</span>
                  <h4 className="phase-title">{item.title}</h4>
                </div>

                <ul className="phase-focus-list">
                  {item.focus.map((f, fIdx) => (
                    <li key={fIdx}>{f}</li>
                  ))}
                </ul>

                <div className="phase-milestone">
                  <strong>🏆 Phase Milestone:</strong> {item.milestone}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
