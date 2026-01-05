import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function getPrediction(marks) {
  if (marks >= 285)
    return { p: "99.9+", r: "< 1,000" };
  if (marks >= 260)
    return { p: "99.5 – 99.9", r: "1k – 5k" };
  if (marks >= 230)
    return { p: "99.0 – 99.5", r: "5k – 10k" };
  if (marks >= 200)
    return { p: "98.0 – 99.0", r: "10k – 20k" };
  if (marks >= 170)
    return { p: "96.5 – 98.0", r: "20k – 40k" };
  if (marks >= 140)
    return { p: "94.0 – 96.5", r: "40k – 70k" };
  if (marks >= 110)
    return { p: "90.0 – 94.0", r: "70k – 1.2L" };
  if (marks >= 80)
    return { p: "85.0 – 90.0", r: "1.2L – 2L" };

  return { p: "< 85", r: "> 2L" };
}

export default function App() {
  const [data, setData] = useState([
    { test: "Mock 1", marks: 120 },
    { test: "Mock 2", marks: 145 },
    { test: "Mock 3", marks: 132 }
  ]);

  const [physics, setPhysics] = useState("");
  const [chemistry, setChemistry] = useState("");
  const [maths, setMaths] = useState("");

  const latestMarks = data[data.length - 1].marks;
  const prediction = getPrediction(latestMarks);

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

      <h2>Expected Prediction</h2>
      <p><b>Latest Score:</b> {latestMarks}</p>
      <p><b>Percentile:</b> {prediction.p}</p>
      <p><b>Rank:</b> {prediction.r}</p>

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
