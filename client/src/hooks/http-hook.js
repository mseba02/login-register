// imports
import { useState, useCallback } from 'react';

// export hook
export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);

    // create callback sendrequest
    const sendRequest = useCallback(
        async (url, method = 'GET', headers = {}, body = null,) => {

            // loader true
            setIsLoading(true);

            try {
                const response = await fetch(url, {
                    method,
                    body,
                    headers,
                });

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message);
                }

                // remove loader
                setIsLoading(false);
                return responseData;
            } catch (err) {
                setIsLoading(false);
                throw err;
            }
        },
        []
    );

    // return functions
    return { isLoading, sendRequest };
};

