// src/hooks/useRecords.js
import { useReducer } from 'react';
import api, { setAuthToken } from '../services/api';

const initialState = {
    records: [],
    search: '',
    sortBy: 'date',
    order: 'desc',
    page: 1,
    perPage: 10,
    total: 0,
    loading: false,
    error: '',
};

function recordsReducer(state, action) {
    switch (action.type) {
        case 'SET_SEARCH':
            return { ...state, search: action.payload };
        case 'SET_SORT_BY':
            return { ...state, sortBy: action.payload };
        case 'SET_ORDER':
            return { ...state, order: action.payload };
        case 'SET_PAGE':
            return { ...state, page: action.payload };
        case 'SET_PER_PAGE':
            return { ...state, perPage: action.payload };
        case 'FETCH_RECORDS_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_RECORDS_SUCCESS':
            return {
                ...state,
                loading: false,
                records: action.payload.records,
                total: action.payload.total,
            };
        case 'FETCH_RECORDS_FAILURE':
            return { ...state, loading: false, error: action.payload };
        case 'DELETE_RECORD_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'DELETE_RECORD_SUCCESS':
            return { ...state, loading: false };
        case 'DELETE_RECORD_FAILURE':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

export function useRecords() {
    const [state, dispatch] = useReducer(recordsReducer, initialState);

    const setSearch = (search) => {
        dispatch({ type: 'SET_SEARCH', payload: search });
    };

    const setSortBy = (sortBy) => {
        dispatch({ type: 'SET_SORT_BY', payload: sortBy });
    };

    const setOrder = (order) => {
        dispatch({ type: 'SET_ORDER', payload: order });
    };

    const setPage = (page) => {
        dispatch({ type: 'SET_PAGE', payload: page });
    };

    const setPerPage = (perPage) => {
        dispatch({ type: 'SET_PER_PAGE', payload: perPage });
    };

    const fetchRecords = async () => {
        dispatch({ type: 'FETCH_RECORDS_REQUEST' });
        try {
            const response = await api.get('/records', {
                params: {
                    search: state.search,
                    sort_by: state.sortBy,
                    order: state.order,
                    page: state.page,
                    per_page: state.perPage,
                },
            });
            dispatch({
                type: 'FETCH_RECORDS_SUCCESS',
                payload: {
                    records: response.data.records,
                    total: response.data.total,
                },
            });
        } catch (error) {
            const errorMsg =
                (error.response && error.response.data && error.response.data.error) ||
                'Error al obtener los registros.';
            dispatch({ type: 'FETCH_RECORDS_FAILURE', payload: errorMsg });
        }
    };

    const deleteRecord = async (id) => {
        dispatch({ type: 'DELETE_RECORD_REQUEST' });
        try {
            await api.delete(`/records/${id}`);
            dispatch({ type: 'DELETE_RECORD_SUCCESS' });
            fetchRecords(); // Refrescar la lista de registros
        } catch (error) {
            const errorMsg =
                (error.response && error.response.data && error.response.data.error) ||
                'Error al eliminar el registro.';
            dispatch({ type: 'DELETE_RECORD_FAILURE', payload: errorMsg });
        }
    };

    return {
        state,
        setSearch,
        setSortBy,
        setOrder,
        setPage,
        setPerPage,
        fetchRecords,
        deleteRecord,
    };
}
