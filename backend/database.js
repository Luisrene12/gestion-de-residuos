const sql = require('mssql/msnodesqlv8');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'GestionResiduosPro',
    driver: 'SQL Server',
    options: {
        trustedConnection: true,
        encrypt: false, // Deshabilitar si estás en local
        trustServerCertificate: true
    }
};

let poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server via Windows Authentication.');
        // No auto-init schema (usamos la base de datos del usuario)
        return pool;
    })
    .catch(err => {
        console.error('Database Connection Failed! Revise que la BD gestion_residuos exista:', err.message);
    });

function initializeSchema(pool) {
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaPath)) return;
    
    const schema = fs.readFileSync(schemaPath, 'utf8');
    // Para sql_server necesitamos separar los bloques por GO
    const batches = schema.split(/^GO$/im).filter(b => b.trim() !== '');
    
    (async () => {
        try {
            for (let batch of batches) {
                await pool.request().query(batch);
            }
            console.log('SQL Server Database schema initialized successfully.');
        } catch (err) {
            console.error('Error initializing schema in SQL Server:', err.message);
        }
    })();
}

// Wrapper inteligente para simular el compartamiento original de sqlite3
async function executeQuery(rawSql, params = [], isRun = false) {
    if (!poolPromise) throw new Error('No DB connection (Revise el archivo .env)');
    const pool = await poolPromise;
    const request = pool.request();
    
    let index = 0;
    // Convierte ? a @arg_0, @arg_1...
    const transformedSql = rawSql.replace(/\?/g, () => {
        const pName = `arg_${index}`;
        let val = params[index];
        if (typeof val === 'boolean') val = val ? 1 : 0;
        request.input(pName, val);
        index++;
        return `@${pName}`;
    });

    let finalQuery = transformedSql;
    const isInsert = finalQuery.trim().toUpperCase().startsWith('INSERT');
    if (isInsert && isRun) {
        // Para obtener el último ID insertado (simulando lastID)
        finalQuery += '; SELECT SCOPE_IDENTITY() AS id;';
    }

    const result = await request.query(finalQuery);
    return {
        recordset: result.recordset || [],
        rowsAffected: result.rowsAffected[0] || 0
    };
}

const query = async (sqlString, params = []) => {
    const res = await executeQuery(sqlString, params);
    return res.recordset;
};

const get = async (sqlString, params = []) => {
    const res = await executeQuery(sqlString, params);
    return res.recordset[0];
};

const run = async (sqlString, params = []) => {
    const res = await executeQuery(sqlString, params, true);
    let id = null;
    if (res.recordset.length > 0 && res.recordset[0].id) {
        id = res.recordset[0].id;
    }
    return { id, changes: res.rowsAffected };
};

module.exports = {
    // Ya no exportamos 'db' (sqlite object), sólo las funciones
    query,
    run,
    get
};
