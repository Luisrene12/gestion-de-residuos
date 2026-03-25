import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/login', { email, password });
      if (res.data.success) {
        onLogin(res.data.user);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Correo o contraseña incorrectos');
      } else {
        setError('Error de conexión con el servidor (' + err.message + ')');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-mark" style={{ margin: '0 auto 16px auto', width: 48, height: 48 }}>
            <svg viewBox="0 0 24 24" style={{ width: 28, height: 28 }}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <h2 style={{ margin: 0, color: 'var(--text)' }}>Gestion Residuos</h2>
          <p style={{ margin: '8px 0 24px 0', color: 'var(--text2)', fontSize: 14 }}>Inicia sesión en tu cuenta industrial</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="admin@empresa.com"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 24 }}>
            <label>Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 12 }}>Ingresar al Sistema</button>
        </form>
      </div>
    </div>
  );
}
