import React, { useState } from 'react';
import api from '../services/api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/login', { email, password });
      // El interceptor ya desempaquetó 'data', así que res.data es { user }
      if (res.data.user) {
        onLogin(res.data.user);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Correo o contraseña incorrectos');
      } else {
        const msg = err.response?.data?.error || err.message;
        setError('Error: ' + msg);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-decor"></div>
      <div className="login-glass">
        <div style={{textAlign:'center', marginBottom:40}}>
          <div className="logo-icon" style={{width:64, height:64, marginBottom:20}}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" 
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </div>
          <h2 className="font-heading" style={{fontSize:28, marginBottom:8}}>GestionResiduos</h2>
          <p style={{color:'var(--text-muted)', fontSize:14}}>Portal de Gestión Industrial Pro</p>
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
