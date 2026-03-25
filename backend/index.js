const express = require('express');
const cors = require('cors');
const { query, run, get } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Middleware para Auditoría Simple
const audit = (tabla, accion) => async (req, res, next) => {
    const originalSend = res.send;
    res.send = function (data) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            const usuario = req.headers['x-user'] || 'admin_user';
            run('INSERT INTO Auditoria (tabla, accion, usuario) VALUES (?, ?, ?)', [tabla, accion, usuario])
                .catch(err => console.error('Audit error:', err));
        }
        originalSend.apply(res, arguments);
    };
    next();
};

// --- RUTAS DE RESIDUOS ---

app.get('/api/residuos', async (req, res) => {
    try {
        const rows = await query(`
            SELECT r.*, a.nombre as area_nombre, t.nombre as tipo_nombre, t.peligroso, 
                   c.descripcion as clasificacion_nombre, e.estado as estado_nombre, 
                   rs.nombre as responsable_nombre
            FROM Residuos r
            LEFT JOIN Areas a ON r.id_area = a.id_area
            LEFT JOIN TiposResiduo t ON r.id_tipo = t.id_tipo
            LEFT JOIN ClasificacionResiduo c ON r.id_clasificacion = c.id_clasificacion
            LEFT JOIN EstadosResiduo e ON r.id_estado = e.id_estado
            LEFT JOIN Responsables rs ON r.id_responsable = rs.id_responsable
            ORDER BY r.fecha DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/residuos', audit('Residuos', 'INSERT'), async (req, res) => {
    const { id_area, id_tipo, id_clasificacion, id_estado, id_responsable, cantidad, fecha } = req.body;
    try {
        const result = await run(
            'INSERT INTO Residuos (id_area, id_tipo, id_clasificacion, id_estado, id_responsable, cantidad, fecha) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id_area, id_tipo, id_clasificacion, id_estado, id_responsable, cantidad, fecha]
        );
        res.status(201).json({ id: result.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/residuos/:id', audit('Residuos', 'UPDATE'), async (req, res) => {
    const { id_area, id_tipo, id_clasificacion, id_estado, id_responsable, cantidad, fecha } = req.body;
    try {
        await run(
            'UPDATE Residuos SET id_area=?, id_tipo=?, id_clasificacion=?, id_estado=?, id_responsable=?, cantidad=?, fecha=? WHERE id_residuo=?',
            [id_area, id_tipo, id_clasificacion, id_estado, id_responsable, cantidad, fecha, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/residuos/:id', audit('Residuos', 'DELETE'), async (req, res) => {
    try {
        await run('DELETE FROM Residuos WHERE id_residuo=?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- RUTAS DE HISTORIAL DISPOSICION ---

app.get('/api/historial', async (req, res) => {
    try {
        const rows = await query(`
            SELECT h.*, r.cantidad, r.fecha as fecha_residuo, d.tipo as disposicion_nombre, 
                   t.tipo_vehiculo, t.placa, e.nombre as empresa_nombre
            FROM HistorialDisposicion h
            JOIN Residuos r ON h.id_residuo = r.id_residuo
            JOIN DisposicionFinal d ON h.id_disposicion = d.id_disposicion
            JOIN Transporte t ON h.id_transporte = t.id_transporte
            JOIN EmpresasGestoras e ON t.id_empresa = e.id_empresa
            ORDER BY h.fecha DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/historial', audit('HistorialDisposicion', 'INSERT'), async (req, res) => {
    const { id_residuo, id_disposicion, id_transporte, fecha } = req.body;
    try {
        const result = await run(
            'INSERT INTO HistorialDisposicion (id_residuo, id_disposicion, id_transporte, fecha) VALUES (?, ?, ?, ?)',
            [id_residuo, id_disposicion, id_transporte, fecha]
        );
        res.status(201).json({ id: result.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/historial/:id', audit('HistorialDisposicion', 'DELETE'), async (req, res) => {
    try {
        await run('DELETE FROM HistorialDisposicion WHERE id_historial=?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- RUTAS DE CUMPLIMIENTO ---

app.get('/api/cumplimiento', async (req, res) => {
    try {
        const rows = await query(`
            SELECT c.*, r.cantidad, r.fecha as fecha_residuo, n.nombre as normativa_nombre
            FROM Cumplimiento c
            JOIN Residuos r ON c.id_residuo = r.id_residuo
            JOIN Normativas n ON c.id_normativa = n.id_normativa
            ORDER BY c.fecha_revision DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/cumplimiento', audit('Cumplimiento', 'INSERT'), async (req, res) => {
    const { id_residuo, id_normativa, cumple, fecha_revision } = req.body;
    try {
        const result = await run(
            'INSERT INTO Cumplimiento (id_residuo, id_normativa, cumple, fecha_revision) VALUES (?, ?, ?, ?)',
            [id_residuo, id_normativa, cumple ? 1 : 0, fecha_revision]
        );
        res.status(201).json({ id: result.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/cumplimiento/:id', audit('Cumplimiento', 'UPDATE'), async (req, res) => {
    const { id_residuo, id_normativa, cumple, fecha_revision } = req.body;
    try {
        await run(
            'UPDATE Cumplimiento SET id_residuo=?, id_normativa=?, cumple=?, fecha_revision=? WHERE id_cumplimiento=?',
            [id_residuo, id_normativa, cumple ? 1 : 0, fecha_revision, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/cumplimiento/:id', audit('Cumplimiento', 'DELETE'), async (req, res) => {
    try {
        await run('DELETE FROM Cumplimiento WHERE id_cumplimiento=?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- CATALOGOS ---

app.get('/api/catalogos', async (req, res) => {
    try {
        const areas = await query('SELECT * FROM Areas');
        const responsables = await query('SELECT * FROM Responsables');
        const tipos = await query('SELECT * FROM TiposResiduo');
        const clasificaciones = await query('SELECT * FROM ClasificacionResiduo');
        const estados = await query('SELECT * FROM EstadosResiduo');
        const disposiciones = await query('SELECT * FROM DisposicionFinal');
        const empresas = await query('SELECT * FROM EmpresasGestoras');
        const transportes = await query('SELECT * FROM Transporte');
        const normativas = await query('SELECT * FROM Normativas');

        res.json({
            areas, responsables, tipos, clasificaciones, estados, disposiciones, empresas, transportes, normativas
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- REPORTES Y VISTAS ---

app.get('/api/reportes/tipo', async (req, res) => {
    try {
        const rows = await query('SELECT tipo, total as total_kg FROM Vista_Residuos_Tipo');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/reportes/periodo', async (req, res) => {
    try {
        // En caso de que se haya creado Vista_Residuos_Periodo (el usuario no la mandó, así que lo hacemos directo)
        const rows = await query(`
            SELECT FORMAT(fecha, 'yyyy-MM') AS periodo, SUM(cantidad) AS total_kg
            FROM Residuos
            GROUP BY FORMAT(fecha, 'yyyy-MM')
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/reportes/area', async (req, res) => {
    try {
        const rows = await query('SELECT area, total as total_kg FROM Vista_Residuos_Area');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/reportes/cumplimiento', async (req, res) => {
    try {
        const rows = await query('SELECT * FROM Vista_Cumplimiento');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/kpis', async (req, res) => {
    try {
        const totalKg = await get('SELECT SUM(cantidad) as total FROM Residuos');
        const totalRegistros = await get('SELECT COUNT(*) as total FROM Residuos');
        const peligrosos = await get('SELECT COUNT(*) as total FROM Residuos r JOIN TiposResiduo t ON r.id_tipo = t.id_tipo WHERE t.peligroso = 1');
        
        res.json({
            totalKg: totalKg ? totalKg.total : 0,
            totalRegistros: totalRegistros ? totalRegistros.total : 0,
            peligrosos: peligrosos ? peligrosos.total : 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/auditoria', async (req, res) => {
    try {
        const rows = await query('SELECT TOP 50 * FROM Auditoria ORDER BY fecha DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
