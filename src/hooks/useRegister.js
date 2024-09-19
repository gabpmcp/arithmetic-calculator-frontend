// src/hooks/useRegister.js
import { useReducer } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const initialState = {
    username: '',
    password: '',
    confirmPassword: '',
    loading: false,
    error: '',
};

function registerReducer(state, action) {
    switch (action.type) {
        case 'SET_USERNAME':
            return { ...state, username: action.payload };
        case 'SET_PASSWORD':
            return { ...state, password: action.payload };
        case 'SET_CONFIRM_PASSWORD':
            return { ...state, confirmPassword: action.payload };
        case 'REGISTER_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'REGISTER_SUCCESS':
            return { ...state, loading: false };
        case 'REGISTER_FAILURE':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

export function useRegister() {
    const [state, dispatch] = useReducer(registerReducer, initialState);
    const navigate = useNavigate();

    const setUsername = (username) => {
        dispatch({ type: 'SET_USERNAME', payload: username });
    };

    const setPassword = (password) => {
        dispatch({ type: 'SET_PASSWORD', payload: password });
    };

    const setConfirmPassword = (confirmPassword) => {
        dispatch({ type: 'SET_CONFIRM_PASSWORD', payload: confirmPassword });
    };

    const register = async () => {
        dispatch({ type: 'REGISTER_REQUEST' });
        try {
            await api.post('/register', {
                username: state.username,
                password: state.password,
            });
            dispatch({ type: 'REGISTER_SUCCESS' });
            return { success: true };
        } catch (error) {
            const errorMsg =
                (error.response && error.response.data && error.response.data.error) ||
                'Error al registrar.';
            dispatch({ type: 'REGISTER_FAILURE', payload: errorMsg });
            return { success: false, error: errorMsg };
        }
    };

    return {
        state,
        setUsername,
        setPassword,
        setConfirmPassword,
        register,
    };
}
