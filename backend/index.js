const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { query, run, get } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de middlewares profesionales
app.use(cors());
app.use(morgan('dev')); // Logger de peticiones
app.use(express.json());

// Utilería para respuestas estandarizadas
const sendResponse = (res, data, status = 200) => {
    res.status(status).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
    });
};

// Middleware para Auditoría Profesional
const audit = (tabla, accion) => async (req, res, next) => {
    let detalles = null;
    
    // Capturar estado previo ANTES de que se ejecute el DELETE/UPDATE
    try {
        if (accion === 'DELETE' || accion === 'UPDATE') {
            const id = req.params.id;
            if (id) {
                const pks = { 
                    'Residuos': 'id_residuo', 
                    'HistorialDisposicion': 'id_historial', 
                    'Cumplimiento': 'id_cumplimiento' 
                };
                const pk = pks[tabla] || 'id';
                const originalData = await get(`SELECT * FROM ${tabla} WHERE ${pk} = ?`, [id]);
                if (originalData) {
                    detalles = JSON.stringify({ antes: originalData });
                }
            }
        } else if (accion === 'INSERT') {
            detalles = JSON.stringify({ nuevo: req.body });
        }
    } catch (err) {
        console.error(`Audit Before Error (${tabla}/${accion}):`, err.message);
    }

    // Interceptar res.json para registrar la auditoría sólo si la respuesta es exitosa (2xx)
    const originalJson = res.json;
    res.json = function (obj) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            const usuario = req.headers['x-user'] || 'admin_user';
            let finalDetalles = detalles;
            
            if (accion === 'UPDATE' && req.body) {
                const antes = detalles ? JSON.parse(detalles).antes : null;
                finalDetalles = JSON.stringify({ antes, despues: req.body });
            }

            run('INSERT INTO Auditoria (tabla, accion, usuario, detalles) VALUES (?, ?, ?, ?)', 
                [tabla, accion, usuario, finalDetalles])
                .catch(err => console.error('Audit Write Error:', err.message));
        }
        return originalJson.apply(res, arguments);
    };
    next();
};

// --- AUTENTICACION ---
app.post('/api/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await get(
            'SELECT id_usuario, nombre, email, rol FROM usuarios WHERE email = ? AND password = ? AND estado = 1',
            [email, password]
        );
        if (user) {
            sendResponse(res, { user });
        } else {
            const err = new Error('Credenciales inválidas');
            err.status = 401;
            throw err;
        }
    } catch (err) {
        next(err);
    }
});

// --- RUTAS DE RESIDUOS ---
app.get('/api/residuos', async (req, res, next) => {
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
        sendResponse(res, rows);
    } catch (err) {
        next(err);
    }
});

app.post('/api/residuos', audit('Residuos', 'INSERT'), async (req, res, next) => {
    const { id_area, id_tipo, id_clasificacion, id_estado, id_responsable, cantidad, fecha } = req.body;
    try {
        const result = await run(
            'INSERT INTO Residuos (id_area, id_tipo, id_clasificacion, id_estado, id_responsable, cantidad, fecha) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id_area, id_tipo, id_clasificacion, id_estado, id_responsable, cantidad, fecha]
        );
        sendResponse(res, { id: result.id }, 201);
    } catch (err) {
        next(err);
    }
});

app.put('/api/residuos/:id', audit('Residuos', 'UPDATE'), async (req, res, next) => {
    const { id_area, id_tipo, id_clasificacion, id_estado, id_responsable, cantidad, fecha } = req.body;
    try {
        await run(
            'UPDATE Residuos SET id_area=?, id_tipo=?, id_clasificacion=?, id_estado=?, id_responsable=?, cantidad=?, fecha=? WHERE id_residuo=?',
            [id_area, id_tipo, id_clasificacion, id_estado, id_responsable, cantidad, fecha, req.params.id]
        );
        sendResponse(res, { success: true });
    } catch (err) {
        next(err);
    }
});

app.delete('/api/residuos/:id', audit('Residuos', 'DELETE'), async (req, res, next) => {
    try {
        await run('DELETE FROM Residuos WHERE id_residuo=?', [req.params.id]);
        sendResponse(res, { success: true });
    } catch (err) {
        next(err);
    }
});

// --- RUTAS DE HISTORIAL DISPOSICION ---
app.get('/api/historial', async (req, res, next) => {
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
        sendResponse(res, rows);
    } catch (err) {
        next(err);
    }
});

app.post('/api/historial', audit('HistorialDisposicion', 'INSERT'), async (req, res, next) => {
    const { id_residuo, id_disposicion, id_transporte, fecha } = req.body;
    try {
        const result = await run(
            'INSERT INTO HistorialDisposicion (id_residuo, id_disposicion, id_transporte, fecha) VALUES (?, ?, ?, ?)',
            [id_residuo, id_disposicion, id_transporte, fecha]
        );
        sendResponse(res, { id: result.id }, 201);
    } catch (err) {
        next(err);
    }
});

app.delete('/api/historial/:id', audit('HistorialDisposicion', 'DELETE'), async (req, res, next) => {
    try {
        await run('DELETE FROM HistorialDisposicion WHERE id_historial=?', [req.params.id]);
        sendResponse(res, { success: true });
    } catch (err) {
        next(err);
    }
});

