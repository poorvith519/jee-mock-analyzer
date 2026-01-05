import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { FiMenu, FiHome, FiPlus, FiList, FiPieChart } from "react-icons/fi";

// Prediction based on marks
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

const COLORS = { Physics: "#22d3ee", Chemistry: "#facc15", Maths: "#8b5cf6" };
const CARD_COLORS = ["#1e293b", "#111827", "#0f172a", "#1f2937", "#111b21"];

export default function App() {
  const [page, setPage] = useState("home");
  const [deepMock, setDeepMock] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [mocks, setMocks] = useState([]);

  // Add mock states
  const [mockName, setMockName] = useState("");
  const [mockDate, setMockDate] = useState(new Date().toISOString().slice(0, 10));
  const [mockPlatform, setMockPlatform] = useState("");
  const [correct, setCorrect] = useState({ p: "", c: "", m: "" });
  const [incorrect, setIncorrect] = useState({ p: "", c: "", m: "" });
  const [unattempted, setUnattempted] = useState({ p: "", c: "", m: "" });

  // Calculate total marks
  const calcMarks = (mock) =>
    mock.correct.p * 4 +
    mock.correct.c * 4 +
    mock.correct.m * 4 -
    (mock.incorrect.p + mock.incorrect.c + mock.incorrect.m);

  const latest = mocks[mocks.length - 1] || {
    correct: { p: 0, c: 0, m: 0 },
    incorrect: { p: 0, c: 0, m: 0 },
    unattempted: { p: 0, c: 0, m: 0 },
  };
  const latestTotal = calcMarks(latest);
  const pred = getPrediction(latestTotal);

  const getWeakSubject = (mock) => {
    const marks = {
      Physics: mock.correct.p * 4 - mock.incorrect.p,
      Chemistry: mock.correct.c * 4 - mock.incorrect.c,
      Maths: mock.correct.m * 4 - mock.incorrect.m,
    };
    const minMarks = Math.min(...Object.values(marks));
    return Object.keys(marks).filter((sub) => marks[sub] === minMarks).join(", ");
  };

  const addMock = () => {
    if (!mockName || !mockDate || !mockPlatform || !correct.p || !correct.c || !correct.m) {
      alert("Please fill all required fields");
      return;
    }
    const newMock = {
      id: mocks.length + 1,
      name: mockName,
      date: mockDate,
      platform: mockPlatform,
      correct: { p: Number(correct.p), c: Number(correct.c), m: Number(correct.m) },
      incorrect: { p: Number(incorrect.p || 0), c: Number(incorrect.c || 0), m: Number(incorrect.m || 0) },
      unattempted: { p: Number(unattempted.p || 0), c: Number(unattempted.c || 0), m: Number(unattempted.m || 0) },
    };
    setMocks([...mocks, newMock]);
    setMockName("");
    setMockDate(new Date().toISOString().slice(0, 10));
    setMockPlatform("");
    setCorrect({ p: "", c: "", m: "" });
    setIncorrect({ p: "", c: "", m: "" });
    setUnattempted({ p: "", c: "", m: "" });
    setPage("home");
  };

  const deleteMock = (id) => {
    if (window.confirm("Delete this mock?")) {
      setMocks(mocks.filter((m) => m.id !== id));
    }
  };

  const lastMocks = mocks.slice(-5);

  return (
    <div
      style={{
        background: "linear-gradient(180deg,#020617,#0f172a)",
        minHeight: "100vh",
        color: "#e5e7eb",
        fontFamily: "Inter,system-ui",
      }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", padding: 16 }}>
        <FiMenu size={28} style={{ marginRight: 16, cursor: "pointer" }} onClick={() => setMenuOpen(!menuOpen)} />
        <img src="https://img.icons8.com/ios-filled/50/22d3ee/combo-chart.png" alt="logo" style={{ width: 30, marginRight: 10 }} />
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>JEE Strategy</h1>
      </div>

      {/* COLLAPSIBLE NAV */}
      {menuOpen && (
        <div style={{ position: "absolute", top: 64, left: 16, background: "#0f172a", padding: 16, borderRadius: 12, zIndex: 1000, boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
          <div style={{ marginBottom: 12, cursor: "pointer" }} onClick={() => { setPage("home"); setMenuOpen(false); }}><FiHome /> Home</div>
          <div style={{ marginBottom: 12, cursor: "pointer" }} onClick={() => { setPage("mocks"); setMenuOpen(false); }}><FiList /> Mocks</div>
          <div style={{ marginBottom: 12, cursor: "pointer" }} onClick={() => { setPage("add"); setMenuOpen(false); }}><FiPlus /> Add</div>
        </div>
      )}

      <div style={{ padding: 20 }}>
        {/* HOME PAGE */}
        {page === "home" && !deepMock && (
          <>
            <div style={{ background: "#111827", padding: 16, borderRadius: 16, marginBottom: 20 }}>
              <p style={{ color: "#94a3b8" }}>Latest Score</p>
              <h2 style={{ fontSize: 32 }}>{latestTotal}</h2>
              <p>{pred.p} percentile • Rank {pred.r}</p>
              <p>Weak Subject(s): {getWeakSubject(latest)}</p>
            </div>

            <div style={{ background: "#111827", padding: 16, borderRadius: 16, marginBottom: 20 }}>
              <h3 style={{ marginBottom: 12 }}>Total Marks Trend (Last 5 Mocks)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={lastMocks.map((m) => ({ name: `M${m.id}`, marks: calcMarks(m) }))}>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Line dataKey="marks" stroke="#22d3ee" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* MOCKS PAGE */}
        {page === "mocks" && !deepMock && (
          <>
            {mocks.map((mk, i) => (
              <div key={mk.id} style={{ marginTop: 16, background: CARD_COLORS[i % CARD_COLORS.length], padding: 16, borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
                <b>{mk.name}</b>
                <p>Date: {mk.date} | Platform: {mk.platform}</p>
                <p>Total Marks: {calcMarks(mk)}</p>
                <p>Weak Subject(s): {getWeakSubject(mk)}</p>
                <div style={{ display: "flex", marginTop: 10, gap: 10 }}>
                  <button onClick={() => setDeepMock(mk)} style={{ flex: 1, padding: 8, borderRadius: 12, background: "linear-gradient(90deg,#22d3ee,#8b5cf6)", color: "white", fontWeight: 600 }}>Deep Analysis</button>
                  <button onClick={() => deleteMock(mk.id)} style={{ flex: 1, padding: 8, borderRadius: 12, background: "#f87171", color: "white", fontWeight: 600 }}>Delete</button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ADD PAGE */}
        {page === "add" && (
          <div style={{ background: "#111827", padding: 16, borderRadius: 16 }}>
            <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12 }}><FiPlus /> Add New Mock</h2>

            <input placeholder="Mock Name" value={mockName} onChange={(e) => setMockName(e.target.value)}
              style={{ width: "100%", padding: 12, marginBottom: 12, borderRadius: 12, border: 0, background: "#020617", color: "white", outline: "none" }} />

            <input type="date" value={mockDate} onChange={(e) => setMockDate(e.target.value)}
              style={{ width: "100%", padding: 12, marginBottom: 12, borderRadius: 12, border: 0, background: "#020617", color: "white", outline: "none" }} />

            <select value={mockPlatform} onChange={(e) => setMockPlatform(e.target.value)}
              style={{ width: "100%", padding: 12, marginBottom: 12, borderRadius: 12, border: 0, background: "#020617", color: "white", outline: "none" }}>
              <option value="">Select Platform</option>
              <option value="Mathongo">Mathongo</option>
              <option value="Allen">Allen</option>
              <option value="FIITJEE">FIITJEE</option>
              <option value="Other">Other</option>
            </select>

            {["p", "c", "m"].map(sub => (
              <div key={sub} style={{ marginBottom: 12 }}>
                <h4 style={{ marginBottom: 6 }}>{sub === "p" ? "Physics" : sub === "c" ? "Chemistry" : "Maths"}</h4>
                <input type="number" placeholder="Correct" value={correct[sub]} onChange={(e) => setCorrect({ ...correct, [sub]: e.target.value })} max={25}
                  style={{ width: "32%", padding: 8, marginRight: "2%", borderRadius: 8, border: 0, background: "#020617", color: "white", outline: "none" }} />
                <input type="number" placeholder="Incorrect" value={incorrect[sub]} onChange={(e) => setIncorrect({ ...incorrect, [sub]: e.target.value })} max={25}
                  style={{ width: "32%", padding: 8, marginRight: "2%", borderRadius: 8, border: 0, background: "#020617", color: "white", outline: "none" }} />
                <input type="number" placeholder="Unattempted" value={unattempted[sub]} onChange={(e) => setUnattempted({ ...unattempted, [sub]: e.target.value })} max={25}
                  style={{ width: "32%", padding: 8, borderRadius: 8, border: 0, background: "#020617", color: "white", outline: "none" }} />
              </div>
            ))}

            <button onClick={addMock} style={{ width: "100%", padding: 14, marginTop: 12, borderRadius: 12, background: "linear-gradient(90deg,#22d3ee,#8b5cf6)", color: "white", fontWeight: 700 }}>Save Mock</button>
          </div>
        )}
      </div>
    </div>
  );
}
