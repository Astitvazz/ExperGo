import { jwtDecode } from "jwt-decode";

export const TOKEN_KEY = "token";

export function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearToken() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

export function getDecodedToken(token = getToken()) {
  if (!token) {
    return null;
  }

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}
