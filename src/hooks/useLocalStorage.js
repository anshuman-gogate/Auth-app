import { useEffect, useState } from 'react';

const PREFIX = 'DUMMY_LOGIN'

function useLocalStorage(key, initialValue) {
    const prefixedKey = PREFIX + key;
    const [value, setValue] = useState(() => {
        const jsonValue = localStorage.getItem(prefixedKey);
        if (jsonValue != null) return JSON.parse(jsonValue);

        if (typeof initialValue === 'function') return initialValue();
        return initialValue
    })

    useEffect (() => {
        if (value != undefined)
            localStorage.setItem(prefixedKey, JSON.stringify(value));
        else 
            localStorage.setItem(prefixedKey, JSON.stringify(''))
    }, [prefixedKey, value])

    return [value, setValue];
}

export default useLocalStorage;
