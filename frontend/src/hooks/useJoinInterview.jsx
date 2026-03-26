import { useState } from "react";
import { joinInterview } from "../api/interviewsApi";

export const useJoinInterview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const joinSession = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const res = await joinInterview(id);

      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to join session";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { joinSession, loading, error };
};
