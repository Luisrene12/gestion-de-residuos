import { useState, useEffect } from 'react';
import * as api from '../services/api';
import { Modal, Badge, RowActions, SearchBar, ConfirmDialog, EmptyState } from '../components/UI';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/UI';

const EMPTY = { id_area:'', id_tipo:'', id_clasificacion:'', id_estado:'', id_responsable:'', cantidad:'', fecha: new Date().toISOString().split('T')[0] };
const estadoColor = { 1:'green', 2:'blue', 3:'orange', 4:'teal', 5:'purple' };

export default function Residuos() {
  const [list, setList]         = useState([]);
  const [cats, setCats]         = useState({ areas:[], tipos:[], clasificaciones:[], estados:[], responsables:[] });
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [confirm, setConfirm]   = useState(false);
  const [editing, setEditing]   = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [search, setSearch]     = useState('');
  const { toast, showToast }    = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resRes, catRes] = await Promise.all([
        api.getResiduos(),
        api.getCatalogos()
      ]);
      setList(resRes.data);
      setCats(catRes.data);
    } catch (err) {
      showToast('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openNew  = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (r) => {
    setEditing(r.id_residuo);
    setForm({ 
      id_area: r.id_area, 
      id_tipo: r.id_tipo, 
      id_clasificacion: r.id_clasificacion,
      id_estado: r.id_estado, 
      id_responsable: r.id_responsable, 
      cantidad: r.cantidad, 
      fecha: r.fecha 
    });
    setModal(true);
  };
  const openDel  = (id) => { setToDelete(id); setConfirm(true); };

  const handleSave = async () => {
    const payload = {
      id_area:          Number(form.id_area),
      id_tipo:          Number(form.id_tipo),
      id_clasificacion: Number(form.id_clasificacion),
      id_estado:        Number(form.id_estado),
      id_responsable:   Number(form.id_responsable),
      cantidad:         parseFloat(form.cantidad),
      fecha:            form.fecha,
    };
    if (!payload.id_area || !payload.id_tipo || !payload.cantidad || !payload.fecha) {
      showToast('Completa los campos requeridos', 'error'); return;
    }

    try {
      if (editing) {
        await api.updateResiduo(editing, payload);
        showToast('Residuo actualizado');
      } else {
        await api.createResiduo(payload);
        showToast('Residuo registrado');
      }
      fetchData();
      setModal(false);
    } catch (err) {
      showToast('Error al guardar', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteResiduo(toDelete);
      fetchData();
      showToast('Residuo eliminado', 'error');
      setConfirm(false);
    } catch (err) {
      showToast('Error al eliminar', 'error');
    }
  };

  const filtered = list.filter(r => {
    const area = r.area_nombre?.toLowerCase() || '';
    const tipo = r.tipo_nombre?.toLowerCase() || '';
    const q = search.toLowerCase();
    return area.includes(q) || tipo.includes(q) || String(r.id_residuo).includes(q);
  });

  if (loading && list.length === 0) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div>
      <div className="section-header">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por área o tipo..."/>
        <button className="btn btn-primary" onClick={openNew}>+ Nuevo Residuo</button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Fecha</th><th>Área</th><th>Tipo</th>
                <th>Clasificación</th><th>Cantidad</th><th>Estado</th>
                <th>Responsable</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length===0 && <tr><td colSpan={9}><EmptyState message="Sin resultados"/></td></tr>}
              {filtered.map(r => (
                <tr key={r.id_residuo}>
                  <td style={{color:'var(--text2)'}}>{r.id_residuo}</td>
                  <td style={{color:'var(--text2)'}}>{r.fecha}</td>
                  <td>{r.area_nombre}</td>
                  <td>
                    <span style={{display:'flex',alignItems:'center',gap:6}}>
                      {r.tipo_nombre}
                      {r.peligroso === 1 && <Badge color="red">Peligroso</Badge>}
                    </span>
                  </td>
                  <td>{r.clasificacion_nombre}</td>
                  <td><strong>{r.cantidad}</strong> kg</td>
                  <td><Badge color={estadoColor[r.id_estado]}>{r.estado_nombre}</Badge></td>
                  <td style={{color:'var(--text2)'}}>{r.responsable_nombre}</td>
                  <td><RowActions onEdit={()=>openEdit(r)} onDelete={()=>openDel(r.id_residuo)}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal form */}
      <Modal open={modal} onClose={()=>setModal(false)} title={editing?'Editar Residuo':'Nuevo Residuo'}>
        <div className="form-grid">
          <div className="form-group">
            <label>Fecha *</label>
            <input type="date" value={form.fecha} onChange={e=>setForm({...form,fecha:e.target.value})}/>
          </div>
          <div className="form-group">
            <label>Cantidad (kg) *</label>
            <input type="number" min="0" step="0.01" value={form.cantidad} onChange={e=>setForm({...form,cantidad:e.target.value})}/>
          </div>
          <div className="form-group">
            <label>Área *</label>
            <select value={form.id_area} onChange={e=>setForm({...form,id_area:e.target.value})}>
              <option value="">— Seleccionar —</option>
              {cats.areas.map(a=><option key={a.id_area} value={a.id_area}>{a.nombre}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Tipo de Residuo *</label>
            <select value={form.id_tipo} onChange={e=>setForm({...form,id_tipo:e.target.value})}>
              <option value="">— Seleccionar —</option>
              {cats.tipos.map(t=><option key={t.id_tipo} value={t.id_tipo}>{t.nombre}{t.peligroso?' ⚠️':''}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Clasificación</label>
            <select value={form.id_clasificacion} onChange={e=>setForm({...form,id_clasificacion:e.target.value})}>
              <option value="">— Seleccionar —</option>
              {cats.clasificaciones.map(c=><option key={c.id_clasificacion} value={c.id_clasificacion}>{c.descripcion}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Estado</label>
            <select value={form.id_estado} onChange={e=>setForm({...form,id_estado:e.target.value})}>
              <option value="">— Seleccionar —</option>
              {cats.estados.map(e=><option key={e.id_estado} value={e.id_estado}>{e.estado}</option>)}
            </select>
          </div>
          <div className="form-group full">
            <label>Responsable</label>
            <select value={form.id_responsable} onChange={e=>setForm({...form,id_responsable:e.target.value})}>
              <option value="">— Seleccionar —</option>
              {cats.responsables.map(r=><option key={r.id_responsable} value={r.id_responsable}>{r.nombre} — {r.cargo}</option>)}
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn" onClick={()=>setModal(false)}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave}>{editing?'Guardar Cambios':'Registrar'}</button>
        </div>
      </Modal>

      <ConfirmDialog open={confirm} onClose={()=>setConfirm(false)}
        onConfirm={handleDelete} message={`¿Eliminar residuo #${toDelete}?`}/>
      <Toast toast={toast}/>
    </div>
  );
}