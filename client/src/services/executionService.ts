import axios from "axios";

const API_URL =
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api") +
  "/execute";

export const executeCode = async (language: string, content: string) => {
  const response = await axios.post(API_URL, {
    language,
    content,
  });
  return response.data;
};
