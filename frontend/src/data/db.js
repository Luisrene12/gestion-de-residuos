// Espeja el schema SQL Server — reemplaza con fetch() a tu API real

export let areas = [
  { id_area: 1, nombre: 'Producción' },
  { id_area: 2, nombre: 'Mantenimiento' },
  { id_area: 3, nombre: 'Almacén' },
  { id_area: 4, nombre: 'Laboratorio' },
  { id_area: 5, nombre: 'Oficinas' },
];

export let responsables = [
  { id_responsable: 1, nombre: 'Carlos Méndez',  cargo: 'Jefe de Planta' },
  { id_responsable: 2, nombre: 'Ana Ríos',       cargo: 'Supervisora HSE' },
  { id_responsable: 3, nombre: 'Jorge Vargas',   cargo: 'Técnico Ambiental' },
  { id_responsable: 4, nombre: 'Lucía Pinto',    cargo: 'Coordinadora Logística' },
];

export let tiposResiduo = [
  { id_tipo: 1, nombre: 'Residuo Orgánico',    peligroso: false },
  { id_tipo: 2, nombre: 'Residuo Plástico',    peligroso: false },
  { id_tipo: 3, nombre: 'Residuo Metálico',    peligroso: false },
  { id_tipo: 4, nombre: 'Residuo Químico',     peligroso: true  },
  { id_tipo: 5, nombre: 'Residuo Electrónico', peligroso: true  },
  { id_tipo: 6, nombre: 'Residuo Biológico',   peligroso: true  },
];

export let clasificaciones = [
  { id_clasificacion: 1, descripcion: 'Reciclable'         },
  { id_clasificacion: 2, descripcion: 'No Reciclable'      },
  { id_clasificacion: 3, descripcion: 'Peligroso Especial' },
  { id_clasificacion: 4, descripcion: 'Inerte'             },
];

export let estados = [
  { id_estado: 1, estado: 'Generado'      },
  { id_estado: 2, estado: 'En Almacén'    },
  { id_estado: 3, estado: 'En Transporte' },
  { id_estado: 4, estado: 'Dispuesto'     },
  { id_estado: 5, estado: 'En Proceso'    },
];

export let disposiciones = [
  { id_disposicion: 1, tipo: 'Reciclaje'        },
  { id_disposicion: 2, tipo: 'Incineracion'      },
  { id_disposicion: 3, tipo: 'Relleno Sanitario' },
  { id_disposicion: 4, tipo: 'Reutilizacion'     },
];

export let empresas = [
  { id_empresa: 1, nombre: 'EcoGestión S.A.',     telefono: '+591 3 333-1111' },
  { id_empresa: 2, nombre: 'Reciclados del Este',  telefono: '+591 3 333-2222' },
  { id_empresa: 3, nombre: 'TransResiduos Ltda.',  telefono: '+591 3 333-3333' },
];

export let transportes = [
  { id_transporte: 1, tipo_vehiculo: 'Camión Compactador',    placa: 'ABC-1234', id_empresa: 1 },
  { id_transporte: 2, tipo_vehiculo: 'Camión Cisterna',        placa: 'DEF-5678', id_empresa: 2 },
  { id_transporte: 3, tipo_vehiculo: 'Furgón Especializado',   placa: 'GHI-9012', id_empresa: 3 },
];

export let normativas = [
  { id_normativa: 1, nombre: 'Ley 755 Bolivia',  descripcion: 'Gestión Integral de Residuos Sólidos' },
  { id_normativa: 2, nombre: 'ISO 14001:2015',    descripcion: 'Sistemas de Gestión Ambiental'       },
  { id_normativa: 3, nombre: 'Decreto 2954',      descripcion: 'Manejo de Residuos Peligrosos'       },
  { id_normativa: 4, nombre: 'NB 69007',          descripcion: 'Norma Boliviana Residuos Hospitalarios' },
];

let _ridSeq = 100;
export let residuos = [
  { id_residuo:1, id_area:1, id_tipo:1, id_clasificacion:1, id_estado:4, id_responsable:1, cantidad:120.50, fecha:'2025-03-01' },
  { id_residuo:2, id_area:2, id_tipo:4, id_clasificacion:3, id_estado:2, id_responsable:2, cantidad:45.00,  fecha:'2025-03-05' },
  { id_residuo:3, id_area:3, id_tipo:2, id_clasificacion:1, id_estado:3, id_responsable:3, cantidad:88.75,  fecha:'2025-03-08' },
  { id_residuo:4, id_area:4, id_tipo:6, id_clasificacion:3, id_estado:1, id_responsable:2, cantidad:12.30,  fecha:'2025-03-10' },
  { id_residuo:5, id_area:1, id_tipo:3, id_clasificacion:1, id_estado:4, id_responsable:4, cantidad:200.00, fecha:'2025-03-12' },
  { id_residuo:6, id_area:5, id_tipo:5, id_clasificacion:3, id_estado:2, id_responsable:1, cantidad:5.20,   fecha:'2025-03-15' },
  { id_residuo:7, id_area:2, id_tipo:1, id_clasificacion:2, id_estado:5, id_responsable:3, cantidad:67.80,  fecha:'2025-03-18' },
  { id_residuo:8, id_area:3, id_tipo:4, id_clasificacion:3, id_estado:1, id_responsable:2, cantidad:30.00,  fecha:'2025-03-20' },
];

let _hSeq = 50;
export let historialDisposicion = [
  { id_historial:1, id_residuo:1, id_disposicion:1, id_transporte:1, fecha:'2025-03-03' },
  { id_historial:2, id_residuo:5, id_disposicion:1, id_transporte:2, fecha:'2025-03-14' },
  { id_historial:3, id_residuo:2, id_disposicion:2, id_transporte:3, fecha:'2025-03-06' },
];

