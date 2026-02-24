// Authentication utility functions
const AUTH_KEY = 'isAuthenticated';
const AUTH_USER_KEY = 'authUserId';
const API_URL = import.meta.env.VITE_API_URL;

const findMemberByUserId = async (userId) => {
  const params = new URLSearchParams({
    page: '0',
    size: '20',
    search: userId,
  });

  const response = await fetch(`${API_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Unable to validate user ID right now');
  }

  const data = await response.json();
  return (data.content || []).find(
    (member) => member.memberId?.toLowerCase() === userId.toLowerCase()
  );
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

    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(AUTH_USER_KEY, member.memberId);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || 'Login failed' };
  }
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

export const isAuthenticated = () => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};
