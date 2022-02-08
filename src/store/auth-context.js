import React, { createContext, useState, useEffect, useCallback } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

let logoutTimer;

const AuthContext = createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {}
})

function calculateRemainingTime (expirationTime) {
    const currTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();
    const remainingTime = adjExpirationTime - currTime;
    return remainingTime;
}

function retriveStoredToken () {
    const storedToken = JSON.parse(localStorage.getItem('DUMMY_LOGIN-token'));
    const storedExpirationDate = JSON.parse(localStorage.getItem('DUMMY_LOGIN-exp'));

    const remainingTime = calculateRemainingTime(storedExpirationDate)

    if (remainingTime < 3600) {
        localStorage.removeItem('DUMMY_LOGIN-token');
        localStorage.removeItem('DUMMY_LOGIN-exp')
        return null;
    } 

    return {
        token: storedToken,
        duration: remainingTime
    }
}

export function AuthContextProvider ({ children }) {
    let initalTokenValue;
    const tokenData = retriveStoredToken();
    if (tokenData) initalTokenValue = tokenData.token
    const [token, setToken] = useState(initalTokenValue)
    const isLoggedIn = !!token // converts string to bool

    const logoutHandler = useCallback( () => {
        setToken('')
        localStorage.removeItem('DUMMY_LOGIN-token')
        localStorage.removeItem('DUMMY_LOGIN-exp')
        if (logoutTimer) clearTimeout(logoutTimer);
    }, [])

    function loginHandler (token, expirationTime) {
        setToken(token)
        localStorage.setItem('DUMMY_LOGIN-token', JSON.stringify(token));
        localStorage.setItem('DUMMY_LOGIN-exp', JSON.stringify(expirationTime))
        const remainingTime = calculateRemainingTime(expirationTime);
        logoutTimer = setTimeout(loginHandler, remainingTime)
    }

    useEffect(() => {
        if (tokenData) {
            logoutTimer = setTimeout(logoutHandler, tokenData.duration)
        }
    }, [tokenData, logoutHandler])

    const contextValue = {
        token,
        isLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    }

    return (
        <AuthContext.Provider value={contextValue}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthContext