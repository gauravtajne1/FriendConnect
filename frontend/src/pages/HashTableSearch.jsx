import React, { useState } from 'react';

// Simple hash‑table visualisation using linear probing.
const TABLE_SIZE = 11;

export default function HashTableSearch() {
  const [key, setKey] = useState('');
  const [hashTable, setHashTable] = useState(Array(TABLE_SIZE).fill(null));
  const [steps, setSteps] = useState([]);
  const [message, setMessage] = useState('');

  const hash = k => {
    // Very simple hash: sum char codes modulo size
    let sum = 0;
    for (let i = 0; i < k.length; i++) sum += k.charCodeAt(i);
    return sum % TABLE_SIZE;
  };

  const handleInsert = e => {
    e.preventDefault();
    if (!key) return;
    const h = hash(key);
    const newTable = [...hashTable];
    const newSteps = [];
    let idx = h;
    for (let i = 0; i < TABLE_SIZE; i++) {
      newSteps.push({ idx, action: newTable[idx] === null ? 'empty' : 'occupied' });
      if (newTable[idx] === null) {
        newTable[idx] = key;
        setMessage(`Inserted "${key}" at index ${idx}`);
        break;
      }
      idx = (idx + 1) % TABLE_SIZE;
    }
    setHashTable(newTable);
    setSteps(newSteps);
    setKey('');
  };

  const handleSearch = e => {
    e.preventDefault();
    if (!key) return;
    const h = hash(key);
    const newSteps = [];
    let idx = h;
    for (let i = 0; i < TABLE_SIZE; i++) {
      newSteps.push({ idx, value: hashTable[idx] });
      if (hashTable[idx] === key) {
        setMessage(`Found "${key}" at index ${idx}`);
        break;
      }
      if (hashTable[idx] === null) {
        setMessage(`"${key}" not present (empty slot at ${idx})`);
        break;
      }
      idx = (idx + 1) % TABLE_SIZE;
    }
    setSteps(newSteps);
    setKey('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Hash Table Search (Linear Probing)</h1>
      <form className="flex gap-2" onSubmit={handleInsert}>
        <input
          className="border rounded px-2 py-1"
          placeholder="Key to insert"
          value={key}
          onChange={e => setKey(e.target.value)}
        />
        <button type="submit" className="bg-indigo-600 text-white rounded px-3 py-1">
          Insert
        </button>
        <button type="button" onClick={handleSearch} className="bg-green-600 text-white rounded px-3 py-1">
          Search
        </button>
      </form>
      {message && <p className="text-sm text-gray-700">{message}</p>}
      <div className="grid grid-cols-11 gap-2 mt-4">
        {hashTable.map((val, i) => (
          <div key={i} className="border p-2 text-center text-sm h-12 flex items-center justify-center">
            {val ?? <span className="text-gray-400">—</span>}
          </div>
        ))}
      </div>
      {steps.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold">Probe Steps</h2>
          <ul className="list-disc list-inside text-sm">
            {steps.map((s, i) => (
              <li key={i}>
                Index {s.idx}: {s.value !== undefined ? `"${s.value}"` : s.action}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
