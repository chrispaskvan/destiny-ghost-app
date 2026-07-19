const { MODE, VITE_API_BASE_URL_PROD, VITE_API_BASE_URL_DEV } = import.meta.env;

export const API_CONFIG = {
  BASE_URL: MODE === 'production'
    ? (VITE_API_BASE_URL_PROD || 'https://api.destiny-ghost.com')
    : (VITE_API_BASE_URL_DEV || 'https://api2.destiny-ghost.com'),
};

export const API_ENDPOINTS = {
  AUTH: {
    BUNGIE_SIGNIN: '/users/signin/bungie',
    CURRENT_USER: '/users/current',
  },
  DESTINY: {
    SIGNIN_URL: '/destiny/signIn',
  },
  HEALTH: '/health',
  USER: {
    SIGNOUT: '/users/signout',
    SIGNUP: '/users/signUp',
    JOIN: '/users/join',
    UPDATE: '/users',
  },
};
