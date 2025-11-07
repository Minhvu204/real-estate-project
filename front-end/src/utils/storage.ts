export const TOKEN_KEY = "auth_token";
export const USER_KEY = "auth_user";

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function saveUser(user: any) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): any | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
}

export function clearAuth() {
  clearToken();
  clearUser();
}
export type Lang = "en" | "vi";
export function getLanguage(): Lang {
  const lang = localStorage.getItem("i18nextLng") || "en";
  if (lang.startsWith("vi")) return "vi";
  return "en";
}
