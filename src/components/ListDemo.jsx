/**
 * ============================================================================
 * FILE: src/components/ListDemo.jsx
 * ============================================================================
 * TOPIC: Lists, Rendering Collections & Keys vs Flutter ListView.builder
 * ============================================================================
 * 
 * FLUTTER EQUIVALENT:
 * ```dart
 * ListView.builder(
 *   itemCount: items.length,
 *   itemBuilder: (context, index) {
 *     final item = items[index];
 *     return ListTile(
 *       key: ValueKey(item.id), // Flutter Key for Element identity!
 *       title: Text(item.title),
 *       trailing: IconButton(
 *         icon: const Icon(Icons.delete),
 *         onPressed: () => _removeItem(item.id),
 *       ),
 *     );
 *   },
 * )
 * ```
 */

import { useState } from 'react';

export default function ListDemo() {
  /**
   * FLUTTER EQUIVALENT:
   * List<TodoItem> _items = [...];
   */
  const [items, setItems] = useState([
    { id: 'item-1', title: 'Understand JSX syntax', done: true, flutterTerm: 'Widget tree composition' },
    { id: 'item-2', title: 'Master useState hook', done: true, flutterTerm: 'StatefulWidget & setState' },
    { id: 'item-3', title: 'Learn useEffect lifecycle', done: false, flutterTerm: 'initState + dispose' },
    { id: 'item-4', title: 'Explore React Context', done: false, flutterTerm: 'InheritedWidget / Provider' },
  ]);

  const [newTitle, setNewTitle] = useState('');

  // 1. ADD ITEM
  // Flutter: `setState(() { _items.add(newItem); });` (Mutation)
  // React: Create brand new array with spread operator `[...prev, newItem]` (Immutability!)
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem = {
      id: `item-${Date.now()}`,
      title: newTitle.trim(),
      done: false,
      flutterTerm: 'Custom User Widget',
    };

    setItems((prev) => [...prev, newItem]);
    setNewTitle('');
  };

  // 2. TOGGLE ITEM
  // Flutter: `setState(() { item.done = !item.done; });`
  // React: Array.map returning new objects for immutability
  const handleToggle = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  // 3. REMOVE ITEM
  // Flutter: `setState(() { _items.removeWhere((i) => i.id == id); });`
  // React: Array.filter returning a filtered copy
  const handleRemove = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="demo-card" id="list-demo-section">
      <div className="demo-header">
        <span className="badge badge-lists">Collections Concept</span>
        <h3>4. Array.map() & `key` vs Flutter's ListView.builder & Key</h3>
      </div>

      <p className="demo-explanation">
        In Flutter, dynamic lists are rendered with <code>ListView.builder()</code> using <code>itemBuilder</code> and <code>ValueKey()</code>.
        In React, you transform arrays using JavaScript's native <code>.map()</code> and provide a unique <code>key</code> attribute to each item.
      </p>

      {/* Interactive Item Creator */}
      <div className="interactive-box">
        <form onSubmit={handleAddItem} className="input-group-row">
          <input
            id="new-list-item-input"
            type="text"
            className="text-input"
            placeholder="Add new learning objective..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button id="add-list-item-btn" type="submit" className="action-btn btn-primary">
            + Add Item
          </button>
        </form>

        {/* 
          FLUTTER EQUIVALENT:
          In Flutter:
          Column(
            children: items.map((item) => ListTile(key: ValueKey(item.id), ...)).toList(),
          )
          Or ListView.builder(...)
        */}
        <div className="list-container">
          {items.length === 0 ? (
            <p className="text-muted text-center py-4">No items remaining. Add one above!</p>
          ) : (
            items.map((item) => {
              /**
               * ============================================================
               * CRITICAL CONCEPT: THE `key` ATTRIBUTE
               * ============================================================
               * In Flutter:
               *   `ValueKey(item.id)` tells the Element Tree which Widget
               *   matches which RenderObject during reconciliation.
               * 
               * In React:
               *   `key={item.id}` tells the Virtual DOM reconciliation algorithm
               *   how to identify this specific DOM node across re-renders.
               * 
               * ⚠️ NEVER use array index `key={index}` for dynamic lists where
               * items can be added, deleted, or reordered! It will cause state
               * mismatches just like missing ValueKeys in Flutter.
               * ============================================================
               */
              return (
                <div
                  key={item.id}
                  className={`list-item-card ${item.done ? 'item-completed' : ''}`}
                >
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => handleToggle(item.id)}
                    />
                    <span className="checkmark"></span>
                  </label>

                  <div className="item-text-group">
                    <span className="item-title">{item.title}</span>
                    <span className="item-meta">
                      Flutter equivalent concept: <code>{item.flutterTerm}</code>
                    </span>
                  </div>

                  <span className="key-badge">key: {item.id}</span>

                  <button
                    className="delete-icon-btn"
                    onClick={() => handleRemove(item.id)}
                    title="Delete item"
                  >
                    ✕
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Code Comparison */}
      <div className="comparison-grid">
        <div className="code-column">
          <div className="code-header flutter-header">Flutter (ListView.builder)</div>
          <pre className="code-content">
{`ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    final item = items[index];
    return ListTile(
      // Key preserves element identity
      key: ValueKey(item.id),
      title: Text(item.title),
      trailing: IconButton(
        icon: const Icon(Icons.delete),
        onPressed: () {
          setState(() {
            items.removeAt(index);
          });
        },
      ),
    );
  },
)`}
          </pre>
        </div>

        <div className="code-column">
          <div className="code-header react-header">React (Array.map & key)</div>
          <pre className="code-content">
{`// Declarative JavaScript map function
{items.map((item) => (
  <div 
    // Key preserves Virtual DOM identity
    key={item.id}
    className="item"
  >
    <span>{item.title}</span>
    <button onClick={() => {
      // Functional immutable filter
      setItems(prev => 
        prev.filter(i => i.id !== item.id)
      );
    }}>
      Delete
    </button>
  </div>
))}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
