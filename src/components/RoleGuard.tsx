import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RoleGuardProps {
  allow: Array<'client' | 'freelancer' | 'student'>;
  children: React.ReactNode;
  /** Where to redirect when role doesn't match. Defaults to '/' */
  redirectTo?: string;
}

/**
 * Wraps a route so only users whose role is in `allow` can access it.
 * - If the user is not logged in → redirect to the sign-up/join page.
 * - If the user's role isn't in `allow` → redirect to the root (or a custom path).
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ allow, children, redirectTo = '/' }) => {
  const { currentUser } = useAuth();

  // Not authenticated at all
  if (!currentUser) {
    return <Navigate to="/join" replace />;
  }

  // Wrong role
  if (!allow.includes(currentUser.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
