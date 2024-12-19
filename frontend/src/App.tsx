// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoleSelection from "./Pages/RoleSelection_Page/RoleSelection";
import SignIn from "./Pages/Signin_Page/SignIn";
import Register from "./Pages/Create_Account/Register";
import HomePage from "./Pages/HomePage/Homepage";
import BookTickets from "./Pages/BookTickets/BookTickets";
import FlightListPage from "./Pages/FlightListPage/FlightListPage";
import AccountPage from "./Pages/AccountPage/AccountPage";
import SeeSubUsersPage from "./Pages/AccountPage/subUsersPage";
import AddSubUsersPage from "./Pages/AccountPage/addSubUsers";
import SetPasswordPage from "./Pages/SetPasswordPage/SetPasswordPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/signin/:role" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/flightsListPage" element={<FlightListPage />} />
        <Route path="/book-tickets" element={<BookTickets />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/sub-users" element={<SeeSubUsersPage />} />
        <Route path="/add-sub-user" element={<AddSubUsersPage />} />
        <Route path="/set-password/:id" element={<SetPasswordPage />} />
      </Routes>
    </Router>
  );
};

export default App;
