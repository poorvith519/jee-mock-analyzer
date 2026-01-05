import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
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

// Subject colors for graphs
const COLORS = { Physics: "#22d3ee", Chemistry: "#facc15", Maths: "#8b5cf6", Weak: "#f87171" };

export default function App() {
  const [page, setPage] = useState("home");
  const [deepMock, setDeepMock] = useState(null); // for deep analysis

  // --- MOCKS DATA ---
  const [mocks, setMocks] = useState([
    { id: 1, name: "Mock 1", date: "2026-01-01", platform: "Mathongo", correct: {p:10,c:12,m:8}, incorrect:{p:5,c:3,m:7}, unattempted:{p:10,c:10,m:10} },
    { id: 2, name: "Mock 2", date: "2026-01-02", platform: "Allen", correct:{p:12,c:10,m:14}, incorrect:{p:6,c:7,m:5}, unattempted:{p:7,c:8,m:6} }
  ]);

  // --- ADD MOCK STATE ---
  const [mockName, setMockName] = useState("");
  const [mockDate, setMockDate] = useState(new Date().toISOString().slice(0,10));
  const [mockPlatform, setMockPlatform] = useState("");
  const [correct, setCorrect] = useState({p:"",c:"",m:""});
  const [incorrect, setIncorrect] = useState({p:"",c:"",m:""});
  const [unattempted, setUnattempted] = useState({p:"",c:"",m:""});

  // --- CALCULATED TOTAL MARKS ---
  const calcMarks = (mock) => {
    const { correct, incorrect } = mock;
    return correct.p*4 + correct.c*4 + correct.m*4 - (incorrect.p + incorrect.c + incorrect.m);
  };

  const latest = mocks[mocks.length-1];
  const latestTotal = calcMarks(latest);
  const pred = getPrediction(latestTotal);

  // Weak subject detection
  const getWeakSubject = (mock) => {
    const marks = {
      Physics: mock.correct.p*4 - mock.incorrect.p,
      Chemistry: mock.correct.c*4 - mock.incorrect.c,
      Maths: mock.correct.m*4 - mock.incorrect.m
    };
    const minMarks = Math.min(...Object.values(marks));
    return Object.keys(marks).filter(sub => marks[sub] === minMarks).join(", ");
  };

  // --- ADD MOCK FUNCTION ---
  const addMock = () => {
    // validation
    if(!mockName || !mockDate || !mockPlatform || !correct.p || !correct.c || !correct.m){
      alert("Please fill all required fields");
      return;
    }
    // convert strings to numbers
    const newMock = {
      id: mocks.length+1,
      name: mockName,
      date: mockDate,
      platform: mockPlatform,
      correct:{p:Number(correct.p),c:Number(correct.c),m:Number(correct.m)},
      incorrect:{p:Number(incorrect.p||0),c:Number(incorrect.c||0),m:Number(incorrect.m||0)},
      unattempted:{p:Number(unattempted.p||0),c:Number(unattempted.c||0),m:Number(unattempted.m||0)}
    };
    setMocks([...mocks,newMock]);
    // reset form
    setMockName(""); setMockDate(new Date().toISOString().slice(0,10));
    setMockPlatform(""); setCorrect({p:"",c:"",m:""}); setIncorrect({p:"",c:"",m:""}); setUnattempted({p:"",c:"",m:""});
    setPage("home");
  };

  // --- DELETE MOCK ---
  const deleteMock = (id) => {
    if(window.confirm("Delete this mock?")){
      setMocks(mocks.filter(m=>m.id!==id));
    }
  };

  // Left nav style
  const navStyle = {
    position:"fixed", top:0, left:0, bottom:0, width:120,
    background:"#0f172a", display:"flex", flexDirection:"column",
    alignItems:"center", paddingTop:20, borderRight:"1px solid #1e293b"
  };
  const navBtn = (active) => ({
    color: active?"#22d3ee":"#94a3b8", fontWeight: active?"600":"400",
    margin:20, cursor:"pointer", writingMode:"vertical-rl", textOrientation:"upright"
  });
  const contentStyle = { marginLeft:140, padding:20 };

  return (
    <div style={{background:"linear-gradient(180deg,#020617,#0f172a)",minHeight:"100vh",color:"#e5e7eb",fontFamily:"Inter,system-ui"}}>
      {/* HEADER */}
      <div style={{display:"flex",alignItems:"center",padding:16,borderBottom:"1px solid #1e293b"}}>
        <img src="https://img.icons8.com/ios-filled/50/22d3ee/combo-chart.png" alt="logo" style={{width:30,marginRight:10}}/>
        <h1 style={{fontSize:22,fontWeight:700}}>JEE Strategy</h1>
      </div>

      {/* LEFT NAV */}
      <div style={navStyle}>
        <div onClick={()=>{setPage("home");setDeepMock(null)}} style={navBtn(page==="home")}>Home</div>
        <div onClick={()=>{setPage("mocks");setDeepMock(null)}} style={navBtn(page==="mocks")}>Mocks</div>
        <div onClick={()=>{setPage("add");setDeepMock(null)}} style={navBtn(page==="add")}>Add</div>
      </div>

      {/* MAIN CONTENT */}
      <div style={contentStyle}>

        {/* HOME PAGE */}
        {page==="home" && !deepMock && (
          <>
            <div style={{background:"#0f172a",padding:16,borderRadius:16}}>
              <p style={{color:"#94a3b8"}}>Latest Score</p>
              <h2 style={{fontSize:32}}>{latestTotal}</h2>
              <p>{pred.p} percentile • Rank {pred.r}</p>
              <p>Weak Subject(s): {getWeakSubject(latest)}</p>
            </div>

            <div style={{marginTop:20, background:"#0f172a", padding:16, borderRadius:16}}>
              <h3 style={{marginBottom:12}}>Performance Trend (Total Marks)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={mocks.map((m,i)=>({name:`M${i+1}`,marks:calcMarks(m)}))}>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3"/>
                  <XAxis dataKey="name" stroke="#64748b"/>
                  <YAxis stroke="#64748b"/>
                  <Tooltip/>
                  <Line dataKey="marks" stroke="#22d3ee" strokeWidth={3}/>
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{marginTop:20, background:"#0f172a", padding:16, borderRadius:16}}>
              <h3 style={{marginBottom:12}}>Latest Subject-wise Performance</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={[
                  {subject:"Physics",marks:latest.correct.p*4 - latest.incorrect.p},
                  {subject:"Chemistry",marks:latest.correct.c*4 - latest.incorrect.c},
                  {subject:"Maths",marks:latest.correct.m*4 - latest.incorrect.m},
                ]}>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3"/>
                  <XAxis dataKey="subject" stroke="#64748b"/>
                  <YAxis stroke="#64748b"/>
                  <Tooltip/>
                  <Line dataKey="marks" stroke="#22d3ee" strokeWidth={4}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* MOCKS PAGE */}
        {page==="mocks" && !deepMock && (
          <>
            {mocks.map(mk=>(
              <div key={mk.id} style={{marginTop:16,background:"#0f172a",padding:16,borderRadius:16,position:"relative"}}>
                <b>{mk.name}</b>
                <p>Date: {mk.date} | Platform: {mk.platform}</p>
                <p>Total Score: {calcMarks(mk)}</p>
                <p>Weak Subject(s): {getWeakSubject(mk)}</p>
                <div style={{display:"flex",marginTop:10,gap:10}}>
                  <button onClick={()=>setDeepMock(mk)} style={{flex:1,padding:8,borderRadius:12,background:"linear-gradient(90deg,#22d3ee,#8b5cf6)",color:"white",fontWeight:600}}>Deep Analysis</button>
                  <button onClick={()=>deleteMock(mk.id)} style={{flex:1,padding:8,borderRadius:12,background:"#f87171",color:"white",fontWeight:600}}>Delete</button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* DEEP ANALYSIS PAGE */}
        {deepMock && (
          <div style={{background:"#0f172a",padding:16,borderRadius:16}}>
            <h2>{deepMock.name} - {deepMock.platform}</h2>
            <p>Date: {deepMock.date}</p>
            <p>Total Marks: {calcMarks(deepMock)}</p>
            <p>Weak Subject(s): {getWeakSubject(deepMock)}</p>
            <p>Accuracy: {((calcMarks(deepMock)/100)*100).toFixed(2)}%</p>

            <h3 style={{marginTop:16}}>Subject-wise Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={[
                  {name:"Physics",value:deepMock.correct.p*4 - deepMock.incorrect.p},
                  {name:"Chemistry",value:deepMock.correct.c*4 - deepMock.incorrect.c},
                  {name:"Maths",value:deepMock.correct.m*4 - deepMock.incorrect.m}
                ]} dataKey="value" nameKey="name" outerRadius={80} label>
                  <Cell fill={COLORS.Physics}/>
                  <Cell fill={COLORS.Chemistry}/>
                  <Cell fill={COLORS.Maths}/>
                </Pie>
                <Legend/>
              </PieChart>
            </ResponsiveContainer>

            <button onClick={()=>setDeepMock(null)} style={{marginTop:16,padding:12,width:"100%",borderRadius:12,background:"linear-gradient(90deg,#22d3ee,#8b5cf6)",color:"white",fontWeight:700}}>Back</button>
          </div>
        )}

        {/* ADD MOCK PAGE */}
        {page==="add" && (
          <div style={{background:"#0f172a",padding:16,borderRadius:16}}>
            <h2 style={{fontWeight:700,fontSize:20,marginBottom:12}}>Add New Mock</h2>

            <input placeholder="Mock Name" value={mockName} onChange={e=>setMockName(e.target.value)}
              style={{width:"100%",padding:12,marginBottom:12,borderRadius:12,border:"1px solid #334155",background:"#020617",color:"white",outline:"none"}}/>

            <input type="date" value={mockDate} onChange={e=>setMockDate(e.target.value)}
              style={{width:"100%",padding:12,marginBottom:12,borderRadius:12,border:"1px solid #334155",background:"#020617",color:"white",outline:"none"}}/>

            <select value={mockPlatform} onChange={e=>setMockPlatform(e.target.value)}
              style={{width:"100%",padding:12,marginBottom:12,borderRadius:12,border:"1px solid #334155",background:"#020617",color:"white",outline:"none"}}>
              <option value="">Select Platform</option>
              <option value="Mathongo">Mathongo</option>
              <option value="Allen">Allen</option>
              <option value="FIITJEE">FIITJEE</option>
              <option value="Other">Other</option>
            </select>

            {["p","c","m"].map(sub=>(
              <div key={sub} style={{marginBottom:12}}>
                <h4 style={{marginBottom:6}}>{sub==="p"?"Physics":sub==="c"?"Chemistry":"Maths"}</h4>
                <input type="number" placeholder="Correct" value={correct[sub]} onChange={e=>setCorrect({...correct,[sub]:e.target.value})} max={25}
                  style={{width:"32%",padding:8,marginRight:"2%",borderRadius:8,border:"1px solid #334155",background:"#020617",color:"white",outline:"none"}}/>
                <input type="number" placeholder="Incorrect" value={incorrect[sub]} onChange={e=>setIncorrect({...incorrect,[sub]:e.target.value})} max={25}
                  style={{width:"32%",padding:8,marginRight:"2%",borderRadius:8,border:"1px solid #334155",background:"#020617",color:"white",outline:"none"}}/>
                <input type="number" placeholder="Unattempted" value={unattempted[sub]} onChange={e=>setUnattempted({...unattempted,[sub]:e.target.value})} max={25}
                  style={{width:"32%",padding:8,borderRadius:8,border:"1px solid #334155",background:"#020617",color:"white",outline:"none"}}/>
              </div>
            ))}

            <button onClick={addMock} style={{width:"100%",padding:14,marginTop:12,borderRadius:12,background:"linear-gradient(90deg,#22d3ee,#8b5cf6)",color:"white",fontWeight:700}}>Save Mock</button>
          </div>
        )}

      </div>
    </div>
  );
}
