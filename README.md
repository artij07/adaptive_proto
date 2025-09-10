# Adaptive Learning Prototype

This is a hackathon project: **Adaptive AI-powered Learning Assessment & Practice Tool** built with React.js.  
It is designed to help students identify their learning gaps and provide personalized practice questions, while offering dashboards for teachers and parents to monitor progress.

---

## 👥 Group Information

**Team Name:** BrainWave Innovators  

| Member Name        | Role in Project                          |
|-------------------|----------------------------------------|
| Arti Jadhav        | Frontend Developer & UI Designer        |
| Sneha Basugade    | Backend Developer & API Integration     |
| Shravani Chavan   | AI/Adaptive Logic Developer             |
| Priti Chavan    | Documentation & Testing Lead            |

## 🚀 Features

- Adaptive Assessment: Questions adjust difficulty (Easy → Medium → Hard) based on student performance.
- Learning Gap Identification: Tracks gaps in Listening, Grasping, Retention, and Application.
- Personalized Practice: Suggests questions tailored to each student’s weak areas.
- Dashboards:
  - Student: Tracks progress and performance.
  - Teacher: Monitors multiple students and identifies trends.
  - Parent: Views child’s progress and learning gaps.

## 🛠️ Tech Stack

- Frontend: React.js
- Backend: Node.js + npm
- Visualization: Chart.js / SVG-based charts
- Version Control: Git & GitHub

## 📂 Folder Structure
adaptive-proto/
│
├─ public/ # Static files
├─ src/ # React components and pages
│ ├─ components/ # Reusable UI components
│ ├─ pages/ # App pages (Student, Teacher, Parent dashboards)
│ ├─ utils/ # Utility functions and adaptive logic
│ └─ App.js # Main app component
├─ package.json # Project dependencies
└─ README.md # Project documentation

## ▶️ Run Locally

Clone the repository and install dependencies:

```bash
git clone https://github.com/artij07/adaptive-proto.git
cd adaptive-proto
npm install
npm start
Open http://localhost:3000
 to view the app in your browser.
```

📄 Documentation: Adaptive Learning Prototype
1️⃣ Problem Statement:

Traditional learning assessment tools do not adapt to individual student needs.
Students often face:
1.Repetition of topics they already know.
2.Difficulty identifying weak areas.
3.Lack of personalized practice questions.

Goal: Build an adaptive AI-powered tool to:
1.Assess students dynamically (easy → medium → hard).
2.Identify learning gaps in listening, grasping, retention, and application.
3.Provide personalized practice questions.
4.Allow teachers and parents to monitor progress.

2️⃣ Approach / Problem Solving:

1.Adaptive Assessment Logic:
-Questions change difficulty based on student responses.
-Correct answers → next question harder; wrong answers → easier or same level.

2.Gap Analysis:
-Track performance in multiple dimensions (Listening, Grasping, Retention, Application).
-Identify weak topics automatically.

3.Personalized Practice:
-Recommend practice questions targeting the student’s weak areas.

4.Dashboards:
-Student: Shows progress, gaps, and recommended practice.
-Teacher: Tracks multiple students and overall performance.
-Parent: Monitors child’s improvement and weak areas.

3️⃣ Solution Design:
Architecture Diagram (Conceptual)
[Student Input] --> [Adaptive Assessment Engine] --> [Gap Analysis] --> [Recommendations]

Dashboards:
- Student Dashboard
- Teacher Dashboard
- Parent Dashboard

Components:
Component	Responsibility
React Frontend	UI, dashboards, question rendering
Adaptive Logic Module	Question difficulty adjustment, gap tracking
Node.js Backend	API endpoints, data handling
Chart.js / SVG	Visual representation of progress & gaps
Database (optional)	Store student responses and history
4️⃣ Implementation

1.Frontend:
-Built using React.js
-Components: Dashboard, QuestionCard, ProgressChart, PracticeSection
-State management with useState and useEffect

2.Backend:
-Node.js + Express (if required)
-APIs for submitting answers, fetching questions, and generating reports

3.Adaptive Algorithm:
function getNextQuestion(currentDifficulty, isCorrect) {
    if (isCorrect) {
        return currentDifficulty + 1; // move to harder question
    } else {
        return Math.max(1, currentDifficulty - 1); // easier question
    }
}

4.Gap Analysis
-Score each dimension: Listening, Grasping, Retention, Application
-Example:

const gapScore = {
  listening: correctAnswersListening / totalListeningQuestions,
  grasping: correctAnswersGrasping / totalGraspingQuestions,
  retention: correctAnswersRetention / totalRetentionQuestions,
  application: correctAnswersApplication / totalApplicationQuestions
};


5.Dashboard Visualization
-Use Chart.js for radar/bar charts to visualize gaps and progress.

5️⃣ Conclusion
-Adaptive Learning Prototype provides personalized assessment and actionable insights for students, teachers, and parents.
-Encourages efficient learning by focusing on weak areas.
-Can be extended with AI-powered recommendations, gamification, and mobile app support.
