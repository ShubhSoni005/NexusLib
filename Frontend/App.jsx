import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './Context/ThemeContext';
import { AuthProvider } from './Context/AuthContext';
import Navbar from './Components/Navbar/Navbar';
import Loader from './Components/Loader/Loader';
import EasterEggs from './Components/EasterEggs/EasterEggs';

const HomePage = lazy(() => import('./Pages/HomePage/HomePage'));
const BranchPage = lazy(() => import('./Pages/BranchPage/BranchPage'));
const SemesterPage = lazy(() => import('./Pages/SemesterPage/SemesterPage'));
const SubjectPage = lazy(() => import('./Pages/SubjectPage/SubjectPage'));
const StudyGuidePage = lazy(() => import('./Pages/StudyGuidePage/StudyGuidePage'));
const UploadPage = lazy(() => import('./Pages/UploadPage/UploadPage'));

const LoginPage = lazy(() => import('./Pages/AuthPages/AuthPages').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('./Pages/AuthPages/AuthPages').then(m => ({ default: m.SignupPage })));
const NotFoundPage = lazy(() => import('./Pages/NotFoundPage/NotFoundPage'));

// Auto Scroll To Top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  const { setLastPath } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (setLastPath) {
      setLastPath(pathname);
    }
  }, [pathname, setLastPath]);

  return null;
}

// Auto SEO Page Title Updater
function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    let title = "NexusLib : GTU Engineering Resources";

    if (segments[0] === 'branch' && segments[1]) {
      const branchName = segments[1].toUpperCase();
      title = `${branchName} Department - NexusLib`;
      if (segments[2] === 'semester' && segments[3]) {
        title = `${branchName} Semester ${segments[3]} - NexusLib`;
        if (segments[4] === 'subject' && segments[5]) {
          title = `${decodeURIComponent(segments[5])} (${branchName}) - NexusLib`;
        }
      }
    } else if (segments[0] === 'study-guide') {
      title = "AI Study Guide & Chatbot - NexusLib";
    } else if (segments[0] === 'upload') {
      title = "Contribute Study Materials - NexusLib";
    } else if (segments[0] === 'login') {
      title = "Sign In - NexusLib";
    } else if (segments[0] === 'signup') {
      title = "Join Free - NexusLib";
    }

    document.title = title;
  }, [pathname]);

  return null;
}

// Key-based transition wrapper to re-trigger route entry animations
function RouteWrapper({ children }) {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="route-transition-container animate-fade-in">
      {children}
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  return (
    <div className={isAuthPage ? "app-layout" : "app-layout app-layout--has-sidebar"}>
      <ScrollToTop />
      <PageMeta />
      <Navbar />
      <EasterEggs />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/"                                                    element={<RouteWrapper><HomePage /></RouteWrapper>} />
          <Route path="/branch/:branch"                                      element={<RouteWrapper><BranchPage /></RouteWrapper>} />
          <Route path="/branch/:branch/semester/:sem"                        element={<RouteWrapper><SemesterPage /></RouteWrapper>} />
          <Route path="/branch/:branch/semester/:sem/subject/:subject"       element={<RouteWrapper><SubjectPage /></RouteWrapper>} />
          <Route path="/study-guide"                                         element={<RouteWrapper><StudyGuidePage /></RouteWrapper>} />
          <Route path="/upload"                                              element={<RouteWrapper><UploadPage /></RouteWrapper>} />
          <Route path="/login"                                               element={<RouteWrapper><LoginPage /></RouteWrapper>} />
          <Route path="/signup"                                              element={<RouteWrapper><SignupPage /></RouteWrapper>} />
          <Route path="*"                                                    element={<RouteWrapper><NotFoundPage /></RouteWrapper>} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
