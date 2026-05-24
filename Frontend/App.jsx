import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './Context/ThemeContext';
import Navbar from './Components/Navbar/Navbar';
import HomePage from './Pages/HomePage/HomePage';
import BranchPage from './Pages/BranchPage/BranchPage';
import SemesterPage from './Pages/SemesterPage/SemesterPage';
import SubjectPage from './Pages/SubjectPage/SubjectPage';
import StudyGuidePage from './Pages/StudyGuidePage/StudyGuidePage';
import UploadPage from './Pages/UploadPage/UploadPage';
import { LoginPage, SignupPage } from './Pages/AuthPages/AuthPages';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"                                                    element={<HomePage />} />
          <Route path="/branch/:branch"                                      element={<BranchPage />} />
          <Route path="/branch/:branch/semester/:sem"                        element={<SemesterPage />} />
          <Route path="/branch/:branch/semester/:sem/subject/:subject"       element={<SubjectPage />} />
          <Route path="/study-guide"                                         element={<StudyGuidePage />} />
          <Route path="/upload"                                              element={<UploadPage />} />
          <Route path="/login"                                               element={<LoginPage />} />
          <Route path="/signup"                                              element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
