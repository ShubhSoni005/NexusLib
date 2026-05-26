import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './Context/ThemeContext';
import { AuthProvider } from './Context/AuthContext';
import Navbar from './Components/Navbar/Navbar';
import Loader from './Components/Loader/Loader';


const HomePage = lazy(() => import('./Pages/HomePage/HomePage'));
const BranchPage = lazy(() => import('./Pages/BranchPage/BranchPage'));
const SemesterPage = lazy(() => import('./Pages/SemesterPage/SemesterPage'));
const SubjectPage = lazy(() => import('./Pages/SubjectPage/SubjectPage'));
const StudyGuidePage = lazy(() => import('./Pages/StudyGuidePage/StudyGuidePage'));
const UploadPage = lazy(() => import('./Pages/UploadPage/UploadPage'));

const LoginPage = lazy(() => import('./Pages/AuthPages/AuthPages').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('./Pages/AuthPages/AuthPages').then(m => ({ default: m.SignupPage })));
const NotFoundPage = lazy(() => import('./Pages/NotFoundPage/NotFoundPage'));

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/"                                                    element={<HomePage />} />
              <Route path="/branch/:branch"                                      element={<BranchPage />} />
              <Route path="/branch/:branch/semester/:sem"                        element={<SemesterPage />} />
              <Route path="/branch/:branch/semester/:sem/subject/:subject"       element={<SubjectPage />} />
              <Route path="/study-guide"                                         element={<StudyGuidePage />} />
              <Route path="/upload"                                              element={<UploadPage />} />
              <Route path="/login"                                               element={<LoginPage />} />
              <Route path="/signup"                                              element={<SignupPage />} />
              <Route path="*"                                                    element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

