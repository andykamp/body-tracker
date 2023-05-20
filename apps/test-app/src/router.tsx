import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import LoginForm from './login';
import Home from './app/home';
import Protected from './app/protected';
import { useAuthContext } from '@/auth-client/firebase/auth.context'

export type ProtectedRouteProps = {
  children: JSX.Element;
  user: any,
}

const ProtectedRoute = ({ children, user }: ProtectedRouteProps) => {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
};


function NoMatch() {
  return <div>NoMatch</div>;
}

function AppRouter() {
  const { user } = useAuthContext()

  return (
    <Router>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/console" element={<ProtectedRoute user={user}><Protected /></ProtectedRoute>} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;

