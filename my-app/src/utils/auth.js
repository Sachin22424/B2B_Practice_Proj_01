// Authentication utility functions
const AUTH_KEY = 'isAuthenticated';

export const login = (userId, password) => {
  const VALID_USER_ID = 'B0336873';
  const VALID_PASSWORD = '12345678';

  if (userId === VALID_USER_ID && password === VALID_PASSWORD) {
    localStorage.setItem(AUTH_KEY, 'true');
    return { success: true };
  }
  
  return { success: false, error: 'Invalid credentials' };
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const isAuthenticated = () => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};
