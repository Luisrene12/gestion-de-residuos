import { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import * as api from '../services/api';
import { KpiCard, Badge } from '../components/UI';

const estadoColor = { 1:'green', 2:'blue', 3:'orange', 4:'teal', 5:'purple' };
const estadoBadge = { 1:'Generado', 2:'En Almacén', 3:'En Transporte', 4:'Dispuesto', 5:'En Proceso' };

export default function Dashboard() {
  const [data, setData] = useState({
    kpis: { totalKg:0, totalRegistros:0, peligrosos:0, tasaCumplimiento:0, empresasActivas:0 },
    porTipo: [],
    porArea: [],
    cumpl: [],
    recent: [],
    areas: []
  });
  const [loading, setLoading] = useState(true);

  const refTipo  = useRef(null);
  const refArea  = useRef(null);
  const refCumpl = useRef(null);
  const cTipo    = useRef(null);
  const cArea    = useRef(null);
  const cCumpl   = useRef(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [kpiRes, tipoRes, areaRes, resRes, catRes, reportCumplRes] = await Promise.all([
        api.getKpis(),
        api.getReporteTipo(),
        api.getReporteArea(),
        api.getResiduos(),
        api.getCatalogos(),
        api.getReporteCumplimiento()
      ]);

      setData({
        kpis: { ...kpiRes.data, empresasActivas: catRes.data.empresas.length },
        porTipo: tipoRes.data,
        porArea: areaRes.data,
        cumpl: reportCumplRes.data,
        recent: resRes.data.slice(0, 5),
        areas: catRes.data.areas
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    }
  };

  useEffect(() => {
    if (loading) return;

    const colors = ['#50e07a','#5eadf5','#f5c045','#f47070','#b084f7','#30d0be','#f5945e'];

    cTipo.current?.destroy();
    cTipo.current = new Chart(refTipo.current, {
      type: 'doughnut',
      data: { 
        labels: data.porTipo.map(d=>d.tipo), 
        datasets:[{ data:data.porTipo.map(d=>d.total_kg), backgroundColor:colors, borderWidth:0, hoverOffset:6 }] 
      },
      options: { responsive:true, maintainAspectRatio:false, cutout:'68%', plugins:{ legend:{display:false} } },
    });

    cArea.current?.destroy();
    cArea.current = new Chart(refArea.current, {
      type: 'bar',
      data: { 
        labels: data.porArea.map(d=>d.area), 
        datasets:[{ label:'kg', data:data.porArea.map(d=>d.total_kg), backgroundColor:'rgba(80,224,122,0.18)', borderColor:'#50e07a', borderWidth:1.5, borderRadius:6 }] 
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}},
        scales:{ x:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#8fa492',font:{size:11}}}, y:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#8fa492',font:{size:11}}} } },
    });

    // Note: Cumplimiento chart will be empty for now as it needs more complex logic or specific view
    cCumpl.current?.destroy();
    cCumpl.current = new Chart(refCumpl.current, {
      type: 'bar',
      data: { labels:data.cumpl.map(d=>d.nombre), datasets:[
        { label:'Cumplen',    data:data.cumpl.map(d=>d.cumplen),    backgroundColor:'rgba(80,224,122,0.7)', borderRadius:5, borderWidth:0 },
        { label:'No Cumplen', data:data.cumpl.map(d=>d.no_cumplen), backgroundColor:'rgba(244,112,112,0.7)', borderRadius:5, borderWidth:0 },
      ]},
      options: { responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ labels:{ color:'#8fa492', font:{size:11}, boxWidth:10 } } },
        scales:{ x:{stacked:true, grid:{display:false}, ticks:{color:'#8fa492',font:{size:10}}}, y:{stacked:true, grid:{color:'rgba(255,255,255,0.04)'}, ticks:{color:'#8fa492',font:{size:11}}} } },
    });

    return () => { cTipo.current?.destroy(); cArea.current?.destroy(); cCumpl.current?.destroy(); };
  }, [loading, data]);

  if (loading) return <div className="p-8 text-center text-white">Iniciando Dashboard...</div>;

  return (
    <div>
      {/* KPIs */}
      <div className="kpi-grid">
        <KpiCard label="Total Residuos (kg)" value={data.kpis.totalKg.toLocaleString()} color="accent"
          icon={<svg fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>}
        />
        <KpiCard label="Registros totales" value={data.kpis.totalRegistros} color="info"
          icon={<svg fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"/></svg>}
        />
        <KpiCard label="Residuos Peligrosos" value={data.kpis.peligrosos} color="danger"
          icon={<svg fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>}
        />
        <KpiCard label="Tasa de Cumplimiento" value={`${data.kpis.tasaCumplimiento || 0}%`} color="teal"
          icon={<svg fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
        />
        <KpiCard label="Empresas Gestoras" value={data.kpis.empresasActivas} color="purple"
          icon={<svg fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/></svg>}
        />
        <KpiCard label="Áreas Registradas" value={data.areas.length} color="orange"
          icon={<svg fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>}
        />
      </div>

      {/* Charts */}
      <div className="charts-row">
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Residuos por Tipo</div><div className="card-subtitle">Vista_Residuos_Tipo</div></div>
          </div>
          <div className="chart-wrap"><canvas ref={refTipo}/></div>
        </div>
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Residuos por Área</div><div className="card-subtitle">Vista_Residuos_Area</div></div>
          </div>
          <div className="chart-wrap"><canvas ref={refArea}/></div>
        </div>
      </div>

      <div className="charts-row">
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Cumplimiento Normativo</div><div className="card-subtitle">Vista_Cumplimiento</div></div>
          </div>
          <div className="chart-wrap"><canvas ref={refCumpl}/></div>
        </div>
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Últimos Residuos</div><div className="card-subtitle">Registros recientes</div></div>
          </div>
          <div className="table-container">
            <table>
              <thead><tr><th>#</th><th>Área</th><th>Tipo</th><th>Cantidad</th><th>Estado</th></tr></thead>
              <tbody>
                {data.recent.map(r => (
                  <tr key={r.id_residuo}>
                    <td style={{color:'var(--text2)'}}>{r.id_residuo}</td>
                    <td>{r.area_nombre}</td>
                    <td>{r.tipo_nombre}</td>
                    <td>{r.cantidad} kg</td>
                    <td><Badge color={estadoColor[r.id_estado]}>{r.estado_nombre}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}