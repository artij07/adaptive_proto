/*
Adaptive Learning Prototype (single-file React component)

What's included:
- Mock login (choose a student)
- Adaptive assessment engine (easy -> medium -> hard) with simple scoring
- Mapping of wrong answers to four fundamentals: Listening, Grasping, Retention, Application
- Practice module (system-recommended and free-choice)
- Simple dashboard with SVG charts and diagnostic report

How to run (quick):
1) Create a new React app (using Create React App):
   npx create-react-app adaptive-proto
   cd adaptive-proto
2) Replace src/App.js with this file's code (rename to App.js) and remove default files.
3) npm start

No external libraries required.

Note: This is a compact prototype meant for hackathon demo. It focuses on UX and core adaptive logic; backend persistence and auth are mocked.
*/

import React, { useState, useEffect } from "react";

const STUDENTS = [
  { id: "ram", name: "Ram" },
  { id: "shyam", name: "Shyam" },
  { id: "sanga", name: "Sanga" }
];

// Question bank: each question maps to chapter/topic and assesses primarily one fundamental
const QUESTION_BANK = [
  // Easy
  { id: 1, level: "easy", text: "If a car travels 60 km in 1 hour, what's its speed?", answer: "60", fundamental: "grasping", chapter: "Time & Distance" },
  { id: 2, level: "easy", text: "A runner covers 5 km in 25 minutes. Average speed (km/h)?", answer: "12", fundamental: "application", chapter: "Time & Distance" },
  { id: 3, level: "easy", text: "Teacher explains formula 'speed = distance/time' clearly" , answer: "true", fundamental: "listening", chapter: "Concepts" },
  { id: 4, level: "easy", text: "Recall: speed = ? (type 'distance/time')", answer: "distance/time", fundamental: "retention", chapter: "Formulae" },
  // Medium
  { id: 5, level: "medium", text: "A train covers 180 km in 3 hours. Then another 90 km in 1 hour. Average speed for entire journey?", answer: "67.5", fundamental: "application", chapter: "Time & Distance" },
  { id: 6, level: "medium", text: "If distance doubles and time halves, speed becomes?", answer: "4x", fundamental: "grasping", chapter: "Proportions" },
  { id: 7, level: "medium", text: "You were asked a question and forgot the formula during revision. This indicates which issue? (listening/grasping/retention/application)", answer: "retention", fundamental: "retention", chapter: "Meta" },
  // Hard
  { id: 8, level: "hard", text: "Two cars start from same point. Car A: 60 km/h, Car B: 40 km/h. After how long will A be 40 km ahead?", answer: "2", fundamental: "application", chapter: "Relative Speed" },
  { id: 9, level: "hard", text: "Explain why average speed is NOT the arithmetic mean when distances are equal? (short) (answer: weighted)", answer: "weighted", fundamental: "grasping", chapter: "Conceptual" }
];

// Helper: get questions by level
const questionsByLevel = (level) => QUESTION_BANK.filter(q => q.level === level);

