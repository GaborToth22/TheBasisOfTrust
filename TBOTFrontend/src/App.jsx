import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Row, Col  } from 'react-bootstrap';
import { useState } from 'react';
import LoginPage from './Pages/LoginPage';
import DashboardPage from './Pages/DashboardPage';
import YourAccountPage from './Pages/YourAccountPage';
import AllExpensesPage from './Pages/AllExpensesPage';
import { LoggedUserProvider } from './Services/LoggedUserProvider';

function App() {
  return (
    <LoggedUserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage/>} />
          <Route path="/dashboard" element={<DashboardPage/>} />
          <Route path="/allExpenses" element={<AllExpensesPage/>} />
          <Route path="/yourAccount" element={<YourAccountPage/>} />
        </Routes>
      </Router>
    </LoggedUserProvider>
  );
}

export default App;
