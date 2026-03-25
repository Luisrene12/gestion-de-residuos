import { useState, useEffect } from 'react';
import * as api from '../services/api';
import { Badge } from '../components/UI';

const accionColor = { INSERT:'green', UPDATE:'blue', DELETE:'red' };
const tablaColor  = { Residuos:'accent', Cumplimiento:'teal', HistorialDisposicion:'orange' };

export default function Auditoria() {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

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

  if (loading && list.length === 0) return <div className="p-8 text-center text-white">Cargando registros de auditoría...</div>;

  return (
    <div>
      {/* Filtros */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {['all','INSERT','UPDATE','DELETE'].map(f => (
          <button key={f} className={`btn btn-sm ${filter===f?'btn-primary':''}`} onClick={()=>setFilter(f)}>
            {f === 'all' ? 'Todos' : f}
          </button>
        ))}
        <span style={{ marginLeft:'auto', fontSize:12, color:'var(--text2)', alignSelf:'center' }}>
          {filtered.length} registros encontrados
        </span>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr><th>#</th><th>Tabla</th><th>Acción</th><th>Usuario</th><th>Fecha y hora</th></tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id_auditoria}>
                  <td style={{color:'var(--text2)'}}>{a.id_auditoria}</td>
                  <td>
                    <span style={{
                      fontSize:12, fontWeight:500, padding:'3px 8px', borderRadius:6,
                      background:'var(--bg3)', color:'var(--text)',
                      border:'1px solid var(--border2)'
                    }}>{a.tabla}</span>
                  </td>
                  <td><Badge color={accionColor[a.accion]||'gray'}>{a.accion}</Badge></td>
                  <td style={{color:'var(--text2)',fontFamily:'monospace',fontSize:12}}>{a.usuario}</td>
                  <td style={{color:'var(--text2)',fontSize:12}}>{a.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}