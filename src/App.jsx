import React, { useState } from "react";

export default function App() {
  const [scores] = useState([120, 145, 132, 160]);

  return (
    <div style={{ background: "black", minHeight: "100vh", color: "white", padding: 20 }}>
      <h1>JEE Mock Test Analyzer</h1>

      <p>Mock Scores: {scores.join(", ")}</p>

      <h2>Predicted Percentile</h2>
      <h1>98.2%</h1>

      <p>Estimated Rank: ~18,000</p>

      <p><i>Consistency beats intensity.</i></p>
    </div>
  );
}
