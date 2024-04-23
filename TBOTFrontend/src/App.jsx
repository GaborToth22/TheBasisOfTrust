import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Row, Col  } from 'react-bootstrap';
import { useState } from 'react';
import LoginPage from './Pages/LoginPage';
import DashboardPage from './Pages/DashboardPage';
import YourAccountPage from './Pages/YourAccountPage';
import AllExpensesPage from './Pages/AllExpensesPage';

function App() {
  const [loggedUser, setLoggedUser] = useState(undefined);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage {...{ loggedUser, setLoggedUser}} />} />
        <Route path="/login" element={<LoginPage {...{ loggedUser, setLoggedUser}} />} />
        <Route path="/allExpenses" element={<AllExpensesPage {...{ loggedUser, setLoggedUser}} />} />
        <Route path="/yourAccount" element={<YourAccountPage {...{ loggedUser, setLoggedUser}} />} />
      </Routes>
    </Router>
  );
}

export default App;
