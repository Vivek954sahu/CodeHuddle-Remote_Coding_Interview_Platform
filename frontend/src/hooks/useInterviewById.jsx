import { useEffect, useState } from "react"
import { interviewById } from "../api/interviewsApi";


const useInterviewById = (id) => {

    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchInterview = async () => {
        try {
            setLoading(true);

            const res = await interviewById(id);
            setInterview(res.data.data);

        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch interview!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInterview();

        const interval = setInterval(fetchInterview, 5000);

        return () => clearInterval(interval);
    }, [id]);

    return {interview, loading, error, refetch: fetchInterview};
}

export default useInterviewById
