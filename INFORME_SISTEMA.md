# Informe Técnico: Sistema de Gestión de Residuos Industriales

Este documento proporciona una visión detallada de las capacidades, arquitectura y funcionalidades del sistema **GestionResiduos Pro**, diseñado para el monitoreo y control de residuos en entornos de planta industrial.

---

## 1. Descripción General
El sistema es una plataforma **Full-Stack** diseñada para digitalizar todo el ciclo de vida de los residuos industriales: desde su generación en las áreas de planta hasta su disposición final y el cumplimiento de normativas ambientales vigentes.

---

## 2. Arquitectura Tecnológica
- **Frontend**: React.js con un diseño premium personalizado (Vanilla CSS), utilizando Chart.js para visualización de datos.
- **Backend**: Node.js con Express, utilizando una arquitectura de middlewares para seguridad y auditoría.
- **Base de Datos**: SQL Server (T-SQL) para una gestión de datos robusta y empresarial.
- **Seguridad**: Autenticación basada en estados con persistencia en `localStorage` y headers de identificación en cada petición (`x-user`).

---

## 3. Niveles de Acceso y Roles
El sistema cuenta con un control de acceso basado en dos perfiles técnicos:

### A. Administrador (Admin)
- **Control Total**: Tiene permisos ilimitados sobre todos los módulos.
- **Gestión de Registros**: Puede crear, editar y **eliminar** cualquier registro de residuos, historial o cumplimiento.
- **Auditoría**: Acceso completo para supervisar quién ha realizado cambios en el sistema.

### B. Supervisor
- **Operatividad**: Puede registrar nuevos residuos y movimientos en el historial.
- **Restricción de Seguridad**: El sistema le impide eliminar registros. Si intenta borrar un dato, el sistema bloquea la acción y muestra una alerta de "Permisos Insuficientes".
- **Monitoreo**: Puede visualizar el Dashboard y reportes para la toma de decisiones.

---

## 4. Módulos del Sistema

### 📊 Dashboard (Panel de Control)
Es el centro de inteligencia del sistema. Ofrece:
- **Indicadores Clave (KPIs)**: Total de kilogramos generados, cantidad de residuos peligrosos, tasa de cumplimiento normativo y número de empresas gestoras activas.
- **Gráficas Dinámicas**: 
    - Distribución de residuos por tipo (Orgánicos, Plásticos, Químicos, etc.).
    - Comparativa de generación por áreas de planta (Producción, Almacén, Laboratorio).
    - Seguimiento de cumplimiento normativo (Cumplen vs No Cumplen).
- **Actividad Reciente**: Tabla con los últimos 5 movimientos registrados para una supervisión rápida.

### 🗑️ Gestión de Residuos
Módulo central para el inventario de residuos:
- Registro detallado: Área de origen, tipo de residuo (con alerta visual si es **Peligroso**), clasificación técnica y cantidad en kilogramos.
- Seguimiento de estados: Desde "Generado" hasta "Dispuesto Final".
- Responsables: Asignación de técnicos o jefes de planta a cada lote de residuo.

### 🚚 Historial de Disposición
Rastreo logístico del residuo:
- Registro de la salida hacia disposición final.
- Información de transporte: Placa del vehículo y tipo de unidad.
- Empresa Gestora: Asociación con la empresa especializada que recibe el residuo.

### ✅ Cumplimiento Normativo
Asegura que la planta opera bajo ley:
- Vinculación de cada residuo con normativas específicas (ej. Ley 755, ISO 14001).
- Registro de revisiones con fecha y resultado (Cumple/No Cumple).

---

## 5. Sistema de Auditoría Avanzada 🔍
Es la funcionalidad más crítica para la transparencia y seguridad del sistema.

- **Rastreo Automático**: Cada vez que un usuario inserta, edita o elimina un dato, el sistema lo registra sin necesidad de intervención manual.
- **Detalle de Cambios (Diff View)**:
    - **Antes vs Después**: En las ediciones, el sistema muestra exactamente qué valores existían antes y cuáles se guardaron nuevos.
    - **Backups de Eliminación**: Si un Administrador borra un registro, el sistema guarda una copia completa de los datos eliminados dentro del registro de auditoría.
- **Trazabilidad**: Registra la fecha exacta (segundo a segundo), el usuario que realizó la acción y la tabla afectada.

---

## 6. Diseño y Experiencia de Usuario (UX)
El sistema ha sido diseñado con una estética **"Ultra-Premium Industrial"**:
- **Modo Oscuro Profundo**: Reduce la fatiga visual en entornos de oficina de planta.
- **Glassmorphism**: Uso de transparencias y desenfoques para una interfaz moderna.
- **Optimización de Formularios**: Los campos de selección (`select`) están optimizados para evitar errores visuales y mejorar la velocidad de captura de datos.

---
**Elaborado por:** Antigravity AI Coding Assistant
**Fecha:** 1 de Abril de 2026
