// npm packages import
import { Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { UserContext } from '../context/userContext';
import { useContext } from 'react';
import { Navigate } from "react-router-dom";

// pages import
import Authentication from './Pages/Authentication';
import Home from "./Pages/Home";
import FirstRound from "./Pages/firstRound";
import TechnicalPracticeSimulation from "./Pages/secondRound";
import CandidateProfile from './Pages/candidateProfile';
import ApplicantResult from './Pages/applicantResult';
import PrivateRoute from '../PrivateRoute/privateRoute';

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <Toaster position='top-center' toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={user !== null ? <Navigate to="/home" /> : <Authentication />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/firstRound" element={<PrivateRoute element={<FirstRound />} />} />
        <Route path="/secondRound" element={<PrivateRoute element={<TechnicalPracticeSimulation />} />} />
        <Route path="/applicantResult" element={<PrivateRoute element={<ApplicantResult />} />} />
        <Route path="/profile" element={<PrivateRoute element={<CandidateProfile />} />} />
      </Routes>

    </>
  );
};

export default App;