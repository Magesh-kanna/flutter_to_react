/**
 * ============================================================================
 * FILE: src/components/AsyncDataDemo.jsx
 * ============================================================================
 * TOPIC: Async Data Fetching & Network vs Flutter FutureBuilder & Dio CancelToken
 * ============================================================================
 * 
 * FLUTTER EQUIVALENT:
 * ```dart
 * FutureBuilder<User>(
 *   future: _userFuture,
 *   builder: (context, snapshot) {
 *     if (snapshot.connectionState == ConnectionState.waiting) {
 *       return const CircularProgressIndicator();
 *     } else if (snapshot.hasError) {
 *       return Text('Error: \${snapshot.error}');
 *     } else if (snapshot.hasData) {
 *       return Text('User: \${snapshot.data!.name}');
 *     }
 *     return const SizedBox.shrink();
 *   },
 * )
 * ```
 */

import { useState, useEffect } from 'react';

export default function AsyncDataDemo() {
  /**
   * 1. ASYNC STATE MACHINE:
   * In Flutter's `AsyncSnapshot`:
   *   - snapshot.connectionState == ConnectionState.waiting
   *   - snapshot.hasError
   *   - snapshot.data
   * 
   * In React:
   *   We represent these as state variables:
   */
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [simulateError, setSimulateError] = useState(false);
  const [requestId, setRequestId] = useState(1);

  useEffect(() => {
    /**
     * 2. ABORT CONTROLLER (Flutter Dio CancelToken equivalent):
     * 
     * In Flutter:
     *   If a user navigates away while a Dio GET request is pending, you call:
     *   `cancelToken.cancel('Widget disposed');`
     * 
     * In React:
     *   `const controller = new AbortController();`
     *   Pass `{ signal: controller.signal }` to fetch().
     *   In the useEffect cleanup function, call `controller.abort()`.
     *   This stops the browser network request if the component unmounts!
     */
    const controller = new AbortController();

    async function fetchUserData() {
      setLoading(true);
      setError(null);

      try {
        // Simulate real network delay (800ms)
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (controller.signal.aborted) return;

        if (simulateError) {
          throw new Error('500 Internal Server Error (Simulated API failure)');
        }

        // Mock data payload
        const result = {
          id: `USR-${requestId}`,
          name: requestId % 2 === 1 ? 'Ada Lovelace' : 'Alan Turing',
          role: 'Foundational Computer Scientist',
          timestamp: new Date().toLocaleTimeString(),
        };

        setData(result);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchUserData();

    // Cleanup: cancel request on unmount or re-fetch
    return () => {
      controller.abort();
    };
  }, [requestId, simulateError]);

  return (
    <div className="demo-card" id="async-data-section">
      <div className="demo-header">
        <span className="badge badge-amber">Async Network Concept</span>
        <h3>10. Async Fetching vs Flutter FutureBuilder & Dio CancelToken</h3>
      </div>

      <p className="demo-explanation">
        In Flutter, async UI is typically constructed using <code>FutureBuilder&lt;T&gt;</code> and <code>AsyncSnapshot</code>.
        In React, we manage <code>loading</code>, <code>data</code>, and <code>error</code> states inside <code>useEffect</code> using standard async/await.
      </p>

      {/* Interactive Box */}
      <div className="interactive-box">
        <div className="controls-row">
          <div className="button-group-clean">
            <button
              id="refetch-api-btn"
              className="action-btn btn-primary"
              onClick={() => setRequestId((id) => id + 1)}
              disabled={loading}
            >
              {loading ? '⏳ Fetching Data...' : '🔄 Refetch API (Trigger Future)'}
            </button>

            <button
              id="toggle-sim-error-btn"
              className={`action-btn ${simulateError ? 'btn-danger' : 'btn-secondary'}`}
              onClick={() => setSimulateError((s) => !s)}
            >
              {simulateError ? '⚠️ Error Simulation: ON' : '✓ Error Simulation: OFF'}
            </button>
          </div>

          <span className="text-muted text-sm">Request #{requestId}</span>
        </div>

        {/* 
          FLUTTER EQUIVALENT:
          switch (snapshot.connectionState) {
            case ConnectionState.waiting: return CircularProgressIndicator();
            ...
          }
        */}
        <div className="async-status-container mt-3">
          {loading && (
            <div className="loading-state-card">
              <span className="spinner-clean"></span>
              <span>Loading from network (ConnectionState.waiting)...</span>
            </div>
          )}

          {!loading && error && (
            <div className="error-state-card">
              <strong>❌ Network Error (snapshot.hasError):</strong>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && data && (
            <div className="success-state-card">
              <div className="success-header">
                <span className="badge badge-emerald">200 OK (snapshot.hasData)</span>
                <span className="text-muted text-xs">Fetched at {data.timestamp}</span>
              </div>
              <h4 className="mt-1">{data.name}</h4>
              <p className="text-secondary text-sm">ID: <code>{data.id}</code> &bull; Role: {data.role}</p>
            </div>
          )}
        </div>
      </div>

      {/* Code Comparison */}
      <div className="comparison-grid">
        <div className="code-column">
          <div className="code-header flutter-header">Flutter (FutureBuilder)</div>
          <pre className="code-content">
{`FutureBuilder<User>(
  future: fetchUser(),
  builder: (context, snapshot) {
    if (snapshot.connectionState 
        == ConnectionState.waiting) {
      return CircularProgressIndicator();
    }
    if (snapshot.hasError) {
      return Text('Error: \${snapshot.error}');
    }
    final user = snapshot.data!;
    return Text(user.name);
  },
)`}
          </pre>
        </div>

        <div className="code-column">
          <div className="code-header react-header">React (useEffect & State)</div>
          <pre className="code-content">
{`const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const ctrl = new AbortController();
  fetch(url, { signal: ctrl.signal })
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => setError(err))
    .finally(() => setLoading(false));

  return () => ctrl.abort(); // CancelToken!
}, []);`}
          </pre>
        </div>
      </div>
    </div>
  );
}
