// src/components/NewOperation.js
import React, { useEffect } from 'react';
import { useNewOperation } from '../hooks/useNewOperation';
import { useNavigate, Link } from 'react-router-dom';
import { setAuthToken } from '../services/api';

function NewOperation() {
    const {
        state,
        setOperationType,
        setOperandsInput,
        parseOperands,
        fetchBalance,
        performOperation,
        logout,
    } = useNewOperation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        } else {
            setAuthToken(token);
            fetchBalance();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let operands = [];
        if (state.operationType !== 'random_string') {
            operands = parseOperands();
            if (operands.length === 0) {
                alert('Por favor, ingresa al menos un operando válido.');
                return;
            }
        }

        await performOperation(state.operationType, operands);
    };

    const handleLogoutClick = () => {
        logout();
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="container mt-5">
            <h2>Nueva Operación</h2>
            <button className="btn btn-secondary float-end" onClick={handleLogoutClick}>
                Cerrar Sesión
            </button>
            <p>
                <strong>Saldo:</strong>{' '}
                {state.balance !== null ? `$${state.balance.toFixed(2)}` : 'Cargando...'}
            </p>
            <form onSubmit={handleSubmit}>
                {/* Selección del Tipo de Operación */}
                <div className="mb-3">
                    <label className="form-label">Tipo de Operación</label>
                    <select
                        className="form-select"
                        value={state.operationType}
                        onChange={(e) => setOperationType(e.target.value)}
                    >
                        <option value="addition">Suma</option>
                        <option value="subtraction">Resta</option>
                        <option value="multiplication">Multiplicación</option>
                        <option value="division">División</option>
                        <option value="square_root">Raíz Cuadrada</option>
                        <option value="random_string">Cadena Aleatoria</option>
                    </select>
                </div>

                {/* Campo de Operandos */}
                {state.operationType !== 'random_string' && (
                    <div className="mb-3">
                        <label className="form-label">Operandos (separados por comas)</label>
                        <input
                            type="text"
                            className="form-control"
                            value={state.operandsInput}
                            onChange={(e) => setOperandsInput(e.target.value)}
                            placeholder="Ejemplo: 5, 10, 15"
                            required
                        />
                    </div>
                )}

                {/* Mostrar mensaje de error si existe */}
                {state.error && <div className="alert alert-danger">{state.error}</div>}

                {/* Botón de Envío */}
                <button type="submit" className="btn btn-primary" disabled={state.loading}>
                    {state.loading ? 'Procesando...' : 'Ejecutar Operación'}
                </button>
            </form>

            {/* Mostrar el resultado si existe */}
            {state.result !== null && (
                <div className="mt-4">
                    <h4>Resultado: {state.result}</h4>
                </div>
            )}

            {/* Enlace para ver registros */}
            <p className="mt-3">
                <Link to="/records">Ver Registros</Link>
            </p>
        </div>
    );
}

export default NewOperation;
