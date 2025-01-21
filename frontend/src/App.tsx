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
import SubuserLoginPage from "./Pages/Signin_Page/subuserLogin";
import TicketDetailPage from "./Pages/TicketDetailPage/TicketDetailPage";
import SeatsMealsLuggage from "./Pages/SeatMealsLuggage/SeatsMealsLuggage";
import IncentivesPage from "./Pages/IncentivesPage/Incentives";
import Withdraw from "./Pages/WithdrawPage/WithdrawPage";

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
        <Route path="/subuser-login" element={<SubuserLoginPage />} />
        <Route path="/add-sub-user" element={<AddSubUsersPage />} />
        <Route path="/set-password/:id" element={<SetPasswordPage />} />
        <Route path="/ticket-detail" element={<TicketDetailPage />} />
        <Route path="/seats-meals-luggage" element={<SeatsMealsLuggage />} />
        <Route path="/incentives" element={<IncentivesPage />} />
        <Route path="/withdraw" element={<Withdraw />} />
      </Routes>
    </Router>
  );
};

export default App;
