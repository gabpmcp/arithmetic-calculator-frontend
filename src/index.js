// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Importar desde 'react-dom/client' en React 18
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap para estilos

// Obtener el elemento del DOM donde se montará la aplicación
const container = document.getElementById('root');
if (!container) {
  throw new Error("El elemento con ID 'root' no fue encontrado en el DOM.");
}

// Crear el root y renderizar la aplicación
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
