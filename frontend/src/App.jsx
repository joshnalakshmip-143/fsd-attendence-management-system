
import { useEffect, useState } from "react";
import "./App.css";

const initialStudents = [
  { id: "STU001", name: "Rahul Kumar", course: "Computer Science", status: "Present" },
  { id: "STU002", name: "Priya Sharma", course: "Information Technology", status: "Present" },
  { id: "STU003", name: "Arjun Reddy", course: "Computer Science", status: "Absent" },
  { id: "STU004", name: "Sneha Patel", course: "Electronics", status: "Present" },
  { id: "STU005", name: "Kiran Kumar", course: "Mechanical", status: "Absent" },
  { id: "STU006", name: "Ananya Rao", course: "Computer Science", status: "Present" },
  { id: "STU007", name: "Vikram Singh", course: "Information Technology", status: "Present" },
  { id: "STU008", name: "Meera Nair", course: "Electronics", status: "Absent" }
];

const navigation = [
  { name: "Dashboard", icon: "▦" },
  { name: "Students", icon: "♙" },
  { name: "Attendance", icon: "✓" },
  { name: "Reports", icon: "▤" },
  { name: "Settings", icon: "⚙" }
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem("attendease_students");
      return saved ? JSON.parse(saved) : initialStudents;
    } catch {
      return initialStudents;
    }
  });

  useEffect(() => {
    localStorage.setItem("attendease_students", JSON.stringify(students));
  }, [students]);

  const present = students.filter(s => s.status === "Present").length;
  const absent = students.length - present;
  const percentage = students.length
    ? Math.round((present / students.length) * 100)
    : 0;

  const filteredStudents = students.filter(student =>
    `${student.name} ${student.id} ${student.course}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function toggleAttendance(id) {
    setStudents(previous =>
      previous.map(student =>
        student.id === id
          ? {
              ...student,
              status: student.status === "Present" ? "Absent" : "Present"
            }
          : student
      )
    );
  }

  function changePage(page) {
    setActivePage(page);
    setSearch("");
    setAdminMenuOpen(false);
  }

  function exportReport() {
    const rows = [
      ["Student ID", "Student Name", "Course", "Attendance Status"],
      ...students.map(s => [s.id, s.name, s.course, s.status])
    ];

    const csv = rows
      .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "attendEase-attendance-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  const activity = students.slice(0, 5);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">A</div>
          <h2>Attend<span>Ease</span></h2>
        </div>

        <p className="menu-title">MAIN MENU</p>

        <nav className="navigation">
          {navigation.map(item => (
            <button
              key={item.name}
              className={`nav-item ${activePage === item.name ? "active" : ""}`}
              onClick={() => changePage(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
              {activePage === item.name && <span className="nav-indicator" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-help">
          <div className="help-icon">?</div>
          <strong>Need help?</strong>
          <p>Manage your attendance system easily.</p>
          <button onClick={() => changePage("Settings")}>View settings</button>
        </div>

        <div className="sidebar-bottom">
          <div className="online-dot" />
          System Online
          <span>v2.0</span>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div className="breadcrumb">Pages / {activePage}</div>
            <h1>{activePage}</h1>
            <p className="welcome-text">
              Welcome back! Here's what's happening with your institution.
            </p>
          </div>

          <div className="header-actions">
            <div className="date-display">
              <span>▦</span>
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}
            </div>

            <div className="admin-area">
              <button
                className="profile"
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
              >
                <span className="avatar">A</span>
                <span className="profile-details">
                  <strong>Administrator</strong>
                  <small>Admin Account</small>
                </span>
                ▾
              </button>

              {adminMenuOpen && (
                <div className="admin-dropdown">
                  <button onClick={() => changePage("Settings")}>Admin Profile</button>
                  <button onClick={() => changePage("Settings")}>Settings</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {activePage === "Dashboard" && (
          <>
            <section className="dashboard-heading">
              <div>
                <h2>Dashboard Overview</h2>
                <p>Monitor student attendance and institution performance.</p>
              </div>
              <button className="primary-button" onClick={() => changePage("Attendance")}>
                + Mark Attendance
              </button>
            </section>

            <section className="stats">
              <div className="stat-card">
                <div className="stat-top">
                  <span>Total Students</span>
                  <span className="stat-icon blue-icon">♙</span>
                </div>
                <h2>{students.length}</h2>
                <p className="stat-note">Registered students</p>
                <div className="stat-line blue-line" />
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>Present Today</span>
                  <span className="stat-icon green-icon">✓</span>
                </div>
                <h2>{present}</h2>
                <p className="stat-note">Students present today</p>
                <div className="stat-line green-line" />
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>Absent Today</span>
                  <span className="stat-icon red-icon">×</span>
                </div>
                <h2>{absent}</h2>
                <p className="stat-note">Students absent today</p>
                <div className="stat-line red-line" />
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>Attendance Rate</span>
                  <span className="stat-icon purple-icon">%</span>
                </div>
                <h2>{percentage}%</h2>
                <p className="stat-note">Today's attendance rate</p>
                <div className="stat-line purple-line" />
              </div>
            </section>

            <section className="dashboard-grid">
              <div className="panel attendance-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Today's Attendance</h2>
                    <p>Current student attendance distribution</p>
                  </div>
                  <span className="live-label">
                    <span /> LIVE
                  </span>
                </div>

                <div className="attendance-visual">
                  <div
                    className="donut"
                    style={{
                      background: `conic-gradient(#16a779 ${percentage}%, #f16b72 0)`
                    }}
                  >
                    <div className="donut-inner">
                      <strong>{percentage}%</strong>
                      <span>Attendance</span>
                    </div>
                  </div>

                  <div className="chart-legend">
                    <div>
                      <span className="legend-dot present-dot" />
                      <span>Present</span>
                      <strong>{present}</strong>
                    </div>
                    <div>
                      <span className="legend-dot absent-dot" />
                      <span>Absent</span>
                      <strong>{absent}</strong>
                    </div>
                    <div>
                      <span className="legend-dot total-dot" />
                      <span>Total</span>
                      <strong>{students.length}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel activity-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Recent Student Activity</h2>
                    <p>Current attendance status</p>
                  </div>
                  <button className="text-button" onClick={() => changePage("Attendance")}>
                    View all
                  </button>
                </div>

                <div className="activity-list">
                  {activity.map((student, index) => (
                    <div className="activity-item" key={student.id}>
                      <div className={`student-avatar avatar-${index % 5}`}>
                        {student.name.charAt(0)}
                      </div>
                      <div className="activity-info">
                        <strong>{student.name}</strong>
                        <small>{student.id}</small>
                      </div>
                      <span className={`status-badge ${student.status.toLowerCase()}`}>
                        {student.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="panel quick-panel">
              <div className="panel-heading">
                <div>
                  <h2>Quick Actions</h2>
                  <p>Access frequently used features</p>
                </div>
              </div>
              <div className="quick-actions">
                <button onClick={() => changePage("Students")}>
                  <span className="quick-icon blue-icon">♙</span>
                  <strong>Manage Students</strong>
                  <small>View student records</small>
                </button>
                <button onClick={() => changePage("Attendance")}>
                  <span className="quick-icon green-icon">✓</span>
                  <strong>Mark Attendance</strong>
                  <small>Update attendance</small>
                </button>
                <button onClick={() => changePage("Reports")}>
                  <span className="quick-icon purple-icon">▤</span>
                  <strong>View Reports</strong>
                  <small>Attendance summaries</small>
                </button>
              </div>
            </section>
          </>
        )}

        {activePage === "Students" && (
          <section className="panel page-panel">
            <div className="panel-heading">
              <div>
                <h2>Registered Students</h2>
                <p>View and search all student records.</p>
              </div>
              <span className="count-label">{students.length} Students</span>
            </div>

            <div className="search-row">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by student name, ID or course..."
              />
            </div>

            <StudentTable students={filteredStudents} showStatus={true} />
          </section>
        )}

        {activePage === "Attendance" && (
          <section className="panel page-panel">
            <div className="panel-heading">
              <div>
                <h2>Manage Attendance</h2>
                <p>Mark students present or absent.</p>
              </div>
              <span className="count-label">{percentage}% Present</span>
            </div>

            <div className="search-row">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search students..."
              />
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Course</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td><strong>{student.name}</strong></td>
                      <td>{student.course}</td>
                      <td>
                        <span className={`status-badge ${student.status.toLowerCase()}`}>
                          {student.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="small-action"
                          onClick={() => toggleAttendance(student.id)}
                        >
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
          <section className="panel page-panel">
            <div className="panel-heading">
              <div>
                <h2>Attendance Reports</h2>
                <p>Summary of the current attendance records.</p>
              </div>
              <button className="primary-button" onClick={exportReport}>
                ↓ Export CSV
              </button>
            </div>

            <div className="report-summary">
              <div><span>Total Students</span><strong>{students.length}</strong></div>
              <div><span>Present</span><strong className="report-green">{present}</strong></div>
              <div><span>Absent</span><strong className="report-red">{absent}</strong></div>
              <div><span>Attendance Rate</span><strong>{percentage}%</strong></div>
            </div>

            <h3 className="report-subtitle">Student Attendance Details</h3>
            <StudentTable students={students} showStatus={true} />
          </section>
        )}

        {activePage === "Settings" && (
          <section className="panel page-panel">
            <h2>Admin Settings</h2>
            <p className="settings-description">
              Welcome to AttendEase administration.
            </p>
            <div className="settings-card">
              <span className="avatar">A</span>
              <div>
                <strong>Administrator</strong>
                <p>System administrator</p>
              </div>
            </div>
            <p className="settings-description">
              Your attendance records are currently saved in this browser.
              Backend database integration will be added in a later upgrade.
            </p>
          </section>
        )}

        <footer>
          © 2026 AttendEase. Student Attendance Management System.
        </footer>
      </main>
    </div>
  );
}

function StudentTable({ students, showStatus }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Course</th>
            {showStatus && <th>Attendance</th>}
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td><strong>{student.name}</strong></td>
              <td>{student.course}</td>
              {showStatus && (
                <td>
                  <span className={`status-badge ${student.status.toLowerCase()}`}>
                    {student.status}
                  </span>
                </td>
              )}
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan={showStatus ? 4 : 3} className="empty-message">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
