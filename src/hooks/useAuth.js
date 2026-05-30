import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

/**
 * Typed-style access to auth context (single import site for consumers).
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