// --- RUTAS DE CUMPLIMIENTO ---
app.get('/api/cumplimiento', async (req, res, next) => {
    try {
        const rows = await query(`
            SELECT c.*, r.cantidad, r.fecha as fecha_residuo, n.nombre as normativa_nombre
            FROM Cumplimiento c
            JOIN Residuos r ON c.id_residuo = r.id_residuo
            JOIN Normativas n ON c.id_normativa = n.id_normativa
            ORDER BY c.fecha_revision DESC
        `);
        sendResponse(res, rows);
    } catch (err) {
        next(err);
    }
});

app.post('/api/cumplimiento', audit('Cumplimiento', 'INSERT'), async (req, res, next) => {
    const { id_residuo, id_normativa, cumple, fecha_revision } = req.body;
    try {
        const result = await run(
            'INSERT INTO Cumplimiento (id_residuo, id_normativa, cumple, fecha_revision) VALUES (?, ?, ?, ?)',
            [id_residuo, id_normativa, cumple ? 1 : 0, fecha_revision]
        );
        sendResponse(res, { id: result.id }, 201);
    } catch (err) {
        next(err);
    }
});

app.put('/api/cumplimiento/:id', audit('Cumplimiento', 'UPDATE'), async (req, res, next) => {
    const { id_residuo, id_normativa, cumple, fecha_revision } = req.body;
    try {
        await run(
            'UPDATE Cumplimiento SET id_residuo=?, id_normativa=?, cumple=?, fecha_revision=? WHERE id_cumplimiento=?',
            [id_residuo, id_normativa, cumple ? 1 : 0, fecha_revision, req.params.id]
        );
        sendResponse(res, { success: true });
    } catch (err) {
        next(err);
    }
});

app.delete('/api/cumplimiento/:id', audit('Cumplimiento', 'DELETE'), async (req, res, next) => {
    try {
        await run('DELETE FROM Cumplimiento WHERE id_cumplimiento=?', [req.params.id]);
        sendResponse(res, { success: true });
    } catch (err) {
        next(err);
    }
});

// --- CATALOGOS ---
app.get('/api/catalogos', async (req, res, next) => {
    try {
        const [areas, responsables, tipos, clasificaciones, estados, disposiciones, empresas, transportes, normativas] = await Promise.all([
            query('SELECT * FROM Areas'),
            query('SELECT * FROM Responsables'),
            query('SELECT * FROM TiposResiduo'),
            query('SELECT * FROM ClasificacionResiduo'),
            query('SELECT * FROM EstadosResiduo'),
            query('SELECT * FROM DisposicionFinal'),
            query('SELECT * FROM EmpresasGestoras'),
            query('SELECT * FROM Transporte'),
            query('SELECT * FROM Normativas')
        ]);

        sendResponse(res, {
            areas, responsables, tipos, clasificaciones, estados, disposiciones, empresas, transportes, normativas
        });
    } catch (err) {
        next(err);
    }
});

// --- REPORTES Y VISTAS ---
app.get('/api/reportes/tipo', async (req, res, next) => {
    try {
        const rows = await query('SELECT tipo, total as total_kg FROM Vista_Residuos_Tipo');
        sendResponse(res, rows);
    } catch (err) {
        next(err);
    }
});

app.get('/api/reportes/periodo', async (req, res, next) => {
    try {
        const rows = await query(`
            SELECT FORMAT(fecha, 'yyyy-MM') AS periodo, SUM(cantidad) AS total_kg
            FROM Residuos
            GROUP BY FORMAT(fecha, 'yyyy-MM')
        `);
        sendResponse(res, rows);
    } catch (err) {
        next(err);
    }
});

app.get('/api/reportes/area', async (req, res, next) => {
    try {
        const rows = await query('SELECT area, total as total_kg FROM Vista_Residuos_Area');
        sendResponse(res, rows);
    } catch (err) {
        next(err);
    }
});

app.get('/api/reportes/cumplimiento', async (req, res, next) => {
    try {
        const rows = await query('SELECT * FROM Vista_Cumplimiento');
        sendResponse(res, rows);
    } catch (err) {
        next(err);
    }
});

app.get('/api/kpis', async (req, res, next) => {
    try {
        const [totalKg, totalRegistros, peligrosos] = await Promise.all([
            get('SELECT SUM(cantidad) as total FROM Residuos'),
            get('SELECT COUNT(*) as total FROM Residuos'),
            get('SELECT COUNT(*) as total FROM Residuos r JOIN TiposResiduo t ON r.id_tipo = t.id_tipo WHERE t.peligroso = 1')
        ]);
        
        sendResponse(res, {
            totalKg: totalKg ? totalKg.total : 0,
            totalRegistros: totalRegistros ? totalRegistros.total : 0,
            peligrosos: peligrosos ? peligrosos.total : 0
        });
    } catch (err) {
        next(err);
    }
});

app.get('/api/auditoria', async (req, res, next) => {
    try {
        const rows = await query('SELECT TOP 50 * FROM Auditoria ORDER BY fecha DESC');
        sendResponse(res, rows);
    } catch (err) {
        next(err);
    }
});

// Middleware Centralizado de Manejo de Errores
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`);
    const status = err.status || 500;
    res.status(status).json({
        success: false,
        error: err.message || 'Internal Server Error',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Professional Server running on port ${PORT}`);
});
