import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// --- Prediction based on JEE famous trend ---
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

// --- Bottom navigation style ---
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
  fontWeight: active ? "600" : "400",
  cursor: "pointer"
});

export default function App() {
  const [page, setPage] = useState("home");

  const [mocks, setMocks] = useState([
    { id: 1, name: "Mock 1", date: "2026-01-01", platform: "Mathongo", p: 40, c: 45, m: 35, total: 120 },
    { id: 2, name: "Mock 2", date: "2026-01-02", platform: "Allen", p: 50, c: 48, m: 47, total: 145 },
    { id: 3, name: "Mock 3", date: "2026-01-03", platform: "FIITJEE", p: 46, c: 42, m: 44, total: 132 }
  ]);

  // Add Mock state
  const [mockName, setMockName] = useState("");
  const [mockDate, setMockDate] = useState(new Date().toISOString().slice(0,10));
  const [mockPlatform, setMockPlatform] = useState("");
  const [p, setP] = useState("");
  const [c, setC] = useState("");
  const [m, setM] = useState("");

  const latest = mocks[mocks.length - 1];
  const pred = getPrediction(latest.total);

  const addMock = () => {
    if (!mockName || !mockDate || !mockPlatform || !p || !c || !m) {
      alert("Please fill all required fields");
      return;
    }

    const total = Number(p) + Number(c) + Number(m);
    setMocks([...mocks, {
      id: mocks.length + 1,
      name: mockName,
      date: mockDate,
      platform: mockPlatform,
      p, c, m,
      total
    }]);

    // Reset form
    setP(""); setC(""); setM("");
    setMockName(""); setMockDate(new Date().toISOString().slice(0,10));
    setMockPlatform("");
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

      {/* MOCKS LIST */}
      {page === "mocks" && (
        <>
          {mocks.map((mk) => (
            <div key={mk.id} style={{ marginTop: 12, background: "#020617", padding: 14, borderRadius: 12 }}>
              <b>{mk.name}</b>
              <p>Date: {mk.date} | Platform: {mk.platform}</p>
              <p>Total Score: {mk.total}</p>
              <p>P: {mk.p} | C: {mk.c} | M: {mk.m}</p>
              <p>Percentile: {getPrediction(mk.total).p} | Rank: {getPrediction(mk.total).r}</p>
            </div>
          ))}
        </>
      )}

      {/* ADD MOCK PAGE */}
      {page === "add" && (
        <div style={{ background: "#0f172a", padding: 16, borderRadius: 16, marginTop: 12 }}>
          <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Add New Mock</h2>

          <input
            placeholder="Mock Name (e.g. Mock 1)"
            value={mockName}
            onChange={(e) => setMockName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 12,
              borderRadius: 12,
              border: "1px solid #334155",
              background: "#020617",
              color: "white"
            }}
          />

          <input
            type="date"
            value={mockDate}
            onChange={(e) => setMockDate(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 12,
              borderRadius: 12,
              border: "1px solid #334155",
              background: "#020617",
              color: "white"
            }}
          />

          <select
            value={mockPlatform}
            onChange={(e) => setMockPlatform(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 12,
              borderRadius: 12,
              border: "1px solid #334155",
              background: "#020617",
              color: "white"
            }}
          >
            <option value="">Select Platform</option>
            <option value="Mathongo">Mathongo</option>
            <option value="Allen">Allen</option>
            <option value="FIITJEE">FIITJEE</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="number"
            placeholder="Physics Marks"
            value={p}
            onChange={(e) => setP(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 12,
              borderRadius: 12,
              border: "1px solid #334155",
              background: "#020617",
              color: "white"
            }}
          />

          <input
            type="number"
            placeholder="Chemistry Marks"
            value={c}
            onChange={(e) => setC(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 12,
              borderRadius: 12,
              border: "1px solid #334155",
              background: "#020617",
              color: "white"
            }}
          />

          <input
            type="number"
            placeholder="Maths Marks"
            value={m}
            onChange={(e) => setM(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 12,
              borderRadius: 12,
              border: "1px solid #334155",
              background: "#020617",
              color: "white"
            }}
          />

          <button
            onClick={addMock}
            style={{
              width: "100%",
              padding: 14,
              marginTop: 12,
              borderRadius: 12,
              background: "linear-gradient(90deg, #22d3ee, #8b5cf6)",
              color: "white",
              fontWeight: 700,
              fontSize: 16
            }}
          >
            Save Mock
          </button>
        </div>
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
