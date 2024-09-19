// src/components/Register.js
import React from 'react';
import { useRegister } from '../hooks/useRegister';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const { state, setUsername, setPassword, setConfirmPassword, register } = useRegister();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones adicionales en el frontend
        if (state.password !== state.confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        const result = await register();
        if (result.success) {
            alert('Register exitoso. Puedes iniciar sesión ahora.');
            navigate('/');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Register</h2>
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

                {/* Campo de Confirmar Contraseña */}
                <div className="mb-3">
                    <label className="form-label">Confirmar Contraseña</label>
                    <input
                        type="password"
                        className={`form-control ${state.error ? 'is-invalid' : ''}`}
                        value={state.confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirma tu contraseña"
                        required
                    />
                </div>

                {/* Mostrar mensaje de error si existe */}
                {state.error && <div className="alert alert-danger">{state.error}</div>}

                {/* Botón de Envío */}
                <button type="submit" className="btn btn-primary" disabled={state.loading}>
                    {state.loading ? 'Registrando...' : 'Registrar'}
                </button>
            </form>

            {/* Enlace para volver al login */}
            <p className="mt-3">
                ¿Ya tienes una cuenta? <Link to="/">Inicia sesión aquí</Link>.
            </p>
        </div>
    );
}

export default Register;
