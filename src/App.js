import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.rtl.min.css'; // RTL Bootstrap
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Branches from './components/Branches';
import EducationalStages from './components/EducationalStages';
import Teachers from './components/Teachers';
import Students from './components/Students';
import Attendance from './components/attendance';
import Parents from './components/Parents';

function App() {
  return (
    <Router>
      <div className="d-flex" dir="rtl">
        <Sidebar />
        <div className="flex-grow-1">
          <Header />
          <main className="p-4">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/branches" element={<Branches />} />
              <Route path="/stages" element={<EducationalStages />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/students" element={<Students />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/parents" element={<Parents />} />
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
