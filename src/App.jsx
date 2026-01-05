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
  const [data, setData] = useState([
    { test: "Mock 1", marks: 120 },
    { test: "Mock 2", marks: 145 },
    { test: "Mock 3", marks: 132 }
  ]);

  const [physics, setPhysics] = useState("");
  const [chemistry, setChemistry] = useState("");
  const [maths, setMaths] = useState("");

  const addMock = () => {
    const total =
      Number(physics) + Number(chemistry) + Number(maths);

    if (total <= 0) return;

    setData([
      ...data,
      {
        test: `Mock ${data.length + 1}`,
        marks: total
      }
    ]);

    setPhysics("");
    setChemistry("");
    setMaths("");
  };

  return (
    <div style={{ background: "black", minHeight: "100vh", color: "white", padding: 20 }}>
      <h1>JEE Mock Test Analyzer</h1>

      <h2>Performance Trend</h2>
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="test" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip />
            <Line type="monotone" dataKey="marks" stroke="#00ffcc" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h2>Add New Mock</h2>

      <input
        type="number"
        placeholder="Physics"
        value={physics}
        onChange={(e) => setPhysics(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />

      <input
        type="number"
        placeholder="Chemistry"
        value={chemistry}
        onChange={(e) => setChemistry(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />

      <input
        type="number"
        placeholder="Maths"
        value={maths}
        onChange={(e) => setMaths(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />

      <button
        onClick={addMock}
        style={{
          width: "100%",
          padding: 10,
          background: "#00ffcc",
          border: "none",
          fontWeight: "bold"
        }}
      >
        Add Mock
      </button>
    </div>
  );
}
