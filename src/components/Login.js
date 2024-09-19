// src/components/Login.js
import React from 'react';
import { useLogin } from '../hooks/useLogin';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const { state, setUsername, setPassword, login } = useLogin();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login();
        if (result.success) {
            navigate('/new-operation');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Inicio de Sesión</h2>
            <form onSubmit={handleSubmit}>
                {/* Campo de Nombre de Usuario (Correo Electrónico) */}
                <div className="mb-3">
                    <label className="form-label">Correo Electrónico</label>
                    <input
                        type="email"
                        className={`form-control ${state.error ? 'is-invalid' : ''}`}
                        value={state.username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="usuario@ejemplo.com"
                        required
                    />
                </div>

                {/* Campo de Contraseña */}
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className={`form-control ${state.error ? 'is-invalid' : ''}`}
                        value={state.password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ingresa tu contraseña"
                        required
                    />
                </div>

                {/* Mostrar mensaje de error si existe */}
                {state.error && <div className="alert alert-danger">{state.error}</div>}

                {/* Botón de Envío */}
                <button type="submit" className="btn btn-primary" disabled={state.loading}>
                    {state.loading ? 'Iniciando...' : 'Iniciar Sesión'}
                </button>
            </form>

            {/* Enlace para registro */}
            <p className="mt-3">
                ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>.
            </p>
        </div>
    );
}

export default Login;
