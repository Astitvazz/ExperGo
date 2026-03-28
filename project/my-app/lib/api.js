import axios from "axios";

import { getToken } from "@/lib/auth";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_BASE
});

export function authHeaders(token = getToken()) {
  return token
    ? {
        Authorization: `Bearer ${token}`
      }
    : {};
}

export function getErrorMessage(error, fallback = "Something went wrong.") {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    fallback
  );
}
