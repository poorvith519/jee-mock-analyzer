import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// --- Quizzr-style dark dashboard layout (single-file version) ---

const navStyle = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  height: 60,
  background: "#0f172a",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  borderTop: "1px solid #1e293b"
};

const navBtn = (active) => ({
  color: active ? "#22d3ee" : "#94a3b8",
  fontWeight: active ? "600" : "400"
});

function getPrediction(marks) {
  if (marks >= 285) return { p: "99.9+", r: "< 1k" };
  if (marks >= 260) return { p: "99.5 – 99.9", r: "1k – 5k" };
  if (marks >= 230) return { p: "99.0 – 99.5", r: "5k – 10k" };
  if (marks >= 200) return { p: "98.0 – 99.0", r: "10k – 20k" };
  if (marks >= 170) return { p: "96.5 – 98.0", r: "20k – 40k" };
  if (marks >= 140) return { p: "94.0 – 96.5", r: "40k – 70k" };
  if (marks >= 110) return { p: "90.0 – 94.0", r: "70k – 1.2L" };
  if (marks >= 80) return { p: "85.0 – 90.0", r: "1.2L – 2L" };
  return { p: "< 85", r: "> 2L" };
}

export default function App() {
  const [page, setPage] = useState("home");

  const [mocks, setMocks] = useState([
    { id: 1, p: 40, c: 45, m: 35, total: 120 },
    { id: 2, p: 50, c: 48, m: 47, total: 145 },
    { id: 3, p: 46, c: 42, m: 44, total: 132 }
  ]);

  const [p, setP] = useState("");
  const [c, setC] = useState("");
  const [m, setM] = useState("");

  const latest = mocks[mocks.length - 1];
  const pred = getPrediction(latest.total);

  const addMock = () => {
    const total = Number(p) + Number(c) + Number(m);
    if (!total) return;
    setMocks([...mocks, { id: mocks.length + 1, p, c, m, total }]);
    setP(""); setC(""); setM("");
    setPage("home");
  };

  return (
    <div style={{
      background: "linear-gradient(180deg, #020617, #020617)",
      minHeight: "100vh",
      color: "#e5e7eb",
      padding: 16,
      paddingBottom: 80,
      fontFamily: "Inter, system-ui"
    }}>

      {/* HEADER */}
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>JEE Mock Analyzer</h1>

      {/* HOME PAGE */}
      {page === "home" && (
        <>
          <div style={{ marginTop: 16, background: "#020617", padding: 16, borderRadius: 14 }}>
            <p style={{ color: "#94a3b8" }}>Latest Score</p>
            <h2 style={{ fontSize: 32 }}>{latest.total}</h2>
            <p>{pred.p} percentile • Rank {pred.r}</p>
          </div>

          <div style={{ marginTop: 16, height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={mocks.map((m, i) => ({ name: `M${i + 1}`, marks: m.total }))}>
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line dataKey="marks" stroke="#22d3ee" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* MOCK LIST */}
      {page === "mocks" && (
        <>
          {mocks.map((mk) => (
            <div key={mk.id} style={{ marginTop: 12, background: "#020617", padding: 14, borderRadius: 12 }}>
              <b>Mock {mk.id}</b>
              <p>Score: {mk.total}</p>
              <p>P {mk.p} | C {mk.c} | M {mk.m}</p>
            </div>
          ))}
        </>
      )}

      {/* ADD MOCK */}
      {page === "add" && (
        <>
          <input placeholder="Physics" value={p} onChange={e => setP(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 12 }} />
          <input placeholder="Chemistry" value={c} onChange={e => setC(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 8 }} />
          <input placeholder="Maths" value={m} onChange={e => setM(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 8 }} />
          <button onClick={addMock} style={{ width: "100%", padding: 12, marginTop: 12, background: "#22d3ee", fontWeight: 700 }}>
            Save Mock
          </button>
        </>
      )}

      {/* BOTTOM NAV */}
      <div style={navStyle}>
        <div onClick={() => setPage("home")} style={navBtn(page === "home")}>Home</div>
        <div onClick={() => setPage("mocks")} style={navBtn(page === "mocks")}>Mocks</div>
        <div onClick={() => setPage("add")} style={navBtn(page === "add")}>Add</div>
      </div>
    </div>
  );
}
