import { useState, useEffect } from 'react';
import './index.css';
import Login from './pages/Login';
import Dashboard   from './pages/Dashboard';
import Residuos    from './pages/Residuos';
import Historial   from './pages/Historial';
import Cumplimiento from './pages/Cumplimiento';
import Auditoria   from './pages/Auditoria';

const PAGES = [
  { id:'dashboard',    label:'Dashboard',         page:(user) => <Dashboard/> },
  { id:'residuos',     label:'Residuos',           page:(user) => <Residuos user={user}/> },
  { id:'historial',    label:'Historial Disposición', page:(user) => <Historial user={user}/> },
  { id:'cumplimiento', label:'Cumplimiento',       page:(user) => <Cumplimiento user={user}/> },
  { id:'auditoria',    label:'Auditoría',          page:(user) => <Auditoria/> },
];

const icons = {
  dashboard:    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/></svg>,
  residuos:     <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>,
  historial:    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>,
  cumplimiento: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>,
  auditoria:    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"/></svg>,
};

const pageTitles = {
  dashboard:    'Dashboard — Resumen General',
  residuos:     'Gestión de Residuos',
  historial:    'Historial de Disposición Final',
  cumplimiento: 'Cumplimiento Normativo',
  auditoria:    'Registro de Auditoría',
};

export default function App() {
  const [active, setActive] = useState('dashboard');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const current = PAGES.find(p => p.id === active);

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" 
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </div>
          <h1>GestionResiduos</h1>
          <p>Planta Industrial Pro</p>
        </div>

        <nav className="sidebar-nav">
          <div>
            <div className="nav-group-title">Principal</div>
            {PAGES.slice(0,2).map(p => (
              <button key={p.id} className={`nav-item ${active===p.id?'active':''}`} onClick={()=>setActive(p.id)}>
                {icons[p.id]}
                <span>{p.label}</span>
                {p.id==='residuos' && <span className="nav-badge">8</span>}
              </button>
            ))}
          </div>
          <div style={{marginTop:32}}>
            <div className="nav-group-title">Administración</div>
            {PAGES.slice(2).map(p => (
              <button key={p.id} className={`nav-item ${active===p.id?'active':''}`} onClick={()=>setActive(p.id)}>
                {icons[p.id]}
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-pill">
            <div className="avatar">{user.nombre.substring(0, 2).toUpperCase()}</div>
            <div className="user-pill-info">
              <p>{user.nombre}</p>
              <span>{user.rol}</span>
            </div>
          </div>
          <button className="btn btn-sm" 
                  style={{width:'100%', marginTop:12, background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)'}} 
                  onClick={handleLogout}>
             Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <header className="topbar">
          <span className="page-title">{pageTitles[active]}</span>
          <div className="topbar-right">
            <span style={{ fontSize:12, color:'var(--text2)' }}>
              {new Date().toLocaleDateString('es-BO', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
            </span>
          </div>
        </header>
        <div className="page-content">
          {current?.page(user)}
        </div>
      </main>
    </div>
  );
}