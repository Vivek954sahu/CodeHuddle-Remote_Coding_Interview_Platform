import { useEffect, useState } from "react";
import { getUpcomingInterviews } from "../api/interviewsApi";

export const useUpcomingInterviews = () => {

    const [upcomingInterviews, setUpcomingInterviews] = useState([]);
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(false);
    const [error,  setError] = useState(null);

    const [hasMore, setHasMore] = useState(false);

    const limit = 8;

    // Fetch upcoming interviews vis Api call
    const fetchUpcomingInterviews = async () => {
        try {
            setLoading(true);

            const res = await getUpcomingInterviews({ page, limit });

            const data = res.data.data;

            setUpcomingInterviews(data.result);
            setHasMore(data.hasMore);

        } catch (error) {

            setError(error.response?.data?.message || "Failed to fetch interviews.");

        } finally {

            setLoading(false);

        }
    };

    // Fetch interviews
    useEffect(() => {
      
        fetchUpcomingInterviews();

    }, []);

    // update the page for more interviews
    const loadMore = () => {
        if (hasMore) {
            setPage(prev => prev + 1);
        }
    };

    return {
        upcomingInterviews,
        loading,
        error,
        hasMore,
        loadMore
    };
    
};