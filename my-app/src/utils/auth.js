// Authentication utility functions
const AUTH_KEY = 'isAuthenticated';
const AUTH_USER_KEY = 'authUserId';
const AUTH_NAME_KEY = 'authUserName';
const AUTH_ROLES_KEY = 'authRoles';
const API_URL = import.meta.env.VITE_API_URL;

const findMemberByUserId = async (userId) => {
  const response = await fetch(`${API_URL}/by-member-id/${encodeURIComponent(userId)}`);
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Unable to validate user ID right now');
  }

  return response.json();
};

export const login = async (userId, password) => {
  const HARD_CODED_PASSWORD = 'Airtel@1234';
  const normalizedUserId = userId?.trim();

  if (!normalizedUserId) {
    return { success: false, error: 'User ID is required' };
  }

  if (password !== HARD_CODED_PASSWORD) {
    return { success: false, error: 'Invalid credentials' };
  }

  try {
    const member = await findMemberByUserId(normalizedUserId);
    if (!member) {
      return { success: false, error: 'User ID does not exist' };
    }

    if (!member.status) {
      return { success: false, error: 'User is disabled. Please contact admin' };
    }

    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(AUTH_USER_KEY, member.memberId);
    localStorage.setItem(AUTH_NAME_KEY, member.name || member.memberId);
    const memberRoles = Array.isArray(member.roles) && member.roles.length > 0
      ? member.roles
      : ['AUDITOR'];
    localStorage.setItem(AUTH_ROLES_KEY, JSON.stringify(memberRoles));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || 'Login failed' };
  }
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_NAME_KEY);
  localStorage.removeItem(AUTH_ROLES_KEY);
};

export const isAuthenticated = () => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};

export const getCurrentUserRoles = () => {
  const rawRoles = localStorage.getItem(AUTH_ROLES_KEY);
  if (!rawRoles) return ['AUDITOR'];

  try {
    const parsedRoles = JSON.parse(rawRoles);
    if (!Array.isArray(parsedRoles) || parsedRoles.length === 0) {
      return ['AUDITOR'];
    }
    return parsedRoles;
  } catch {
    return ['AUDITOR'];
  }
};

export const getCurrentUserProfile = () => {
  const memberId = localStorage.getItem(AUTH_USER_KEY) || '';
  const name = localStorage.getItem(AUTH_NAME_KEY) || memberId;
  const roles = getCurrentUserRoles();

  return {
    name,
    memberId,
    roles,
  };
};
