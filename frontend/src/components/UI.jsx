import { useEffect } from 'react';

export function Modal({ open, onClose, title, children, width=600 }) {
  useEffect(() => {
    const h = e => { if(e.key==='Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className={`modal-overlay ${open?'open':''}`}
         onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal" style={{ width }}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Toast({ toast }) {
  const icons = { success:'✓', error:'✕', info:'i' };
  return (
    <div className={`toast ${toast.type} ${toast.show?'show':''}`}>
      <div className="toast-icon">{icons[toast.type]||'i'}</div>
      <span>{toast.message}</span>
    </div>
  );
}

export function Badge({ color='gray', children }) {
  return <span className={`badge badge-${color}`}><span className="dot"/>{children}</span>;
}

export function KpiCard({ label, value, icon, color='accent' }) {
  const map = {
    accent:  { c:'var(--accent)',  d:'var(--accent-dim)'  },
    danger:  { c:'var(--danger)',  d:'var(--danger-dim)'  },
    info:    { c:'var(--info)',    d:'var(--primary-dim)' },
    purple:  { c:'var(--primary)',  d:'rgba(168, 85, 247, 0.1)' },
    orange:  { c:'var(--warning)', d:'var(--warning-dim)' },
    teal:    { c:'var(--accent-light)', d:'rgba(20, 184, 166, 0.1)' },
  };
  const { c, d } = map[color]||map.accent;
  return (
    <div className="kpi-card" style={{'--kpi-color':c,'--kpi-dim':d}}>
      <div className="kpi-icon-wrap" style={{background:d, color:c}}>
        {icon}
      </div>
      <div className="kpi-val">{value}</div>
      <div className="kpi-label">{label}</div>
    </div>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, message }) {
  return (
    <Modal open={open} onClose={onClose} title="Confirmar eliminación" width={420}>
      <p style={{ fontSize:14, marginBottom:20 }}>{message}</p>
      <div className="form-actions">
        <button className="btn" onClick={onClose}>Cancelar</button>
        <button className="btn btn-danger" onClick={() => { onConfirm(); onClose(); }}>Eliminar</button>
      </div>
    </Modal>
  );
}

export function SearchBar({ value, onChange, placeholder='Buscar...' }) {
  return (
    <div className="search-bar">
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"/>
      </svg>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>
    </div>
  );
}

export function RowActions({ onEdit, onDelete }) {
  return (
    <div style={{ display:'flex', gap:8 }}>
      <button className="btn btn-sm" 
              style={{background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', padding:'0 12px'}} 
              onClick={onEdit}>
        ✏️ Editar
      </button>
      <button className="btn btn-sm" 
              style={{background:'var(--danger-dim)', color:'var(--danger)', border:'1px solid rgba(239,68,68,0.2)', padding:'0 12px'}} 
              onClick={onDelete}>
        🗑 Borrar
      </button>
    </div>
  );
}

export function EmptyState({ message='No hay registros.' }) {
  return <div className="empty-state">{message}</div>;
}