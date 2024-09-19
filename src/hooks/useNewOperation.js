// src/hooks/useNewOperation.js
import { useReducer } from 'react';
import api from '../services/api';

const initialState = {
    operationType: 'addition',
    operandsInput: '',
    operands: [],
    result: null,
    balance: null,
    loading: false,
    error: '',
};

function operationReducer(state, action) {
    switch (action.type) {
        case 'SET_OPERATION_TYPE':
            return { ...state, operationType: action.payload, operandsInput: '', operands: [], result: null, error: '' };
        case 'SET_OPERANDS_INPUT':
            return { ...state, operandsInput: action.payload };
        case 'SET_OPERANDS':
            return { ...state, operands: action.payload };
        case 'FETCH_BALANCE_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_BALANCE_SUCCESS':
            return { ...state, loading: false, balance: action.payload };
        case 'FETCH_BALANCE_FAILURE':
            return { ...state, loading: false, error: action.payload };
        case 'OPERATION_REQUEST':
            return { ...state, loading: true, error: '', result: null };
        case 'OPERATION_SUCCESS':
            return { ...state, loading: false, result: action.payload.result, balance: action.payload.new_balance };
        case 'OPERATION_FAILURE':
            return { ...state, loading: false, error: action.payload };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}

export function useNewOperation() {
    const [state, dispatch] = useReducer(operationReducer, initialState);

    const setOperationType = (type) => {
        dispatch({ type: 'SET_OPERATION_TYPE', payload: type });
    };

    const setOperandsInput = (input) => {
        dispatch({ type: 'SET_OPERANDS_INPUT', payload: input });
    };

    const parseOperands = () => {
        const ops = state.operandsInput
            .split(',')
            .map(op => parseFloat(op.trim()))
            .filter(op => !isNaN(op));
        dispatch({ type: 'SET_OPERANDS', payload: ops });
        return ops;
    };

    const fetchBalance = async () => {
        dispatch({ type: 'FETCH_BALANCE_REQUEST' });
        try {
            const response = await api.get('/user/balance');
            dispatch({ type: 'FETCH_BALANCE_SUCCESS', payload: response.data.balance });
        } catch (error) {
            const errorMsg =
                (error.response && error.response.data && error.response.data.error) ||
                'Error al obtener el saldo.';
            dispatch({ type: 'FETCH_BALANCE_FAILURE', payload: errorMsg });
        }
    };

    const performOperation = async (operationType, operands) => {
        dispatch({ type: 'OPERATION_REQUEST' });
        try {
            const payload = { operation_type: operationType };
            if (operationType !== 'random_string') {
                payload.operands = operands;
            }
            const response = await api.post('/records', payload);
            dispatch({
                type: 'OPERATION_SUCCESS',
                payload: {
                    result: response.data.result,
                    new_balance: response.data.new_balance,
                },
            });
        } catch (error) {
            const errorMsg =
                (error.response && error.response.data && error.response.data.error) ||
                'Error al realizar la operación.';
            dispatch({ type: 'OPERATION_FAILURE', payload: errorMsg });
        }
    };

    const logout = () => {
        dispatch({ type: 'RESET' });
    };

    return {
        state,
        setOperationType,
        setOperandsInput,
        parseOperands,
        fetchBalance,
        performOperation,
        logout,
    };
}
