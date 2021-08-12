// imports
import { useState, useCallback, useEffect } from 'react';

// auth hook
export const useAuth = () => {

    // states
    const [token, setToken] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(false);

    // login
    const login = useCallback((uid, token, expirationDate) => {

        // set token and user id
        setToken(token);
        setUserId(uid);

        // expiration token
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpirationDate);

        // store token in localstorage
        localStorage.setItem(
            'userData',
            JSON.stringify({
                userId: uid,
                token: token,
                expiration: tokenExpirationDate.toISOString()
            })
        );
    }, []);

    // logout
    const logout = useCallback(() => {

        // clear items and remove token from localstorage
        setToken(null);
        setTokenExpirationDate(null);
        setUserId(null);
        localStorage.removeItem('userData');
    }, []);


    // auto logout trigger on token, logout, expire date
    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
            setTimeout(logout, remainingTime);
        } else {
            clearTimeout();
        }
    }, [token, logout, tokenExpirationDate]);


    // auto login
    useEffect(() => {
        // get item from localstorage
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (
            storedData &&
            storedData.token &&
            new Date(storedData.expiration) > new Date()
        ) {
            login(storedData.userId, storedData.token, new Date(storedData.expiration));
        }
    }, [login]);

    // return functions
    return { token, login, logout, userId };
};