// return the user data from the session storage
export const getUser = () => {
  const userStr = sessionStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  else return null;
}

// return the token from the session storage
export const getToken = () => {
  return sessionStorage.getItem('token') || null;
}

// remove the token and user from the session storage
export const removeUserSession = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
}

// set the token and user from the session storage
export const setUserSession = (token, user) => {
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('user', JSON.stringify(user));
}

// remove the poll_id in the session storage
export const removePoll = () => {
  sessionStorage.removeItem('poll_id');
}

// set the poll_id in the session storage
export const setPoll = (pollId) => {
  sessionStorage.setItem('pollId', pollId);
}


// return the poll_id the session storage
export const getPollId = () => {
  return sessionStorage.getItem('pollId');
}