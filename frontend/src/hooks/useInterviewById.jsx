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
            setInterview(res.data.data.interview);

        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch interview!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInterview();

        // Only poll if interview is active
        // let interval;
        // if (interview?.status === 'SCHEDULED' || interview?.status === 'IN_PROGRESS') {
        //     interval = setInterval(fetchInterview, 30000); 
        // }

        // return () => {
        //     if (interval) clearInterval(interval);
        // };
    }, [id, interview?.status]);

    return {interview, loading, error, refetch: fetchInterview};
}

export default useInterviewById
