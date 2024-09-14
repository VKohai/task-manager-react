import { useCallback, useState } from "react";

const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (
        url,
        method = "GET",
        body = null,
        headers = { 'Content-Type': 'application/json' }
    ) => {
        setLoading(true);
        try {
            const response = await fetch(url, { method, body, headers });
            if (!response.ok) {
                throw new Error(`Couldn't fetch ${url}.\nStatus: ${response.status}`);
            }
            const result = await response.json();
            setLoading(false);
            return result;
        } catch (error) {
            setLoading(false);
            setError(error.message);
            throw error;
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return { request, clearError, loading, error };
}

export default useHttp;