export default function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("menu"); // menu | quiz | practice | dashboard
  const [currentLevel, setCurrentLevel] = useState("easy");
  const [qIndex, setQIndex] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState(questionsByLevel("easy"));
  const [responses, setResponses] = useState([]); // {qId, correct, fundamental}
  const [lastResult, setLastResult] = useState(null);
  const [diagnostics, setDiagnostics] = useState({ listening:0, grasping:0, retention:0, application:0 });
  const [practiceChapter, setPracticeChapter] = useState("All");

  useEffect(() => {
    setCurrentQuestions(questionsByLevel(currentLevel));
    setQIndex(0);
  }, [currentLevel]);

  // Adaptive decision: move level up/down based on streak
  const evaluateAnswer = (question, answer) => {
    const correct = String(answer).trim().toLowerCase() === String(question.answer).trim().toLowerCase();

    // update responses
    const r = { qId: question.id, correct, fundamental: question.fundamental };
    setResponses(prev => [...prev, r]);
    setLastResult({ question, correct });

    // update diagnostics: increment counter for wrong answers mapping to fundamentals
    if (!correct) {
      setDiagnostics(d => ({ ...d, [question.fundamental]: d[question.fundamental] + 1 }));
    }

    // basic adaptive: if two correct in a row -> increase, if two wrong in a row -> decrease
    const recent = [...responses.slice(-2), r];
    const lastTwo = recent.slice(-2);
    if (lastTwo.length === 2) {
      const bothCorrect = lastTwo.every(x => x.correct);
      const bothWrong = lastTwo.every(x => !x.correct);
      if (bothCorrect) {
        if (currentLevel === "easy") setCurrentLevel("medium");
        else if (currentLevel === "medium") setCurrentLevel("hard");
      } else if (bothWrong) {
        if (currentLevel === "hard") setCurrentLevel("medium");
        else if (currentLevel === "medium") setCurrentLevel("easy");
      }
    }

    // move to next question in the new level
    setTimeout(() => {
      setQIndex(i => i + 1);
      setLastResult(null);
    }, 700);
  };

  const startQuiz = () => {
    setResponses([]);
    setDiagnostics({ listening:0, grasping:0, retention:0, application:0 });
    setCurrentLevel("easy");
    setMode("quiz");
  };

  const finishQuiz = () => {
    setMode("dashboard");
  };

  // pick next question based on user choice (or adaptive)
  const getActiveQuestion = () => {
    const pool = currentQuestions;
    if (!pool || pool.length === 0) return null;
    const idx = qIndex % pool.length;
    return pool[idx];
  };

  // derive a simple recommendation from diagnostics
  const recommendations = () => {
    // sort fundamentals by highest count
    const entries = Object.entries(diagnostics).sort((a,b) => b[1]-a[1]);
    return entries.map(e => ({ fundamental: e[0], issues: e[1] }));
  };

  // Practice list (filter by chapter)
  const practiceList = (chapter) => {
    if (chapter === "All") return QUESTION_BANK;
    return QUESTION_BANK.filter(q => q.chapter === chapter);
  };

  const chapters = Array.from(new Set(QUESTION_BANK.map(q => q.chapter)));

  return (
    <div style={styles.app}>
      <header style={styles.header}><h1>Adaptive Learning — Prototype</h1></header>
      {!user && (
        <div style={styles.card}>
          <h2>Choose Student (mock login)</h2>
          {STUDENTS.map(s => (
            <button key={s.id} style={styles.btn} onClick={() => setUser(s)}>{s.name}</button>
          ))}
        </div>
      )}

      {user && (
        <div>
          <div style={styles.topBar}>
            <div>Signed in as <strong>{user.name}</strong></div>
            <div>
              <button style={styles.smallBtn} onClick={() => { setMode("menu"); }}>Home</button>
              <button style={styles.smallBtn} onClick={() => startQuiz()}>Start Adaptive Assessment</button>
              <button style={styles.smallBtn} onClick={() => setMode("practice")}>Practice</button>
              <button style={styles.smallBtn} onClick={() => setMode("dashboard")}>Dashboard</button>
            </div>
          </div>

          {mode === "menu" && (
            <div style={styles.grid}>
              <div style={styles.card}>
                <h3>Quick Overview</h3>
                <p>Click <em>Start Adaptive Assessment</em> to begin. The system will adapt difficulty based on recent responses and map mistakes to core fundamentals.</p>
              </div>

              <div style={styles.card}>
                <h3>Student Snapshot</h3>
                <p>Responses: {responses.length}</p>
                <p>Diagnostics: Listening {diagnostics.listening}, Grasping {diagnostics.grasping}, Retention {diagnostics.retention}, Application {diagnostics.application}</p>
              </div>
            </div>
          )}

          {mode === "quiz" && (
            <div style={styles.card}>
              <h2>Adaptive Assessment — Level: {currentLevel.toUpperCase()}</h2>
              <p>Question {qIndex+1}</p>
              {(() => {
                const q = getActiveQuestion();
                if (!q) return <div>No questions for this level.</div>;
                return <QuizQuestion question={q} onAnswer={(ans)=>{
                  evaluateAnswer(q, ans);
                  // if we completed a round of 6 questions, finish
                  if (responses.length+1 >= 6) finishQuiz();
                }} lastResult={lastResult} />;
              })()}

              <div style={{marginTop:12}}>
                <button style={styles.linkBtn} onClick={() => finishQuiz()}>Finish assessment early</button>
              </div>
            </div>
          )}

          {mode === "practice" && (
            <div style={styles.card}>
              <h2>Practice</h2>
              <div>
                <h4>Recommended based on diagnostics</h4>
                {recommendations().map(r => (
                  <div key={r.fundamental} style={{marginBottom:8}}>
                    <strong>{r.fundamental.toUpperCase()}</strong>: {r.issues} flagged mistakes. <button style={styles.smallBtn} onClick={() => { setPracticeChapter("All"); setMode("practice"); }}>Practice Now</button>
                  </div>
                ))}

                <h4>Or choose chapter</h4>
                <select value={practiceChapter} onChange={(e)=>setPracticeChapter(e.target.value)}>
                  <option>All</option>
                  {chapters.map(c => <option key={c}>{c}</option>)}
                </select>

                <div style={{marginTop:12}}>
                  {practiceList(practiceChapter).map(q => (
                    <div key={q.id} style={styles.practiceQ}>
                      <div>{q.text} <em>({q.level})</em></div>
                      <div><small>Fundamental: {q.fundamental}</small></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {mode === "dashboard" && (
            <div style={styles.card}>
              <h2>Diagnostic Dashboard</h2>
              <div style={{display:'flex', gap:20}}>
                <div style={{flex:1}}>
                  <h4>Fundamentals Radar</h4>
                  <RadarChart data={diagnostics} />
                </div>
                <div style={{flex:1}}>
                  <h4>Key Insights</h4>
                  <ol>
                    {recommendations().map(r => (
                      <li key={r.fundamental}>{r.fundamental.toUpperCase()}: {r.issues} flagged — recommended targeted practice.</li>
                    ))}
                  </ol>
                  <h4>Suggested Plan</h4>
                  <ul>
                    <li>2 sessions on <strong>Application</strong> problems (word problems)</li>
                    <li>1 quick revision for <strong>Retention</strong> (flashcards)</li>
                    <li>Teacher to check concept clarity for <strong>Grasping</strong></li>
                  </ul>
                </div>
              </div>

              <div style={{marginTop:16}}>
                <h4>Response Log</h4>
                <table style={styles.table}>
                  <thead><tr><th>Q</th><th>Level</th><th>Fundamental</th><th>Correct</th></tr></thead>
                  <tbody>
                    {responses.map((r, i) => {
                      const q = QUESTION_BANK.find(qq=>qq.id===r.qId);
                      return <tr key={i}><td>{q? q.text : r.qId}</td><td>{q? q.level : ''}</td><td>{r.fundamental}</td><td>{r.correct? 'Yes':'No'}</td></tr>
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      <footer style={styles.footer}>
        <small>Prototype for Hack-A-Thon: Education for AI — Adaptive Assessment & Practice Tool</small>
      </footer>
    </div>
  );
}

function QuizQuestion({ question, onAnswer, lastResult }) {
  const [input, setInput] = useState("");

  useEffect(() => { setInput(""); }, [question.id]);

  return (
    <div>
      <div style={styles.qCard}>
        <div style={{marginBottom:8}}><strong>{question.text}</strong></div>
        <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Type answer here" style={styles.input} />
        <div style={{marginTop:8}}>
          <button style={styles.btn} onClick={()=>onAnswer(input)}>Submit</button>
        </div>
        {lastResult && lastResult.question.id === question.id && (
          <div style={{marginTop:8}}>{lastResult.correct? <span style={{color:'green'}}>Correct ✓</span> : <span style={{color:'red'}}>Incorrect ✗</span>}</div>
        )}
      </div>
    </div>
  )
}

function RadarChart({ data }) {
  // Very simple radar-like bar visualization using SVG
  const keys = Object.keys(data);
  const max = Math.max(...Object.values(data), 1);
  return (
    <svg width={260} height={200} viewBox="0 0 260 200">
      {keys.map((k,i)=>{
        const x = 20 + i*60;
        const h = (data[k]/max) * 120;
        return (
          <g key={k}>
            <rect x={x} y={150-h} width={30} height={h} rx={4} />
            <text x={x+15} y={168} fontSize={11} textAnchor="middle">{k}</text>
            <text x={x+15} y={140-h} fontSize={10} textAnchor="middle">{data[k]}</text>
          </g>
        )
      })}
    </svg>
  )
}

const styles = {
  app: { fontFamily: 'Inter, Arial, sans-serif', padding:20, maxWidth:980, margin:'0 auto' },
  header: { marginBottom:12 },
  card: { background:'#fff', padding:16, borderRadius:8, boxShadow:'0 6px 20px rgba(0,0,0,0.06)', marginBottom:12 },
  btn: { padding:'8px 12px', margin:6, borderRadius:6, border:'none', background:'#2563eb', color:'white', cursor:'pointer' },
  smallBtn: { padding:'6px 8px', marginLeft:6, borderRadius:6, border:'1px solid #ddd', background:'#f7f7f7', cursor:'pointer' },
  linkBtn: { border:'none', background:'transparent', color:'#2563eb', cursor:'pointer' },
  topBar: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 },
  grid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 },
  qCard: { padding:12, border:'1px solid #eee', borderRadius:8 },
  input: { padding:8, width:'100%', borderRadius:6, border:'1px solid #ddd' },
  footer: { marginTop:18, textAlign:'center', color:'#666' },
  table: { width:'100%', borderCollapse:'collapse' },
  practiceQ: { padding:8, borderBottom:'1px dashed #eee' }
};
