import { useState, useEffect } from 'react';
import * as api from '../services/api';
import { Modal, Badge, RowActions, ConfirmDialog, EmptyState } from '../components/UI';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/UI';

const EMPTY = { id_residuo:'', id_disposicion:'', id_transporte:'', fecha: new Date().toISOString().split('T')[0] };
const dispColor = { 1:'teal', 2:'orange', 3:'blue', 4:'green' };

export default function Historial() {
  const [list, setList]         = useState([]);
  const [residuos, setResiduos]   = useState([]);
  const [cats, setCats]         = useState({ disposiciones:[], transportes:[], empresas:[] });
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [confirm, setConfirm]   = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const { toast, showToast }    = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [histRes, resRes, catRes] = await Promise.all([
        api.getHistorial(),
        api.getResiduos(),
        api.getCatalogos()
      ]);
      setList(histRes.data);
      setResiduos(resRes.data);
      setCats(catRes.data);
    } catch (err) {
      showToast('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.id_residuo || !form.id_disposicion || !form.id_transporte || !form.fecha) {
      showToast('Completa todos los campos', 'error'); return;
    }
    
    try {
      await api.createHistorial({
        id_residuo:    Number(form.id_residuo),
        id_disposicion:Number(form.id_disposicion),
        id_transporte: Number(form.id_transporte),
        fecha:         form.fecha,
      });
      fetchData();
      setModal(false);
      showToast('Disposición registrada');
    } catch (err) {
      showToast('Error al registrar disposición', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteHistorial(toDelete);
      fetchData();
      showToast('Registro eliminado', 'error');
      setConfirm(false);
    } catch (err) {
      showToast('Error al eliminar', 'error');
    }
  };

  if (loading && list.length === 0) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div>
      <div className="section-header">
        <span style={{fontSize:13,color:'var(--text2)'}}>
          {list.length} registros de disposición final
        </span>
        <button className="btn btn-primary" onClick={()=>{ setForm(EMPTY); setModal(true); }}>
          + Nueva Disposición
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr><th>#</th><th>Residuo ID</th><th>Disposición</th><th>Transporte</th><th>Empresa</th><th>Fecha</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {list.length===0 && <tr><td colSpan={7}><EmptyState/></td></tr>}
              {list.map(h => (
                <tr key={h.id_historial}>
                  <td style={{color:'var(--text2)'}}>{h.id_historial}</td>
                  <td>
                    <Badge color="gray">R-{h.id_residuo}</Badge>
                  </td>
                  <td><Badge color={dispColor[h.id_disposicion]||'gray'}>{h.disposicion_nombre}</Badge></td>
                  <td>{h.tipo_vehiculo}<br/><span style={{fontSize:11,color:'var(--text2)'}}>{h.placa}</span></td>
                  <td style={{color:'var(--text2)'}}>{h.empresa_nombre}</td>
                  <td style={{color:'var(--text2)'}}>{h.fecha}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={()=>{setToDelete(h.id_historial);setConfirm(true);}}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal} onClose={()=>setModal(false)} title="Registrar Disposición Final">
        <div className="form-grid">
          <div className="form-group">
            <label>Residuo *</label>
            <select value={form.id_residuo} onChange={e=>setForm({...form,id_residuo:e.target.value})}>
              <option value="">— Seleccionar —</option>
              {residuos.map(r=><option key={r.id_residuo} value={r.id_residuo}>#{r.id_residuo} — {r.fecha} ({r.cantidad}kg)</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Tipo de Disposición * (CHK Normativa)</label>
            <select value={form.id_disposicion} onChange={e=>setForm({...form,id_disposicion:e.target.value})}>
              <option value="">— Seleccionar —</option>
              {cats.disposiciones.map(d=><option key={d.id_disposicion} value={d.id_disposicion}>{d.tipo}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Transporte *</label>
            <select value={form.id_transporte} onChange={e=>setForm({...form,id_transporte:e.target.value})}>
              <option value="">— Seleccionar —</option>
              {cats.transportes.map(t=>{
                const emp = cats.empresas.find(e=>e.id_empresa===t.id_empresa);
                return <option key={t.id_transporte} value={t.id_transporte}>{t.placa} — {t.tipo_vehiculo} ({emp?.nombre})</option>;
              })}
            </select>
          </div>
          <div className="form-group">
            <label>Fecha *</label>
            <input type="date" value={form.fecha} onChange={e=>setForm({...form,fecha:e.target.value})}/>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn" onClick={()=>setModal(false)}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave}>Registrar</button>
        </div>
      </Modal>

      <ConfirmDialog open={confirm} onClose={()=>setConfirm(false)}
        onConfirm={handleDelete} message={`¿Eliminar registro #${toDelete} del historial?`}/>
      <Toast toast={toast}/>
    </div>
  );
}