-- Schema para el Sistema de Gestión de Residuos Industriales (SQL Server T-SQL)

-- Catálogos
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='areas')
CREATE TABLE areas (
    id_area INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(255) NOT NULL
);
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='responsables')
CREATE TABLE responsables (
    id_responsable INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(255) NOT NULL,
    cargo NVARCHAR(255)
);
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='tipos_residuo')
CREATE TABLE tipos_residuo (
    id_tipo INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(255) NOT NULL,
    peligroso BIT DEFAULT 0
);
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='clasificaciones')
CREATE TABLE clasificaciones (
    id_clasificacion INT IDENTITY(1,1) PRIMARY KEY,
    descripcion NVARCHAR(255) NOT NULL
);
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='estados')
CREATE TABLE estados (
    id_estado INT IDENTITY(1,1) PRIMARY KEY,
    estado NVARCHAR(255) NOT NULL
);
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='disposiciones')
CREATE TABLE disposiciones (
    id_disposicion INT IDENTITY(1,1) PRIMARY KEY,
    tipo NVARCHAR(255) NOT NULL CHECK (tipo IN ('Reciclaje', 'Incineracion', 'Relleno Sanitario', 'Reutilizacion'))
);
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='empresas')
CREATE TABLE empresas (
    id_empresa INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(255) NOT NULL,
    telefono NVARCHAR(255)
);
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='transportes')
CREATE TABLE transportes (
    id_transporte INT IDENTITY(1,1) PRIMARY KEY,
    tipo_vehiculo NVARCHAR(255) NOT NULL,
    placa NVARCHAR(255) NOT NULL,
    id_empresa INT FOREIGN KEY REFERENCES empresas(id_empresa)
);
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='normativas')
CREATE TABLE normativas (
    id_normativa INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(255) NOT NULL,
    descripcion NVARCHAR(MAX)
);
GO

-- Tabla Principal de Residuos
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='residuos')
CREATE TABLE residuos (
    id_residuo INT IDENTITY(1,1) PRIMARY KEY,
    id_area INT FOREIGN KEY REFERENCES areas(id_area),
    id_tipo INT FOREIGN KEY REFERENCES tipos_residuo(id_tipo),
    id_clasificacion INT FOREIGN KEY REFERENCES clasificaciones(id_clasificacion),
    id_estado INT FOREIGN KEY REFERENCES estados(id_estado),
    id_responsable INT FOREIGN KEY REFERENCES responsables(id_responsable),
    cantidad FLOAT NOT NULL,
    fecha DATE DEFAULT CAST(GETDATE() AS DATE)
);
GO

-- Historial de Disposición
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='historial_disposicion')
CREATE TABLE historial_disposicion (
    id_historial INT IDENTITY(1,1) PRIMARY KEY,
    id_residuo INT FOREIGN KEY REFERENCES residuos(id_residuo),
    id_disposicion INT FOREIGN KEY REFERENCES disposiciones(id_disposicion),
    id_transporte INT FOREIGN KEY REFERENCES transportes(id_transporte),
    fecha DATE DEFAULT CAST(GETDATE() AS DATE)
);
GO

-- Cumplimiento Normativo
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='cumplimiento')
CREATE TABLE cumplimiento (
    id_cumplimiento INT IDENTITY(1,1) PRIMARY KEY,
    id_residuo INT FOREIGN KEY REFERENCES residuos(id_residuo),
    id_normativa INT FOREIGN KEY REFERENCES normativas(id_normativa),
    cumple BIT DEFAULT 1,
    fecha_revision DATE DEFAULT CAST(GETDATE() AS DATE)
);
GO

-- Usuarios del Sistema
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='usuarios')
CREATE TABLE usuarios (
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    rol NVARCHAR(50) DEFAULT 'Usuario',
    estado BIT DEFAULT 1,
    fecha_creacion DATETIME DEFAULT GETDATE()
);
GO

-- Auditoría
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='auditoria')
CREATE TABLE auditoria (
    id_auditoria INT IDENTITY(1,1) PRIMARY KEY,
    tabla NVARCHAR(255),
    accion NVARCHAR(255),
    usuario NVARCHAR(255),
    fecha DATETIME DEFAULT GETDATE()
);
GO

-- VISTAS
CREATE OR ALTER VIEW v_resumen_tipo AS
SELECT t.nombre AS tipo, SUM(r.cantidad) AS total_kg, COUNT(r.id_residuo) AS cantidad_registros
FROM residuos r
JOIN tipos_residuo t ON r.id_tipo = t.id_tipo
GROUP BY t.nombre;
GO