let _cSeq = 30;
export let cumplimiento = [
  { id_cumplimiento:1, id_residuo:1, id_normativa:1, cumple:true,  fecha_revision:'2025-03-04' },
  { id_cumplimiento:2, id_residuo:2, id_normativa:3, cumple:false, fecha_revision:'2025-03-07' },
  { id_cumplimiento:3, id_residuo:3, id_normativa:2, cumple:true,  fecha_revision:'2025-03-09' },
  { id_cumplimiento:4, id_residuo:4, id_normativa:4, cumple:false, fecha_revision:'2025-03-11' },
  { id_cumplimiento:5, id_residuo:5, id_normativa:1, cumple:true,  fecha_revision:'2025-03-13' },
  { id_cumplimiento:6, id_residuo:6, id_normativa:2, cumple:true,  fecha_revision:'2025-03-16' },
];

export let auditoria = [
  { id_auditoria:1, tabla:'Residuos',           accion:'INSERT', usuario:'admin',       fecha:'2025-03-01 08:00:00' },
  { id_auditoria:2, tabla:'Residuos',           accion:'INSERT', usuario:'ana.rios',    fecha:'2025-03-05 10:22:00' },
  { id_auditoria:3, tabla:'Cumplimiento',       accion:'INSERT', usuario:'jorge.vargas',fecha:'2025-03-09 14:10:00' },
  { id_auditoria:4, tabla:'HistorialDisposicion',accion:'INSERT',usuario:'lucia.pinto', fecha:'2025-03-14 09:55:00' },
];

const now = () => new Date().toISOString().slice(0,19).replace('T',' ');
const log = (tabla, accion) =>
  auditoria.push({ id_auditoria: auditoria.length+1, tabla, accion, usuario:'current_user', fecha: now() });

export const db = {
  // ── VISTAS SQL ───────────────────────────────────────────
  vistaResiduosPorTipo() {
    const map = {};
    residuos.forEach(r => {
      const k = tiposResiduo.find(t => t.id_tipo === r.id_tipo)?.nombre || '?';
      map[k] = (map[k] || 0) + Number(r.cantidad);
    });
    return Object.entries(map).map(([tipo, total]) => ({ tipo, total: +total.toFixed(2) }));
  },
  vistaResiduosPorArea() {
    const map = {};
    residuos.forEach(r => {
      const k = areas.find(a => a.id_area === r.id_area)?.nombre || '?';
      map[k] = (map[k] || 0) + Number(r.cantidad);
    });
    return Object.entries(map).map(([area, total]) => ({ area, total: +total.toFixed(2) }));
  },
  vistaCumplimiento() {
    const map = {};
    cumplimiento.forEach(c => {
      const k = normativas.find(n => n.id_normativa === c.id_normativa)?.nombre || '?';
      if (!map[k]) map[k] = { nombre:k, total:0, cumplen:0, no_cumplen:0 };
      map[k].total++;
      c.cumple ? map[k].cumplen++ : map[k].no_cumplen++;
    });
    return Object.values(map);
  },
  kpis() {
    const totalKg = residuos.reduce((s,r) => s + Number(r.cantidad), 0);
    const peligrosos = residuos.filter(r => tiposResiduo.find(t => t.id_tipo===r.id_tipo)?.peligroso).length;
    const tasaCumplimiento = cumplimiento.length
      ? Math.round(cumplimiento.filter(c=>c.cumple).length / cumplimiento.length * 100) : 0;
    return { totalKg:+totalKg.toFixed(2), totalRegistros:residuos.length, peligrosos, tasaCumplimiento, empresasActivas:empresas.length };
  },

  // ── CRUD Residuos ─────────────────────────────────────────
  insertResiduo(data) {
    const r = { ...data, id_residuo: ++_ridSeq };
    residuos.push(r); log('Residuos','INSERT'); return r;
  },
  updateResiduo(id, data) {
    const i = residuos.findIndex(r=>r.id_residuo===id);
    if(i===-1) return null;
    residuos[i] = { ...residuos[i], ...data }; log('Residuos','UPDATE'); return residuos[i];
  },
  deleteResiduo(id) {
    const i = residuos.findIndex(r=>r.id_residuo===id);
    if(i===-1) return false;
    residuos.splice(i,1); log('Residuos','DELETE'); return true;
  },

  // ── CRUD Historial ────────────────────────────────────────
  insertHistorial(data) {
    const h = { ...data, id_historial: ++_hSeq };
    historialDisposicion.push(h); log('HistorialDisposicion','INSERT'); return h;
  },
  deleteHistorial(id) {
    const i = historialDisposicion.findIndex(h=>h.id_historial===id);
    if(i===-1) return false;
    historialDisposicion.splice(i,1); log('HistorialDisposicion','DELETE'); return true;
  },

  // ── CRUD Cumplimiento ─────────────────────────────────────
  insertCumplimiento(data) {
    const c = { ...data, id_cumplimiento: ++_cSeq };
    cumplimiento.push(c); log('Cumplimiento','INSERT'); return c;
  },
  updateCumplimiento(id, data) {
    const i = cumplimiento.findIndex(c=>c.id_cumplimiento===id);
    if(i===-1) return null;
    cumplimiento[i] = { ...cumplimiento[i], ...data }; log('Cumplimiento','UPDATE'); return cumplimiento[i];
  },
  deleteCumplimiento(id) {
    const i = cumplimiento.findIndex(c=>c.id_cumplimiento===id);
    if(i===-1) return false;
    cumplimiento.splice(i,1); log('Cumplimiento','DELETE'); return true;
  },
};