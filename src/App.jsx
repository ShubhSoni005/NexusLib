import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BranchPage from './pages/BranchPage';
import SemesterPage from './pages/SemesterPage';
import SubjectPage from './pages/SubjectPage';
import StudyGuide from './pages/StudyGuide';
import UploadPage from './pages/UploadPage';
import { LoginPage, SignupPage } from './pages/AuthPages';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/branch/:branch" element={<BranchPage />} />
          <Route path="/branch/:branch/semester/:sem" element={<SemesterPage />} />
          <Route path="/branch/:branch/semester/:sem/subject/:subject" element={<SubjectPage />} />
          <Route path="/study-guide" element={<StudyGuide />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
