// Example login call (React):
const login = async (email, password) => {
  const res = await fetch('/api/login', { method: 'POST', body: JSON.stringify({email, password}), headers: {'Content-Type': 'application/json'} });
  const data = await res.json();
  localStorage.setItem('token', data.token); // use this token for protected requests
};
