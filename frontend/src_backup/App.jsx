
import { useState } from "react";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const [students, setStudents] = useState([
    { id: "STU001", name: "Rahul Kumar", course: "Computer Science", status: "Present" },
    { id: "STU002", name: "Priya Sharma", course: "Information Technology", status: "Present" },
    { id: "STU003", name: "Arjun Reddy", course: "Computer Science", status: "Absent" },
    { id: "STU004", name: "Sneha Patel", course: "Electronics", status: "Present" },
    { id: "STU005", name: "Kiran Kumar", course: "Mechanical", status: "Absent" }
  ]);

  const present = students.filter(s => s.status === "Present").length;
  const absent = students.length - present;

  function toggleAttendance(id) {
    setStudents(previous =>
      previous.map(student =>
        student.id === id
          ? { ...student, status: student.status === "Present" ? "Absent" : "Present" }
          : student
      )
    );
  }

  const menu = ["Dashboard", "Students", "Attendance", "Reports", "Settings"];

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Attend<span>Ease</span></h2>
        <p className="menu-title">MAIN MENU</p>

        {menu.map(item => (
          <a
            key={item}
            className={activePage === item ? "active" : ""}
            onClick={() => setActivePage(item)}
          >
            {item === "Dashboard" ? "▦ " :
             item === "Students" ? "♙ " :
             item === "Attendance" ? "✓ " :
             item === "Reports" ? "▤ " : "⚙ "}
            {item}
          </a>
        ))}

        <div className="sidebar-bottom">Student Attendance System</div>
      </aside>

      <main className="main">
        <header>
          <div>
            <h1>{activePage}</h1>
            <p>Welcome to your Student Attendance Management System.</p>
          </div>
          <div className="admin-area">
  <button
    className="profile"
    onClick={() => setAdminMenuOpen(!adminMenuOpen)}
  >
    👤 Admin ▾
  </button>

  {adminMenuOpen && (
    <div className="admin-dropdown">
      <button onClick={() => { setActivePage("Admin Login"); setAdminMenuOpen(false); }}>
        Admin Login
      </button>
      <button onClick={() => { setActivePage("Admin Dashboard"); setAdminMenuOpen(false); }}>
        Admin Dashboard
      </button>
      <button onClick={() => { setActivePage("Admin Profile"); setAdminMenuOpen(false); }}>
        Admin Profile
      </button>
    </div>
  )}
</div>
        </header>

        {activePage === "Dashboard" && (
          <>
            <section className="stats">
              <div className="stat-card blue">
                <p>Total Students</p><h2>{students.length}</h2>
                <span>Registered students</span>
              </div>
              <div className="stat-card green">
                <p>Present Today</p><h2>{present}</h2>
                <span>Students present</span>
              </div>
              <div className="stat-card red">
                <p>Absent Today</p><h2>{absent}</h2>
                <span>Students absent</span>
              </div>
              <div className="stat-card purple">
                <p>Attendance Rate</p>
                <h2>{students.length ? Math.round(present / students.length * 100) : 0}%</h2>
                <span>Today's attendance</span>
              </div>
            </section>
            <h2>Welcome to AttendEase!</h2>
            <p style={{ marginTop: 12 }}>Use the sidebar to manage students and attendance.</p>
          </>
        )}

        {activePage === "Students" && (
          <section className="table-card">
            <div className="table-heading">
              <div>
                <h2>Registered Students</h2>
                <p>View all student records</p>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Student ID</th><th>Name</th><th>Course</th></tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.course}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activePage === "Attendance" && (
          <section className="table-card">
            <h2>Mark Student Attendance</h2>
            <p style={{ margin: "10px 0 20px" }}>Change each student's attendance status.</p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Student ID</th><th>Name</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>
                        <span className={student.status === "Present" ? "present" : "absent"}>
                          {student.status}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => toggleAttendance(student.id)}>
                          Mark {student.status === "Present" ? "Absent" : "Present"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activePage === "Reports" && (
          <section className="table-card">
            <h2>Attendance Report</h2>
            <p style={{ margin: "15px 0" }}>Total Students: {students.length}</p>
            <p style={{ margin: "15px 0" }}>Present: {present}</p>
            <p style={{ margin: "15px 0" }}>Absent: {absent}</p>
            <p style={{ margin: "15px 0" }}>Attendance Rate: {students.length ? Math.round(present / students.length * 100) : 0}%</p>
            <button onClick={() => window.print()}>Print Report</button>
          </section>
        )}

        {activePage === "Settings" && (
          <section className="table-card">
            <h2>Settings</h2>
            <p style={{ marginTop: 15 }}>Welcome, Admin!</p>
            <p style={{ marginTop: 10 }}>AttendEase Student Attendance Management System.</p>
          </section>
        )}

        <footer>© 2026 AttendEase | Student Attendance Management System</footer>
      </main>
    </div>
  );
}

export default App;


