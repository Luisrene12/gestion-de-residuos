import { useState, useEffect } from 'react';
import * as api from '../services/api';
import { Badge, Modal } from '../components/UI';

const accionColor = { INSERT:'green', UPDATE:'blue', DELETE:'red' };

export default function Auditoria() {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedAudit, setSelectedAudit] = useState(null);

  useEffect(() => {
    fetchAuditoria();
  }, []);

  const fetchAuditoria = async () => {
    try {
      setLoading(true);
      const res = await api.getAuditoria();
      setList(res.data);
    } catch (err) {
      console.error('Error fetching auditoria', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'all' ? list
    : list.filter(a => a.accion === filter);

  const renderDetails = (detalles) => {
    if (!detalles) return <i style={{color:'var(--text-dim)'}}>Sin detalles registrados</i>;
    try {
      const data = typeof detalles === 'string' ? JSON.parse(detalles) : detalles;
      
      if (data.antes && data.despues) {
        return (
          <div className="audit-diff-container">
            <div className="diff-box before">
              <span className="diff-label">Estado Anterior</span>
              <pre>{JSON.stringify(data.antes, null, 2)}</pre>
            </div>
            <div className="diff-box after">
              <span className="diff-label">Estado Nuevo</span>
              <pre>{JSON.stringify(data.despues, null, 2)}</pre>
            </div>
          </div>
        );
      }
      
      if (data.antes) return (
        <div className="diff-box before">
          <span className="diff-label">Registro Eliminado</span>
          <pre>{JSON.stringify(data.antes, null, 2)}</pre>
        </div>
      );

      if (data.nuevo) return (
        <div className="diff-box after">
          <span className="diff-label">Registro Creado</span>
          <pre>{JSON.stringify(data.nuevo, null, 2)}</pre>
        </div>
      );
      
      return <pre>{JSON.stringify(data, null, 2)}</pre>;
    } catch (e) {
      return <pre>{detalles}</pre>;
    }
  };

  if (loading && list.length === 0) return <div className="p-8 text-center text-white">Cargando registros de auditoría...</div>;

  return (
    <div className="page-container">
      <div className="page-header" style={{marginBottom: 24, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h2 className="page-title">Auditoría del Sistema</h2>
          <p style={{color:'var(--text-muted)', fontSize:13}}>Monitoreo detallado de cambios en la base de datos</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {['all','INSERT','UPDATE','DELETE'].map(f => (
            <button key={f} className={`btn btn-sm ${filter===f?'btn-primary':''}`} 
                    style={{height:32, padding:'0 12px', fontSize:11}}
                    onClick={()=>setFilter(f)}>
              {f === 'all' ? 'Todos' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Tabla</th>
                <th>Acción</th>
                <th>Usuario</th>
                <th>Detalles</th>
                <th>Fecha y Hora</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id_auditoria}>
                  <td style={{color:'var(--text-dim)', fontSize:12}}>{a.id_auditoria}</td>
                  <td>
                    <span className="table-tag">{a.tabla}</span>
                  </td>
                  <td><Badge color={accionColor[a.accion]||'gray'}>{a.accion}</Badge></td>
                  <td style={{color:'var(--text-muted)', fontFamily:'monospace', fontSize:12}}>{a.usuario}</td>
                  <td>
                    {a.detalles ? (
                      <button className="btn btn-sm" 
                              style={{height:28, fontSize:11, background:'var(--bg-surface)', border:'1px solid var(--border)'}}
                              onClick={() => setSelectedAudit(a)}>
                        🔍 Ver Cambios
                      </button>
                    ) : (
                      <span style={{color:'var(--text-dim)', fontSize:11}}>No disponible</span>
                    )}
                  </td>
                  <td style={{color:'var(--text-muted)', fontSize:12}}>
                    {new Date(a.fecha).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{padding:40, textAlign:'center', color:'var(--text-dim)'}}>
              No se encontraron registros de auditoría.
            </div>
          )}
        </div>
      </div>

      <Modal open={!!selectedAudit} onClose={() => setSelectedAudit(null)} title="Detalle de Operación" width={800}>
        <div className="audit-detail-modal">
          {selectedAudit && (
            <>
              <div className="audit-meta">
                <div className="meta-item">
                  <label>Tabla Afectada</label>
                  <span>{selectedAudit.tabla}</span>
                </div>
                <div className="meta-item">
                  <label>Operación</label>
                  <Badge color={accionColor[selectedAudit.accion]}>{selectedAudit.accion}</Badge>
                </div>
                <div className="meta-item">
                  <label>Ejecutado por</label>
                  <span style={{fontFamily:'monospace'}}>{selectedAudit.usuario}</span>
                </div>
                <div className="meta-item">
                  <label>Fecha del Evento</label>
                  <span>{new Date(selectedAudit.fecha).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="audit-content">
                <h4 style={{fontSize:14, marginBottom:16, color:'var(--text-muted)'}}>Desglose de Datos:</h4>
                {renderDetails(selectedAudit.detalles)}
              </div>

              <div className="modal-footer" style={{marginTop:24, textAlign:'right'}}>
                <button className="btn btn-primary" onClick={() => setSelectedAudit(null)}>Cerrar</button>
              </div>
            </>
          )}
        </div>
      </Modal>

      <style jsx>{`
        .table-tag {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 6px;
          background: var(--bg-surface);
          color: var(--text);
          border: 1px solid var(--border);
        }
        .audit-meta {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          background: rgba(255,255,255,0.03);
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 24px;
        }
        .meta-item label {
          display: block;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-dim);
          margin-bottom: 4px;
        }
        .meta-item span {
          font-size: 14px;
          font-weight: 500;
        }
        .audit-diff-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .diff-box {
          background: #000;
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 12px;
          overflow: hidden;
        }
        .diff-box.before { border-left: 3px solid var(--danger); }
        .diff-box.after { border-left: 3px solid var(--accent); }
        .diff-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--text-dim);
        }
        pre {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 12px;
          color: #a5b4fc;
          margin: 0;
          overflow-x: auto;
          white-space: pre-wrap;
        }
        .audit-detail-modal {
          padding: 8px;
        }
      `}</style>
    </div>
  );
}