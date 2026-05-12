const AUTH_KEY = "prelegal_auth";

export function login(username: string, password: string): boolean {
  if (!username.trim() || !password.trim()) return false;
  localStorage.setItem(AUTH_KEY, JSON.stringify({ username }));
  return true;
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_KEY) !== null;
}

export function getUser(): { username: string } | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
}