CREATE OR ALTER VIEW v_resumen_periodo AS
SELECT FORMAT(fecha, 'yyyy-MM') AS periodo, SUM(cantidad) AS total_kg
FROM residuos
GROUP BY FORMAT(fecha, 'yyyy-MM');
GO

CREATE OR ALTER VIEW v_resumen_area AS
SELECT a.nombre AS area, SUM(r.cantidad) AS total_kg
FROM residuos r
JOIN areas a ON r.id_area = a.id_area
GROUP BY a.nombre;
GO

CREATE OR ALTER VIEW v_resumen_cumplimiento AS
SELECT n.nombre, COUNT(*) as total, SUM(CASE WHEN c.cumple = 1 THEN 1 ELSE 0 END) as cumplen, SUM(CASE WHEN c.cumple = 0 THEN 1 ELSE 0 END) as no_cumplen
FROM cumplimiento c
JOIN normativas n ON c.id_normativa = n.id_normativa
GROUP BY n.nombre;
GO

-- DATOS INICIALES (Sólo si las tablas están vacías)
IF NOT EXISTS (SELECT * FROM areas)
BEGIN
    INSERT INTO areas (nombre) VALUES ('Producción'), ('Mantenimiento'), ('Almacén'), ('Laboratorio'), ('Oficinas');
    INSERT INTO responsables (nombre, cargo) VALUES ('Carlos Méndez', 'Jefe de Planta'), ('Ana Ríos', 'Supervisora HSE'), ('Jorge Vargas', 'Técnico Ambiental'), ('Lucía Pinto', 'Coordinadora Logística');
    INSERT INTO tipos_residuo (nombre, peligroso) VALUES ('Residuo Orgánico', 0), ('Residuo Plástico', 0), ('Residuo Metálico', 0), ('Residuo Químico', 1), ('Residuo Electrónico', 1), ('Residuo Biológico', 1);
    INSERT INTO clasificaciones (descripcion) VALUES ('Reciclable'), ('No Reciclable'), ('Peligroso Especial'), ('Inerte');
    INSERT INTO estados (estado) VALUES ('Generado'), ('En Almacén'), ('En Transporte'), ('Dispuesto'), ('En Proceso');
    INSERT INTO disposiciones (tipo) VALUES ('Reciclaje'), ('Incineracion'), ('Relleno Sanitario'), ('Reutilizacion');
    INSERT INTO empresas (nombre, telefono) VALUES ('EcoGestión S.A.', '+591 3 333-1111'), ('Reciclados del Este', '+591 3 333-2222'), ('TransResiduos Ltda.', '+591 3 333-3333');
    INSERT INTO transportes (tipo_vehiculo, placa, id_empresa) VALUES ('Camión Compactador', 'ABC-1234', 1), ('Camión Cisterna', 'DEF-5678', 2), ('Furgón Especializado', 'GHI-9012', 3);
    INSERT INTO normativas (nombre, descripcion) VALUES ('Ley 755 Bolivia', 'Gestión Integral de Residuos Sólidos'), ('ISO 14001:2015', 'Sistemas de Gestión Ambiental'), ('Decreto 2954', 'Manejo de Residuos Peligrosos'), ('NB 69007', 'Norma Boliviana Residuos Hospitalarios');
    
    INSERT INTO residuos (id_area, id_tipo, id_clasificacion, id_estado, id_responsable, cantidad, fecha) VALUES 
    (1, 1, 1, 4, 1, 120.50, '2025-03-01'),
    (2, 4, 3, 2, 2, 45.00,  '2025-03-05'),
    (3, 2, 1, 3, 3, 88.75,  '2025-03-08'),
    (4, 6, 3, 1, 2, 12.30,  '2025-03-10'),
    (1, 3, 1, 4, 4, 200.00, '2025-03-12'),
    (5, 5, 3, 2, 1, 5.20,   '2025-03-15'),
    (2, 1, 2, 5, 3, 67.80,  '2025-03-18'),
    (3, 4, 3, 1, 2, 30.00,  '2025-03-20');
END
GO

-- Inicialización de Usuarios (Contraseñas en texto plano solo para probar, en prod usar bcrypt)
IF NOT EXISTS (SELECT * FROM usuarios)
BEGIN
    INSERT INTO usuarios (nombre, email, password, rol) VALUES 
    ('Luis René García', 'lrene@empresa.com', 'luis123', 'Administrador'),
    ('María Fernanda López', 'mlopez@empresa.com', 'maria123', 'Supervisor');
END
GO
