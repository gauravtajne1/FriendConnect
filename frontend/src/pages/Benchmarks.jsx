import React from "react";

export default function Benchmarks() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold text-slate-800">
        Performance Benchmarks
      </h1>

      <p className="text-slate-600">
        Compare the performance of FriendConnect graph algorithms.
      </p>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-2">Benchmarks</h2>
        <p className="text-slate-500">
          Benchmark analysis will be displayed here.
        </p>
      </div>
    </div>
  );
}
