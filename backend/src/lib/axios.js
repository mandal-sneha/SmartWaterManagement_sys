import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.ENVIRONMENT === "production";

export const flaskEmbeddingService = axios.create({
  baseURL: isProduction
    ? "https://hydraone-flask-backend.onrender.com"
    : "http://127.0.0.1:5001",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export const flaskCameraService = axios.create({
  baseURL: isProduction
    ? "https://hydraone-cam-backend.onrender.com"
    : "http://127.0.0.1:5002",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});