// src/components/Records.js
import React, { useEffect } from 'react';
import { useRecords } from '../hooks/useRecords';
import { useNavigate, Link } from 'react-router-dom';
import { setAuthToken } from '../services/api';

function Records() {
    const {
        state,
        setSearch,
        setSortBy,
        setOrder,
        setPage,
        setPerPage,
        fetchRecords,
        deleteRecord,
    } = useRecords();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        } else {
            setAuthToken(token);
            fetchRecords();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.page, state.perPage, state.sortBy, state.order]);

    const handleSort = (column) => {
        if (state.sortBy === column) {
            setOrder(state.order === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setOrder('asc');
        }
        setPage(1); // Resetear a la primera página al cambiar de ordenamiento
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
        navigate('/');
    };

    return (
        <div className="container mt-5">
            <h2>Registros de Usuario</h2>
            <button className="btn btn-secondary float-end" onClick={handleLogout}>
                Cerrar Sesión
            </button>

            {/* Formulario de Búsqueda */}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por respuesta de operación"
                    value={state.search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    className="btn btn-primary mt-2"
                    onClick={() => {
                        fetchRecords();
                        setPage(1);
                    }}
                >
                    Buscar
                </button>
            </div>

            {/* Mostrar mensaje de error si existe */}
            {state.error && <div className="alert alert-danger">{state.error}</div>}

            {/* Tabla de Registros */}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                            Fecha {state.sortBy === 'date' ? (state.order === 'asc' ? '↑' : '↓') : ''}
                        </th>
                        <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>
                            Monto {state.sortBy === 'amount' ? (state.order === 'asc' ? '↑' : '↓') : ''}
                        </th>
                        <th
                            onClick={() => handleSort('operation_response')}
                            style={{ cursor: 'pointer' }}
                        >
                            Respuesta{' '}
                            {state.sortBy === 'operation_response' ? (state.order === 'asc' ? '↑' : '↓') : ''}
                        </th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {state.loading ? (
                        <tr>
                            <td colSpan="4" className="text-center">
                                Cargando...
                            </td>
                        </tr>
                    ) : state.records.length > 0 ? (
                        state.records.map((record) => (
                            <tr key={record.id}>
                                <td>{new Date(record.date).toLocaleString()}</td>
                                <td>{record.amount}</td>
                                <td>{record.operation_response}</td>
                                <td>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteRecord(record.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">
                                No se encontraron registros.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Paginación */}
            <div className="d-flex justify-content-between align-items-center">
                {/* Selección de Registros por Página */}
                <div>
                    <label>Registros por página: </label>
                    <select
                        value={state.perPage}
                        onChange={(e) => {
                            setPerPage(Number(e.target.value));
                            setPage(1);
                        }}
                        className="form-select d-inline-block w-auto ms-2"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                    </select>
                </div>

                {/* Controles de Paginación */}
                <div>
                    <button
                        className="btn btn-primary me-2"
                        disabled={state.page <= 1}
                        onClick={() => setPage(state.page - 1)}
                    >
                        Anterior
                    </button>
                    <span>
                        Página {state.page} de {Math.ceil(state.total / state.perPage)}
                    </span>
                    <button
                        className="btn btn-primary ms-2"
                        disabled={state.page >= Math.ceil(state.total / state.perPage)}
                        onClick={() => setPage(state.page + 1)}
                    >
                        Siguiente
                    </button>
                </div>
            </div>

            {/* Enlace para volver a Nueva Operación */}
            <p className="mt-3">
                <Link to="/new-operation">Volver a Nueva Operación</Link>
            </p>
        </div>
    );
}

export default Records;
