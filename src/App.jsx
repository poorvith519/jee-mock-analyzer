import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function App() {
  const [scores] = useState([
    { test: "Mock 1", marks: 120 },
    { test: "Mock 2", marks: 145 },
    { test: "Mock 3", marks: 132 },
    { test: "Mock 4", marks: 160 }
  ]);

  return (
    <div style={{ background: "black", minHeight: "100vh", color: "white", padding: 20 }}>
      <h1>JEE Mock Test Analyzer</h1>

      <h2>Performance Trend</h2>

      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <LineChart data={scores}>
            <XAxis dataKey="test" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="marks"
              stroke="#00ffcc"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
