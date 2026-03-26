import { useState } from "react";
import { endInterview } from "../api/interviewsApi";

export const useEndInterview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const endSession = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const res = await endInterview(id);

      return res.data;

    } catch (err) {
      const message = err.response?.data?.message || "Failed to end session";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { endSession, loading, error };
};