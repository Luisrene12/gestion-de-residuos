const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'GestionResiduosPro',
    driver: 'SQL Server',
    options: {
        trustedConnection: true,
        encrypt: false,
        trustServerCertificate: true
    }
};

const query = `
-- Solo insertar si las areas están vacías
IF NOT EXISTS (SELECT * FROM Areas)
BEGIN
    INSERT INTO Areas (nombre) VALUES ('Producción'), ('Mantenimiento'), ('Almacén'), ('Laboratorio');
    INSERT INTO Responsables (nombre, cargo) VALUES ('Carlos Méndez', 'Jefe de Planta'), ('Ana Ríos', 'Supervisora HSE');
    INSERT INTO TiposResiduo (nombre, peligroso) VALUES ('Residuo Orgánico', 0), ('Residuo Químico', 1), ('Plástico y Cartón', 0);
    INSERT INTO ClasificacionResiduo (descripcion) VALUES ('Reciclable'), ('No Reciclable'), ('Peligroso Especial');
    INSERT INTO EstadosResiduo (estado) VALUES ('Generado'), ('En Almacén'), ('Dispuesto');
    INSERT INTO DisposicionFinal (tipo) VALUES ('Reciclaje'), ('Incineracion'), ('Relleno Sanitario');
    INSERT INTO EmpresasGestoras (nombre, telefono) VALUES ('EcoGestión S.A.', '333-1111'), ('TransResiduos Ltda.', '333-2222');
    INSERT INTO Transporte (tipo_vehiculo, placa, id_empresa) VALUES ('Camión Compactador', 'ABC-123', 1), ('Furgón Especial', 'DEF-456', 2);
    INSERT INTO Normativas (nombre, descripcion) VALUES ('Ley 755', 'Ley de Residuos'), ('ISO 14001', 'Medio Ambiente');

    -- Insertar residuos de prueba
    INSERT INTO Residuos (id_area, id_tipo, id_clasificacion, id_estado, id_responsable, cantidad, fecha) 
    VALUES 
    (1, 1, 1, 2, 1, 150.00, GETDATE()),
    (2, 2, 3, 1, 2, 45.50, GETDATE()),
    (3, 3, 1, 3, 1, 80.00, GETDATE()),
    (4, 2, 3, 1, 2, 12.00, GETDATE());

    -- Insertar cumplimiento de prueba
    INSERT INTO Cumplimiento (id_residuo, id_normativa, cumple, fecha_revision)
    VALUES
    (1, 1, 1, GETDATE()),
    (2, 2, 0, GETDATE()),
    (3, 1, 1, GETDATE());
    
    SELECT 'Insertados' AS status;
END
ELSE
BEGIN
    SELECT 'Catalogo ya tenia datos' AS status;
END
`;

(async () => {
    try {
        console.log("Conectando a SQL Server...");
        const pool = await new sql.ConnectionPool(config).connect();
        const result = await pool.request().query(query);
        console.log("¡Datos iniciales cargados con éxito en la base de datos!", result.recordset);
        pool.close();
    } catch (err) {
        console.error("Error al inyectar datos en SQL Server:", err.message);
        require('fs').writeFileSync('error.txt', err.message);
    }
})();
