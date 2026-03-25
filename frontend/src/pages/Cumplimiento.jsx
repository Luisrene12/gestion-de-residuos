import { useState, useEffect } from 'react';
import * as api from '../services/api';
import { Modal, Badge, ConfirmDialog, EmptyState } from '../components/UI';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/UI';

const EMPTY = { id_residuo:'', id_normativa:'', cumple:'1', fecha_revision: new Date().toISOString().split('T')[0] };

export default function Cumplimiento() {
  const [list, setList]         = useState([]);
  const [residuos, setResiduos]   = useState([]);
  const [normativas, setNormativas] = useState([]);
  const [resumen, setResumen]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [confirm, setConfirm]   = useState(false);
  const [editing, setEditing]   = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const { toast, showToast }    = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cumplRes, resRes, catRes, reportRes] = await Promise.all([
        api.getCumplimiento(),
        api.getResiduos(),
        api.getCatalogos(),
        api.getReporteCumplimiento()
      ]);
      setList(cumplRes.data);
      setResiduos(resRes.data);
      setNormativas(catRes.data.normativas);
      setResumen(reportRes.data);
    } catch (err) {
      showToast('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (c) => {
    setEditing(c.id_cumplimiento);
    setForm({ id_residuo:c.id_residuo, id_normativa:c.id_normativa, cumple:c.cumple?'1':'0', fecha_revision:c.fecha_revision });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.id_residuo || !form.id_normativa || !form.fecha_revision) {
      showToast('Completa todos los campos','error'); return;
    }
    const payload = {
      id_residuo:     Number(form.id_residuo),
      id_normativa:   Number(form.id_normativa),
      cumple:         form.cumple === '1',
      fecha_revision: form.fecha_revision,
    };
    try {
      if (editing) {
        await api.updateCumplimiento(editing, payload);
        showToast('Revisión actualizada');
      } else {
        await api.createCumplimiento(payload);
        showToast('Revisión registrada');
      }
      fetchData();
      setModal(false);
    } catch (err) {
      showToast('Error al guardar', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteCumplimiento(toDelete);
      fetchData();
      showToast('Eliminado','error');
      setConfirm(false);
    } catch (err) {
      showToast('Error al eliminar', 'error');
    }
  };

  if (loading && list.length === 0) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div>
      {/* Resumen Vista_Cumplimiento */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:14, marginBottom:22 }}>
        {resumen.map(r => {
          const pct = Math.round(r.cumplen / r.total * 100);
          return (
            <div key={r.nombre} className="card">
              <div style={{ fontSize:13, fontWeight:500, marginBottom:8 }}>{r.nombre}</div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text2)', marginBottom:6 }}>
                <span>Cumplimiento: <strong style={{color:'var(--accent)'}}>{r.cumplen}/{r.total}</strong></span>
                <span>{pct}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width:`${pct}%`, background: pct>=80?'var(--accent)':pct>=50?'var(--warning)':'var(--danger)' }}/>
              </div>
            </div>
          );
        })}
      </div>

      <div className="section-header">
        <span style={{fontSize:13,color:'var(--text2)'}}>{list.length} revisiones registradas</span>
        <button className="btn btn-primary" onClick={()=>{ setEditing(null); setForm(EMPTY); setModal(true); }}>
          + Nueva Revisión
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr><th>#</th><th>Residuo</th><th>Normativa</th><th>¿Cumple?</th><th>Fecha Revisión</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {list.length===0 && <tr><td colSpan={6}><EmptyState/></td></tr>}
              {list.map(c => (
                <tr key={c.id_cumplimiento}>
                  <td style={{color:'var(--text2)'}}>{c.id_cumplimiento}</td>
                  <td><Badge color="gray">R-{c.id_residuo}</Badge></td>
                  <td>{c.normativa_nombre}</td>
                  <td><Badge color={c.cumple?'green':'red'}>{c.cumple?'Sí cumple':'No cumple'}</Badge></td>
                  <td style={{color:'var(--text2)'}}>{c.fecha_revision}</td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn btn-sm" onClick={()=>openEdit(c)}>✏️</button>
                      <button className="btn btn-sm btn-danger" onClick={()=>{setToDelete(c.id_cumplimiento);setConfirm(true);}}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal} onClose={()=>setModal(false)} title={editing?'Editar Revisión':'Nueva Revisión de Cumplimiento'}>
        <div className="form-grid">
          <div className="form-group">
            <label>Residuo *</label>
            <select value={form.id_residuo} onChange={e=>setForm({...form,id_residuo:e.target.value})}>
              <option value="">— Seleccionar —</option>
              {residuos.map(r=><option key={r.id_residuo} value={r.id_residuo}>#{r.id_residuo} — {r.fecha}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Normativa *</label>
            <select value={form.id_normativa} onChange={e=>setForm({...form,id_normativa:e.target.value})}>
              <option value="">— Seleccionar —</option>
              {normativas.map(n=><option key={n.id_normativa} value={n.id_normativa}>{n.nombre}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>¿Cumple la normativa?</label>
            <select value={form.cumple} onChange={e=>setForm({...form,cumple:e.target.value})}>
              <option value="1">✅ Sí cumple</option>
              <option value="0">❌ No cumple</option>
            </select>
          </div>
          <div className="form-group">
            <label>Fecha de Revisión *</label>
            <input type="date" value={form.fecha_revision} onChange={e=>setForm({...form,fecha_revision:e.target.value})}/>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn" onClick={()=>setModal(false)}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave}>{editing?'Actualizar':'Registrar'}</button>
        </div>
      </Modal>

      <ConfirmDialog open={confirm} onClose={()=>setConfirm(false)}
        onConfirm={handleDelete} message={`¿Eliminar revisión #${toDelete}?`}/>
      <Toast toast={toast}/>
    </div>
  );
}