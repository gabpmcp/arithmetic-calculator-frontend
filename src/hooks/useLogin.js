// src/hooks/useLogin.js
import { useReducer } from 'react';
import api, { setAuthToken } from '../services/api';

const initialState = {
    username: '',
    password: '',
    loading: false,
    error: '',
};

function loginReducer(state, action) {
    switch (action.type) {
        case 'SET_USERNAME':
            return { ...state, username: action.payload };
        case 'SET_PASSWORD':
            return { ...state, password: action.payload };
        case 'LOGIN_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'LOGIN_SUCCESS':
            return { ...state, loading: false };
        case 'LOGIN_FAILURE':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

export function useLogin() {
    const [state, dispatch] = useReducer(loginReducer, initialState);

    const setUsername = (username) => {
        dispatch({ type: 'SET_USERNAME', payload: username });
    };

    const setPassword = (password) => {
        dispatch({ type: 'SET_PASSWORD', payload: password });
    };

    const login = async () => {
        dispatch({ type: 'LOGIN_REQUEST' });
        try {
            const response = await api.post('/login', {
                username: state.username,
                password: state.password,
            });
            const token = response.data.token;
            setAuthToken(token);
            localStorage.setItem('token', token);
            dispatch({ type: 'LOGIN_SUCCESS' });
            return { success: true };
        } catch (error) {
            const errorMsg =
                (error.response && error.response.data && error.response.data.error) ||
                'Error al iniciar sesión.';
            dispatch({ type: 'LOGIN_FAILURE', payload: errorMsg });
            return { success: false, error: errorMsg };
        }
    };

    return {
        state,
        setUsername,
        setPassword,
        login,
    };
}
