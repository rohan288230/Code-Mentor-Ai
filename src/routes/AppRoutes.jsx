import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const DSAPracticePage = lazy(() => import('../pages/DSAPracticePage'));
const ResumeBuilderPage = lazy(() => import('../pages/ResumeBuilderPage'));
const ResumeTemplateSelector = lazy(() => import('../pages/ResumeTemplateSelector'));
const CoursesPage = lazy(() => import('../courses/CoursesPage'));
const CourseDetailsPage = lazy(() => import('../courses/components/CourseDetailsPage'));
const CourseViewerPage = lazy(() => import('../courses/components/CourseViewerPage'));
const AdminCoursesList = lazy(() => import('../pages/admin/AdminCoursesList'));
const AdminCourseEditor = lazy(() => import('../pages/admin/AdminCourseEditor'));

const InterviewDashboard = lazy(() => import('../pages/InterviewDashboard'));
const InterviewSubjectPage = lazy(() => import('../pages/InterviewSubjectPage'));

const ComputerNetworksPage = lazy(() => import('../interview/computer-networks/ComputerNetworksPage'));
const NetworkTopicViewer = lazy(() => import('../interview/computer-networks/NetworkTopicViewer'));
const MockInterview = lazy(() => import('../interview/computer-networks/MockInterview'));

const AdminNetworkDashboard = lazy(() => import('../pages/admin/AdminNetworkDashboard'));
const AdminNetworkTopicEditor = lazy(() => import('../pages/admin/AdminNetworkTopicEditor'));

const SystemDesignPage = lazy(() => import('../interview/system-design/SystemDesignPage'));
const SystemDesignTopicViewer = lazy(() => import('../interview/system-design/SystemDesignTopicViewer'));
const SystemDesignMockInterview = lazy(() => import('../interview/system-design/SystemDesignMockInterview'));

const AdminSystemDesignDashboard = lazy(() => import('../pages/admin/AdminSystemDesignDashboard'));
const AdminSystemDesignTopicEditor = lazy(() => import('../pages/admin/AdminSystemDesignTopicEditor'));

const DBMSPage = lazy(() => import('../interview/dbms/DBMSPage'));
const DBMSTopicViewer = lazy(() => import('../interview/dbms/DBMSTopicViewer'));
const DBMSMockInterview = lazy(() => import('../interview/dbms/DBMSMockInterview'));
const DBMSSqlPractice = lazy(() => import('../interview/dbms/DBMSSqlPractice'));

const AdminDBMSDashboard = lazy(() => import('../pages/admin/AdminDBMSDashboard'));
const AdminDBMSTopicEditor = lazy(() => import('../pages/admin/AdminDBMSTopicEditor'));

const OSPage = lazy(() => import('../interview/operating-system/OSPage'));
const OSTopicViewer = lazy(() => import('../interview/operating-system/OSTopicViewer'));
const OSMockInterview = lazy(() => import('../interview/operating-system/OSMockInterview'));

const AdminOSDashboard = lazy(() => import('../pages/admin/AdminOSDashboard'));
const AdminOSTopicEditor = lazy(() => import('../pages/admin/AdminOSTopicEditor'));

import ProtectedRoute from '../components/layout/ProtectedRoute';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      
      <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path={ROUTES.DSA} element={<ProtectedRoute><DSAPracticePage /></ProtectedRoute>} />
      <Route path={ROUTES.RESUME} element={<ProtectedRoute><ResumeTemplateSelector /></ProtectedRoute>} />
      <Route path={`${ROUTES.RESUME}/builder`} element={<ProtectedRoute><ResumeBuilderPage /></ProtectedRoute>} />
      <Route path={ROUTES.COURSES} element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
      <Route path={`${ROUTES.COURSES}/:courseId`} element={<ProtectedRoute><CourseDetailsPage /></ProtectedRoute>} />
      <Route path={`${ROUTES.COURSES}/:courseId/module/:moduleId`} element={<ProtectedRoute><CourseViewerPage /></ProtectedRoute>} />
      
      <Route path={`/admin/courses`} element={<ProtectedRoute><AdminCoursesList /></ProtectedRoute>} />
      <Route path={`/admin/courses/:courseId`} element={<ProtectedRoute><AdminCourseEditor /></ProtectedRoute>} />
      <Route path={`/admin/network`} element={<ProtectedRoute><AdminNetworkDashboard /></ProtectedRoute>} />
      <Route path={`/admin/network/topic/:topicId`} element={<ProtectedRoute><AdminNetworkTopicEditor /></ProtectedRoute>} />
      <Route path={`/admin/system-design`} element={<ProtectedRoute><AdminSystemDesignDashboard /></ProtectedRoute>} />
      <Route path={`/admin/system-design/topic/:id`} element={<ProtectedRoute><AdminSystemDesignTopicEditor /></ProtectedRoute>} />
      <Route path={`/admin/dbms`} element={<ProtectedRoute><AdminDBMSDashboard /></ProtectedRoute>} />
      <Route path={`/admin/dbms/topic/:id`} element={<ProtectedRoute><AdminDBMSTopicEditor /></ProtectedRoute>} />
      <Route path={`/admin/os`} element={<ProtectedRoute><AdminOSDashboard /></ProtectedRoute>} />
      <Route path={`/admin/os/topic/:id`} element={<ProtectedRoute><AdminOSTopicEditor /></ProtectedRoute>} />

      <Route path={ROUTES.INTERVIEW} element={<ProtectedRoute><InterviewDashboard /></ProtectedRoute>} />
      
      <Route path={`/interview/computer-networks`} element={<ProtectedRoute><ComputerNetworksPage /></ProtectedRoute>} />
      <Route path={`/interview/computer-networks/topic/:id`} element={<ProtectedRoute><NetworkTopicViewer /></ProtectedRoute>} />
      <Route path={`/interview/computer-networks/mock`} element={<ProtectedRoute><MockInterview /></ProtectedRoute>} />
      
      <Route path={`/interview/system-design`} element={<ProtectedRoute><SystemDesignPage /></ProtectedRoute>} />
      <Route path={`/interview/system-design/topic/:id`} element={<ProtectedRoute><SystemDesignTopicViewer /></ProtectedRoute>} />
      <Route path={`/interview/system-design/mock`} element={<ProtectedRoute><SystemDesignMockInterview /></ProtectedRoute>} />

      <Route path={`/interview/dbms`} element={<ProtectedRoute><DBMSPage /></ProtectedRoute>} />
      <Route path={`/interview/dbms/topic/:id`} element={<ProtectedRoute><DBMSTopicViewer /></ProtectedRoute>} />
      <Route path={`/interview/dbms/mock`} element={<ProtectedRoute><DBMSMockInterview /></ProtectedRoute>} />
      <Route path={`/interview/dbms/sql`} element={<ProtectedRoute><DBMSSqlPractice /></ProtectedRoute>} />

      <Route path={`/interview/os`} element={<ProtectedRoute><OSPage /></ProtectedRoute>} />
      <Route path={`/interview/os/topic/:id`} element={<ProtectedRoute><OSTopicViewer /></ProtectedRoute>} />
      <Route path={`/interview/os/mock`} element={<ProtectedRoute><OSMockInterview /></ProtectedRoute>} />
      
      <Route path={`${ROUTES.INTERVIEW}/:slug`} element={<ProtectedRoute><InterviewSubjectPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}
