# Sistema de Gestión de Residuos

Este proyecto es una aplicación Full-Stack para la gestión integral de residuos. Cuenta con un **Backend en Node.js (Express)** conectado a **SQL Server** y un **Frontend en React**.

## Requisitos Previos

Asegúrate de tener instalados los siguientes programas antes de comenzar:
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (Versión 16 o superior recomendada)
- **SQL Server** (Developer o Express) y SQL Server Management Studio (SSMS) o Azure Data Studio.

---

## 🚀 Guía de Instalación y Ejecución

Sigue estos pasos en orden para levantar el proyecto en tu máquina local.

### 1. Clonar el repositorio

Abre tu terminal y ejecuta el siguiente comando para descargar el código:

```bash
git clone https://github.com/Luisrene12/gestion-de-residuos.git
cd gestion-de-residuos
```

### 2. Configuración de la Base de Datos (SQL Server)

1. Abre **SQL Server Management Studio (SSMS)** y conéctate a tu servidor local.
2. Crea una nueva base de datos llamada `GestionResiduosPro`. Puedes hacerlo visualmente o ejecutando el siguiente comando:
   ```sql
   CREATE DATABASE GestionResiduosPro;
   GO
   ```
3. Abre el archivo `backend/schema.sql` que viene en el proyecto, copia todo su contenido y ejecútalo sobre la base de datos `GestionResiduosPro` recién creada para generar las tablas y vistas.

### 3. Configuración y Ejecución del Backend

El backend es nuestra API que se conecta a la base de datos. Se ejecutará en el puerto 5000.

1. Abre una nueva ventana de terminal y navega a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias necesarias de Node:
   ```bash
   npm install
   ```
3. **Paso Crucial:** Crea un archivo llamado `.env` dentro de la carpeta `backend` (al mismo nivel que `package.json`). Agrega el siguiente contenido (ajusta el nombre de tu servidor SQL si es diferente a `localhost`):
   ```env
   PORT=5000
   DB_SERVER=localhost
   DB_NAME=GestionResiduosPro
   ```
   *(Nota: La aplicación está configurada para autenticarse en SQL Server usando Windows Authentication. Asegúrate de que tu usuario de Windows tenga acceso a la base de datos).*
4. Inicia el servidor:
   ```bash
   npm start
   ```
   Si todo está correcto, verás un mensaje en consola diciendo: `Connected to SQL Server via Windows Authentication.` y `Server running on port 5000`.

### 4. Configuración y Ejecución del Frontend

El frontend es la interfaz de usuario en React. Se ejecutará en el puerto 3000.

1. Abre otra ventana de terminal (no cierres la del backend) y navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
3. Inicia la aplicación:
   ```bash
   npm start
   ```
   Se abrirá una pestaña automáticamente en tu navegador en `http://localhost:3000`. Desde ahí podrás probar el sistema conectado a la base de datos.

---

## Estructura del Proyecto
* `/backend`: Código del servidor (Express.js), conexión a base de datos (mssql), queries y variables de entorno.
* `/frontend`: Código de la interfaz de usuario de React (Vistas, componentes y diseño).
