# Manual Técnico — GestCom

## Versión del documento
1.0 — Julio 2026

---

## 1. Introducción

### Propósito del documento
Este manual describe la arquitectura, configuración, instalación y funcionamiento del sistema GestCom. Está dirigido a desarrolladores que se integren al proyecto, con el objetivo de reducir la curva de aprendizaje y estandarizar el conocimiento técnico.

### Descripción general del sistema
GestCom es un sistema de gestión financiera y administrativa diseñado para pequeñas empresas. En su estado actual (julio 2026) se encuentra en fase de desarrollo inicial, con un módulo de autenticación (inicio de sesión y registro de usuarios) funcional, una base de datos MySQL con tablas de usuarios, roles y perfiles, y una interfaz frontend basada en HTML y CSS estáticos.

---

## 2. Objetivo del proyecto

Desarrollar un sistema web que permita a pequeñas empresas administrar sus operaciones financieras y administrativas, comenzando por la autenticación de usuarios y evolucionando hacia módulos de productos, clientes, ventas e inventario.

---

## 3. Alcance

El proyecto se encuentra en la **Fase 1 — Autenticación**. Lo implementado actualmente incluye:

- Registro de usuarios con nombre, apellido, correo electrónico y contraseña.
- Inicio de sesión con verificación de credenciales.
- Asignación automática de rol `Cliente` al registrar.
- Separación de datos de cuenta (`usuarios`) y datos de perfil (`perfil_usuario`).
- Creación automática de perfil mediante trigger SQL al insertar un usuario.
- Pantallas frontend de login y registro (estáticas, no conectadas al backend).
- Páginas de prueba con fetch para verificar los endpoints del backend.

Lo **no implementado** aún:
- JWT / manejo de sesiones.
- Middleware de autenticación.
- Rutas protegidas.
- Dashboard privado.
- Módulos de negocio (productos, clientes, ventas, inventario).
- Pruebas automatizadas.
- Integración definitiva del frontend principal con el backend.

---

## 4. Arquitectura del sistema

### Arquitectura utilizada
Cliente-Servidor de dos capas con separación MVC en el backend.

### Patrón de diseño
El backend sigue una variación del patrón **Modelo-Vista-Controlador (MVC)**:

| Capa | Rol | Ubicación |
|------|-----|-----------|
| **Vista (View)** | Interfaz de usuario | `Frontend/` — HTML + CSS |
| **Controlador (Controller)** | Lógica de negocio y validación | `backend/controllers/` |
| **Modelo (Model)** | Acceso a datos y consultas SQL | `backend/models/` |
| **Enrutador (Router)** | Definición de rutas HTTP | `backend/routes/` |

### Diagrama explicado

```
Cliente (Navegador)
      │
      │  Petición HTTP (GET/POST)
      ▼
  ┌──────────────────────┐
  │   Express Server      │  server.js (puerto 3000)
  │   app.use(cors())     │
  │   app.use(express     │
  │      .json())         │
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │   Router             │  authRoutes.js
  │   /api/auth/*        │
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │   Controller         │  authController.js
  │   - validación       │
  │   - bcrypt hash      │
  │   - respuesta HTTP   │
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │   Model              │  usuarioModel.js
  │   - consultas SQL    │
  │   - callbacks        │
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │   MySQL Database     │  gestcom
  │   - roles            │
  │   - usuarios         │
  │   - perfil_usuario   │
  └──────────────────────┘
```

El frontend estático (`Frontend/`) aún no está conectado al backend en las páginas principales. Solo los archivos de prueba (`pruebaLogin.html`, `pruebaRegister.html`) realizan peticiones `fetch` al servidor.

---

## 5. Tecnologías utilizadas

### Frontend
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| HTML5 | — | Estructura de páginas |
| CSS3 | — | Estilos y diseño responsive |
| JavaScript (vanilla) | ES6 | Páginas de prueba con `fetch` |

### Backend
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| Node.js | 18+ (requerido) | Entorno de ejecución |
| Express | 5.2.1 | Framework HTTP |
| CommonJS | — | Sistema de módulos (`require`/`module.exports`) |

### Base de datos
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| MySQL | 8+ | Motor de base de datos relacional |
| mysql2 | 3.22.5 | Conector Node.js → MySQL |

### Librerías principales
| Librería | Versión | Propósito |
|----------|---------|-----------|
| bcrypt | 6.0.0 | Cifrado y comparación de contraseñas |
| cors | 2.8.6 | Middleware de permisos CORS |
| dotenv | 17.4.2 | Carga de variables de entorno (instalado, no implementado) |

### Herramientas
| Herramienta | Propósito |
|-------------|-----------|
| npm | Gestor de paquetes |
| Git | Control de versiones |
| MySQL CLI / Workbench | Administración de base de datos |

---

## 6. Estructura del proyecto

```
GestCom/
├── .git/
│       Repositorio Git local (historial y configuración)
│
├── .gitignore
│       Archivos ignorados: node_modules/, backend/.env, .env, AGENTS.md
│
├── package.json
│       Configuración npm. Define dependencias y scripts.
│       Tipo: commonjs. Sin script de inicio definido (npm start
│       funciona por convención de Express al ejecutar node server.js).
│
├── package-lock.json
│       Bloqueo de versiones exactas de dependencias.
│
├── README.md
│       Documentación general del proyecto.
│       Nota: menciona PostgreSQL pero el código usa MySQL.
│
├── funcionalidad_proyecto.txt
│       Resumen descriptivo de carpetas y archivos.
│
├── node_modules/
│       Dependencias instaladas (no se versiona).
│
├── backend/
│   ├── server.js
│   │       Punto de entrada del servidor Express. Puerto 3000.
│   │       Carga db.js como efecto secundario, configura CORS y
│   │       JSON body parser, monta rutas de autenticación.
│   │
│   ├── hash.js
│   │       Script auxiliar para generar un hash bcrypt de prueba.
│   │
│   ├── config/
│   │   └── db.js
│   │           Conexión a MySQL con mysql2.createConnection().
│   │           Host: localhost, User: root, Password: (vacío),
│   │           Database: gestcom. Se carga como efecto secundario
│   │           al requerirlo.
│   │
│   ├── controllers/
│   │   └── authController.js
│   │           Lógica de login y register: validaciones, bcrypt,
│   │           respuestas HTTP.
│   │
│   ├── models/
│   │   └── usuarioModel.js
│   │           Consultas SQL: buscarPorCorreo(), crearUsuario().
│   │           Usa callbacks (no promesas ni async/await).
│   │
│   └── routes/
│       └── authRoutes.js
│               Rutas montadas en /api/auth:
│               GET  /prueba   → verificación de ruta
│               POST /login    → inicio de sesión
│               POST /register → registro de usuario
│
├── Frontend/
│   ├── login.html
│   │       Página de inicio de sesión (estática, sin conexión al backend).
│   │
│   ├── register.html
│   │       Página de registro (estática, sin conexión al backend).
│   │
│   ├── pruebaLogin.html
│   │       Página de prueba de login con fetch a
│   │       http://localhost:3000/api/auth/login.
│   │
│   ├── pruebaRegister.html
│   │       Página de prueba de registro con fetch a
│   │       http://localhost:3000/api/auth/register.
│   │
│   ├── landin-page.html
│   │       Archivo reservado para landing page. Actualmente vacío.
│   │
│   ├── css/
│   │   ├── login.css
│   │   │       Estilos de la pantalla de login.
│   │   │
│   │   └── register-style.css
│   │           Estilos de la pantalla de registro (dos columnas,
│   │           panel informativo, responsive).
│   │
│   └── assets/
│       └── img/
│           ├── iconGestCom.png
│           │       Logo de GestCom usado en register.html.
│           │
│           └── Fondo-torre.webp
│                   Imagen de fondo usada en login y registro.
│
├── database/
│   └── sqlgestcom.sql
│           Script SQL que crea la base de datos gestcom, las tablas
│           roles, usuarios y perfil_usuario, inserta los roles
│           iniciales y define dos triggers.
│
└── docs/
    ├── plan-modulo-auth.md
    │       Documento de planificación del módulo de autenticación.
    │
    ├── plan-triggers-auth.md
    │       Documento de planificación de triggers SQL.
    │
    └── manual-tecnico.md
            Este documento.
```

---

## 7. Requisitos del sistema

### Software requerido

| Software | Versión mínima | Propósito |
|----------|---------------|-----------|
| Node.js | 18.x | Entorno de ejecución del backend |
| npm | 9.x | Gestor de paquetes (incluido con Node.js) |
| MySQL | 8.x | Motor de base de datos |
| Navegador web | Moderno (Chrome, Firefox, Edge) | Visualización del frontend |
| Git | Cualquiera | Control de versiones (opcional) |

---

## 8. Instalación

### Paso a paso

1. **Clonar el repositorio**

   ```bash
   git clone <url-del-repositorio>
   cd GestCom
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

   Esto instala: bcrypt, cors, dotenv, express, mysql2.

3. **Crear la base de datos**

   Asegurar que MySQL esté en ejecución. Luego ejecutar:

   ```bash
   mysql -u root < database/sqlgestcom.sql
   ```

   Este script crea la base de datos `gestcom`, las tablas `roles`, `usuarios`, `perfil_usuario`, inserta los roles iniciales (`Administrador`, `Cliente`) y crea dos triggers.

   **Nota:** Si el usuario root de MySQL tiene contraseña, usar:

   ```bash
   mysql -u root -p < database/sqlgestcom.sql
   ```

4. **Crear archivo de entorno (opcional, actualmente sin efecto)**

   ```bash
   touch backend/.env
   ```

   **Importante:** Aunque `dotenv` está instalado como dependencia, actualmente **no está cargado** en `server.js`. El archivo `.env` no tendrá efecto hasta que se agregue `require("dotenv").config()` al inicio de `server.js`. La conexión a la base de datos utiliza valores hardcodeados en `backend/config/db.js`.

5. **Iniciar el servidor**

   ```bash
   npm start
   ```

   El servidor se ejecutará en `http://localhost:3000`.

6. **Verificar que el servidor funciona**

   ```bash
   curl http://localhost:3000/
   # Respuesta esperada: "Servidor GestCom funcionando"
   ```

   ```bash
   curl http://localhost:3000/api/auth/prueba
   # Respuesta esperada: {"mensaje":"Ruta funcionando correctamente"}
   ```

7. **Probar el registro**

   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"nombre":"Juan","apellido":"Pérez","correo_usuario":"juan@example.com","password":"miPassword123"}'
   # Respuesta esperada: {"mensaje":"Usuario registrado correctamente"}
   ```

8. **Probar el inicio de sesión**

   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"correo":"juan@example.com","password":"miPassword123"}'
   # Respuesta esperada:
   # {"mensaje":"Login exitoso","usuario":{"id":1,"nombre":"Juan","apellido":"Pérez","correo":"juan@example.com","rol":2}}
   ```

---

## 9. Configuración

### Variables de entorno

| Variable | Archivo | Estado | Propósito previsto |
|----------|---------|--------|-------------------|
| Sin definir | `backend/.env` (gitignored) | **No implementado** | `dotenv` instalado pero no cargado en `server.js` |

Actualmente no hay variables de entorno en uso. El archivo `backend/.env` está en `.gitignore` como preparación para futuras variables (credenciales de base de datos, secreto JWT, etc.).

### Archivos de configuración

#### `backend/config/db.js`
Contiene la conexión a MySQL con valores fijos:

```javascript
const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "gestcom"
});
```

**Limitación detectada:** Estos valores están hardcodeados. No hay soporte para variables de entorno ni para pool de conexiones. Al cargar este archivo (como efecto secundario desde `server.js`), la conexión se establece inmediatamente.

#### `package.json`
Define el nombre del proyecto, tipo de módulo (`commonjs`), licencia (`ISC`) y las dependencias. El script `test` es un placeholder que falla:

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
}
```

No hay scripts definidos para `start`, `lint`, `typecheck` ni `build`. El comando `npm start` funciona porque npm ejecuta `node server.js` por defecto cuando no hay script `start` definido.

### Conexión a la base de datos

La conexión se establece en `backend/config/db.js` usando `mysql2.createConnection()` (no `createPool`). Esto implica:

- Conexión única, no un pool reutilizable.
- Se exporta con `module.exports` y se consume directamente en `usuarioModel.js`.
- Si la conexión falla, el servidor continúa ejecutándose pero las consultas fallarán.
- No hay reconexión automática.

---

## 10. Base de datos

### Motor utilizado
MySQL 8+ a través del conector `mysql2`.

### Nombre de la base de datos
`gestcom`

### Tablas

#### roles

| Columna | Tipo | Restricciones | Propósito |
|---------|------|---------------|-----------|
| `id` | INT | AUTO_INCREMENT, PRIMARY KEY | Identificador único del rol |
| `nombre` | VARCHAR(30) | NOT NULL, UNIQUE | Nombre del rol |

**Datos iniciales insertados por el script SQL:**

| id | nombre |
|----|--------|
| 1 | Administrador |
| 2 | Cliente |

**Propósito:** Catálogo de roles del sistema. Determina el nivel de acceso de cada usuario.

---

#### usuarios

| Columna | Tipo | Restricciones | Propósito |
|---------|------|---------------|-----------|
| `id` | INT | AUTO_INCREMENT, PRIMARY KEY | Identificador único del usuario |
| `nombre` | VARCHAR(50) | NOT NULL | Nombre del usuario |
| `apellido` | VARCHAR(50) | NOT NULL | Apellido del usuario |
| `fecha_registro` | DATE | NOT NULL | Fecha en que se creó la cuenta |
| `correo_usuario` | VARCHAR(100) | NOT NULL, UNIQUE | Correo electrónico (identificador de cuenta) |
| `password` | VARCHAR(255) | NOT NULL | Hash bcrypt de la contraseña |
| `estado` | CHAR(1) | NOT NULL, CHECK ('A', 'I') | Estado de la cuenta: A=Activo, I=Inactivo |
| `id_rol` | INT | NOT NULL, FOREIGN KEY → roles(id) | Rol asignado al usuario |

**Propósito:** Almacena los datos de la cuenta de acceso al sistema. Es la tabla principal para autenticación.

---

#### perfil_usuario

| Columna | Tipo | Restricciones | Propósito |
|---------|------|---------------|-----------|
| `id` | INT | AUTO_INCREMENT, PRIMARY KEY | Identificador único del perfil |
| `id_usuario` | INT | NOT NULL, UNIQUE, FOREIGN KEY → usuarios(id) | Relación 1:1 con el usuario |
| `fecha_nacimiento` | DATE | NULL | Fecha de nacimiento del usuario |
| `numero_telefonico` | VARCHAR(15) | NULL | Número de teléfono de contacto |
| `nacionalidad` | VARCHAR(30) | NULL | Nacionalidad del usuario |
| `genero` | CHAR(1) | NULL, CHECK ('M', 'F', 'O') | Género del usuario |
| `fecha_actualizacion` | DATETIME | NULL | Fecha y hora de la última modificación del perfil |

**Propósito:** Almacena datos personales complementarios del usuario. Se crea automáticamente mediante un trigger al registrar un usuario. Los campos adicionales (fecha_nacimiento, teléfono, nacionalidad, género) se completarán en una fase futura desde una sección "Mi Perfil".

---

### Relaciones

```
roles (1) ────< (N) usuarios
     Un rol puede tener muchos usuarios.
     Un usuario tiene exactamente un rol.

usuarios (1) ──── (1) perfil_usuario
     Un usuario tiene exactamente un perfil.
     Un perfil pertenece exactamente a un usuario.
     Relación garantizada por UNIQUE en perfil_usuario.id_usuario
     y por el trigger AFTER INSERT.
```

### Triggers

#### `trg_usuarios_after_insert_crear_perfil`
- **Tipo:** AFTER INSERT ON usuarios
- **Propósito:** Crea automáticamente un registro en `perfil_usuario` con el `id` del nuevo usuario, garantizando que todo usuario tenga un perfil asociado.
- **Código:**
  ```sql
  CREATE TRIGGER trg_usuarios_after_insert_crear_perfil
  AFTER INSERT ON usuarios
  FOR EACH ROW
  BEGIN
      INSERT INTO perfil_usuario (id_usuario)
      VALUES (NEW.id);
  END;
  ```

#### `trg_perfil_usuario_before_update_fecha`
- **Tipo:** BEFORE UPDATE ON perfil_usuario
- **Propósito:** Actualiza automáticamente `fecha_actualizacion` con la fecha y hora actual antes de cada modificación del perfil, proporcionando trazabilidad sin depender del backend.
- **Código:**
  ```sql
  CREATE TRIGGER trg_perfil_usuario_before_update_fecha
  BEFORE UPDATE ON perfil_usuario
  FOR EACH ROW
  BEGIN
      SET NEW.fecha_actualizacion = NOW();
  END;
  ```

---

## 11. Arquitectura Backend

### Punto de entrada: `backend/server.js`

```javascript
require("./config/db");        // Conexión a MySQL (efecto secundario)
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());               // Permite peticiones de cualquier origen
app.use(express.json());      // Parseo de JSON en el body
app.get("/", (req, res) => { res.send("Servidor GestCom funcionando"); });
app.use("/api/auth", authRoutes);

app.listen(3000, () => {
    console.log("Servidor ejecutándose en puerto 3000");
});
```

**Nota:** No se carga `dotenv`. No hay middleware de autenticación, manejo de errores global ni logging estructurado.

### Rutas

Archivo: `backend/routes/authRoutes.js`

| Método | Ruta | Controlador | Descripción |
|--------|------|-------------|-------------|
| GET | `/api/auth/prueba` | Inline | Verifica que el router funciona. Responde `{"mensaje":"Ruta funcionando correctamente"}` |
| POST | `/api/auth/login` | `login` | Autentica usuario por correo y contraseña |
| POST | `/api/auth/register` | `register` | Crea un nuevo usuario |

### Controladores

Archivo: `backend/controllers/authController.js`

#### `login(req, res)`
1. Extrae `correo` y `password` del body.
2. Llama a `Usuario.buscarPorCorreo(correo, callback)`.
3. Si hay error del servidor → `500`.
4. Si no encuentra usuario → `404`.
5. Compara contraseña con `bcrypt.compare()`.
6. Si no coincide → `401`.
7. Si coincide → `200` con datos del usuario (`id`, `nombre`, `apellido`, `correo`, `rol`).

#### `register(req, res)`
1. Extrae `nombre`, `apellido`, `correo_usuario`, `password` del body.
2. Valida campos obligatorios → `400`.
3. Valida formato de correo (regex `/^\S+@\S+\.\S+$/`) → `400`.
4. Valida longitud mínima de contraseña (8 caracteres) → `400`.
5. Verifica si el correo ya existe (`buscarPorCorreo`) → `400`.
6. Genera hash bcrypt con 10 salt rounds.
7. Llama a `Usuario.crearUsuario(nuevoUsuario, callback)`.
8. Si hay error → `500`.
9. Si se crea correctamente → `201`.

### Modelos

Archivo: `backend/models/usuarioModel.js`

#### `buscarPorCorreo(correo, callback)`
- SQL: `SELECT * FROM usuarios WHERE correo_usuario = ?`
- Usa parámetros preparados (protección contra SQL injection).
- Devuelve resultados mediante callback (estilo Node.js clásico).

#### `crearUsuario(usuario, callback)`
- SQL:
  ```sql
  INSERT INTO usuarios
      (nombre, apellido, fecha_registro, correo_usuario, password, estado, id_rol)
  VALUES (?, ?, CURDATE(), ?, ?, ?,
      (SELECT id FROM roles WHERE nombre = ? LIMIT 1))
  ```
- Asigna `fecha_registro` con `CURDATE()`.
- Asigna `id_rol` mediante subconsulta a la tabla `roles` por nombre de rol.
- Usa parámetros preparados.

### Middleware

**No implementado actualmente.** No hay middleware de autenticación, autorización, logging, manejo de errores ni limitación de tasa.

### Autenticación

**Esquema actual:**
- Sin JWT.
- Sin sesiones.
- Sin cookies.
- Sin tokens.
- El login devuelve los datos del usuario en texto plano como JSON.
- No hay estado de sesión en el servidor.
- No hay rutas protegidas.

### Flujo de peticiones

```
Cliente → Express (CORS, JSON parser) → Router (/api/auth)
  → Controlador (validación + bcrypt) → Modelo (SQL con callbacks)
  → MySQL → Respuesta JSON
```

---

## 12. Arquitectura Frontend

### Descripción general
El frontend está compuesto por páginas HTML estáticas con estilos CSS. No utiliza frameworks, librerías de componentes, enrutamiento del lado del cliente ni sistema de build.

### Vistas

| Archivo | Propósito | Conectado al backend |
|---------|-----------|----------------------|
| `login.html` | Interfaz de inicio de sesión con formulario (correo + contraseña) | **No** — estática |
| `register.html` | Interfaz de registro con campos: nombre, apellido, correo, contraseña, confirmar contraseña | **No** — estática |
| `pruebaLogin.html` | Prueba manual del endpoint POST /api/auth/login usando fetch | **Sí** |
| `pruebaRegister.html` | Prueba manual del endpoint POST /api/auth/register usando fetch | **Sí** |
| `landin-page.html` | Reservado para landing page | **Vacío** |

### Comunicación con el backend

Las páginas principales (`login.html`, `register.html`) son **estáticas**: no contienen JavaScript que realice peticiones al backend. Esto significa que actualmente:

- El usuario puede llenar el formulario de login/register.
- Al enviar, el navegador intenta hacer un envío tradicional del formulario (no hay `fetch` ni `XMLHttpRequest`).
- Las rutas de acción en los formularios no están definidas para apuntar al backend.

Las páginas de prueba (`pruebaLogin.html`, `pruebaRegister.html`) sí incluyen JavaScript con `fetch` para comunicarse con `http://localhost:3000/api/auth/login` y `http://localhost:3000/api/auth/register` respectivamente.

### CSS

| Archivo | Propósito |
|---------|-----------|
| `css/login.css` | Estilos del formulario de login (fondo, inputs, botón, responsive) |
| `css/register-style.css` | Estilos del registro (diseño de dos columnas, panel informativo, responsive) |

### Assets

| Archivo | Propósito |
|---------|-----------|
| `assets/img/iconGestCom.png` | Logo del sistema |
| `assets/img/Fondo-torre.webp` | Imagen de fondo para login y registro |

---

## 13. Módulos del sistema

### Módulo de Autenticación

#### Objetivo
Permitir que los usuarios se registren en el sistema e inicien sesión con sus credenciales.

#### Funcionalidades implementadas
1. **Registro de usuario:** Crea una cuenta con nombre, apellido, correo y contraseña. Asigna rol `Cliente` por defecto. Crea perfil automáticamente mediante trigger SQL.
2. **Inicio de sesión:** Verifica correo y contraseña. Devuelve datos básicos del usuario en JSON.

#### Archivos involucrados

| Archivo | Rol en el módulo |
|---------|------------------|
| `backend/server.js` | Inicializa servidor y monta rutas |
| `backend/routes/authRoutes.js` | Define endpoints del módulo |
| `backend/controllers/authController.js` | Lógica de registro e inicio de sesión |
| `backend/models/usuarioModel.js` | Consultas SQL para usuarios |
| `backend/config/db.js` | Conexión a la base de datos |
| `database/sqlgestcom.sql` | Esquema de base de datos y triggers |
| `Frontend/login.html` | Interfaz de inicio de sesión (estática) |
| `Frontend/register.html` | Interfaz de registro (estática) |
| `Frontend/pruebaLogin.html` | Prueba de login con fetch |
| `Frontend/pruebaRegister.html` | Prueba de registro con fetch |
| `Frontend/css/login.css` | Estilos de login |
| `Frontend/css/register-style.css` | Estilos de registro |

#### Interacción con otros módulos
Actualmente no hay otros módulos implementados. El módulo de autenticación es independiente y no se comunica con otros componentes del sistema.

---

## 14. Seguridad

### Medidas implementadas

#### Cifrado de contraseñas
- Se utiliza `bcrypt` con 10 salt rounds para el hash de contraseñas.
- La comparación se realiza con `bcrypt.compare()`.
- Las contraseñas en texto plano nunca se almacenan ni se devuelven en respuestas.

#### Validaciones en registro
- **Campos obligatorios:** `nombre`, `apellido`, `correo_usuario`, `password`. Si falta alguno → `400`.
- **Formato de correo:** Validación con regex `/^\S+@\S+\.\S+$/` → `400`.
- **Longitud de contraseña:** Mínimo 8 caracteres → `400`.
- **Correo duplicado:** Verificación previa con `buscarPorCorreo()` → `400`.

#### Prevención de SQL injection
- Todas las consultas SQL utilizan **parámetros preparados** (`?` placeholders) proporcionados por `mysql2`.

#### CORS
- Habilitado sin restricciones: `app.use(cors())` permite peticiones de cualquier origen.

### Medidas no implementadas

| Medida | Estado |
|--------|--------|
| JWT (JSON Web Tokens) | No implementado |
| Sesiones del lado del servidor | No implementado |
| Middleware de autenticación | No implementado |
| Rutas protegidas | No implementado |
| HTTPS | No configurado |
| Rate limiting | No implementado |
| Validación del lado del frontend | No implementado en páginas principales |
| Sanitización de entradas (XSS) | Solo parámetros preparados |
| Manejo seguro de contraseñas en el frontend | No implementado |
| Logging de acceso o intentos fallidos | No implementado |
| Bloqueo de cuentas por intentos fallidos | No implementado |

---

## 15. Flujo general del sistema

### Flujo de registro

```
1. Usuario completa formulario en register.html (estático)
         │
2. (Actualmente: sin conexión)
   Previsto: fetch POST /api/auth/register
         │
3. Express recibe la petición
   ├── cors()               → headers CORS
   └── express.json()       → parseo del body
         │
4. Router authRoutes.js
   └── POST /register → authController.register()
         │
5. authController.register()
   ├── Validar campos obligatorios
   ├── Validar formato de correo
   ├── Validar longitud de contraseña (>=8)
   ├── Verificar correo duplicado (buscarPorCorreo)
   ├── Generar hash bcrypt (salt rounds = 10)
   └── Llamar a usuarioModel.crearUsuario()
         │
6. usuarioModel.crearUsuario()
   └── INSERT INTO usuarios (nombre, apellido, fecha_registro=CURDATE(),
       correo_usuario, password=hash, estado='A', id_rol=subselect roles)
         │
7. MySQL ejecuta la inserción
   └── Trigger AFTER INSERT → INSERT INTO perfil_usuario (id_usuario)
         │
8. Respuesta: 201 { "mensaje": "Usuario registrado correctamente" }
```

### Flujo de inicio de sesión

```
1. Usuario completa formulario en login.html (estático)
         │
2. (Actualmente: sin conexión)
   Previsto: fetch POST /api/auth/login
         │
3. Express recibe la petición (CORS + JSON parser)
         │
4. Router authRoutes.js
   └── POST /login → authController.login()
         │
5. authController.login()
   ├── Extraer correo y password del body
   ├── Buscar usuario por correo (buscarPorCorreo)
   ├── Si no existe → 404
   ├── Comparar password con bcrypt.compare()
   ├── Si no coincide → 401
   └── Si coincide → 200 con datos del usuario
         │
6. Respuesta: 200 { "mensaje": "Login exitoso",
       "usuario": { id, nombre, apellido, correo, rol } }
```

---

## 16. Dependencias

### Dependencias de producción

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| bcrypt | ^6.0.0 | Cifrado y verificación de contraseñas con algoritmo bcrypt |
| cors | ^2.8.6 | Middleware para permitir peticiones entre distintos orígenes (CORS) |
| dotenv | ^17.4.2 | Carga de variables de entorno desde archivo `.env` (instalado, no implementado) |
| express | ^5.2.1 | Framework web para Node.js. Manejo de rutas, middleware y peticiones HTTP |
| mysql2 | ^3.22.5 | Conector nativo de MySQL para Node.js con soporte de parámetros preparados |

### Versiones de Node.js y npm

No especificadas en `package.json`. El proyecto usa sintaxis CommonJS compatible con Node.js 18+.

---

## 17. Convenciones del proyecto

### Nomenclatura de archivos

| Ubicación | Convención | Ejemplos |
|-----------|-----------|----------|
| `backend/` | camelCase | `server.js`, `authRoutes.js`, `authController.js`, `usuarioModel.js`, `db.js` |
| `Frontend/` | kebab-case / lowercase | `login.html`, `register.html`, `pruebaLogin.html`, `login.css`, `register-style.css` |
| `database/` | prefijo `sql` + nombre | `sqlgestcom.sql` |
| `docs/` | kebab-case | `plan-modulo-auth.md`, `plan-triggers-auth.md`, `manual-tecnico.md` |

### Organización del backend

- **Separación por capas:** routes → controllers → models → db.
- Cada archivo tiene una única responsabilidad.
- Los controladores importan modelos, los modelos importan la conexión de base de datos.
- Uso de `require()` y `module.exports` (CommonJS).

### Estilo de código

- **Callbacks asíncronos:** El modelo usa callbacks estilo Node.js `(error, resultados)`. No hay promesas ni async/await en las consultas SQL.
- **Español:** Mensajes de respuesta JSON, nombres de tablas y documentación están en español.
- **Punto y coma:** Se usa punto y coma al final de cada sentencia.
- **Comillas:** Se usan comillas dobles para strings y backticks para template literals.

### Buenas prácticas observadas

- Uso de parámetros preparados en consultas SQL (protección contra SQL injection).
- Separación de responsabilidades (rutas, controladores, modelos).
- Validación de entrada en el controlador antes de llegar al modelo.
- Uso de bcrypt para hash de contraseñas.
- Archivo `.gitignore` configurado para excluir `node_modules/`, `.env` y `AGENTS.md`.

---

## 18. Despliegue

### Opción 1: Servidor VPS tradicional

**Requisitos:**
- Servidor con Node.js 18+ y MySQL 8+.
- Acceso SSH.

**Pasos:**
1. Clonar el repositorio en el servidor.
2. Instalar dependencias: `npm install`.
3. Configurar MySQL y ejecutar el script SQL.
4. Crear archivo `backend/.env` con credenciales de base de datos.
5. Implementar carga de `dotenv` en `server.js` (actualmente no está cargado).
6. Configurar variable `NODE_ENV=production`.
7. Usar un gestor de procesos como **PM2**:
   ```bash
   npm install -g pm2
   pm2 start backend/server.js --name gestcom
   ```
8. Configurar Nginx como proxy reverso para servir en puerto 80/443 con HTTPS.
9. Configurar firewall y SSL (certbot / Let's Encrypt).

### Opción 2: Plataforma cloud (Railway, Render, Fly.io, etc.)

**Consideraciones:**
- La base de datos MySQL debe estar en un servicio externo (PlanetScale, Railway MySQL, Aiven, etc.).
- El archivo `db.js` debe modificarse para leer credenciales desde variables de entorno.
- `dotenv` debe cargarse en `server.js`.
- La plataforma manejará SSL, dominio y logs.

### Opción 3: Docker (configuración no implementada)

Actualmente no hay `Dockerfile` ni `docker-compose.yml`. Sería necesario crearlos.

### Estado actual del despliegue

El proyecto **no está desplegado** en ningún entorno de producción o staging. Se ejecuta únicamente en entorno de desarrollo local.

---

## 19. Mantenimiento

### Recomendaciones para futuros desarrolladores

1. **Cargar dotenv en server.js**
   Agregar `require("dotenv").config()` al inicio de `backend/server.js` y migrar las credenciales de `db.js` a variables de entorno.

2. **Migrar a pool de conexiones**
   Reemplazar `mysql.createConnection()` por `mysql.createPool()` para manejar múltiples conexiones concurrentes y reconexión automática.

3. **Migrar a promesas o async/await**
   El modelo actual usa callbacks. Migrar a promesas (con `mysql2/promise`) o async/await mejora la legibilidad y el manejo de errores.

4. **Agregar manejador de errores global**
   Implementar middleware de Express para capturar errores no manejados y devolver respuestas consistentes.

5. **Conectar el frontend principal**
   Implementar `fetch` en `login.html` y `register.html` para que envíen datos al backend.

6. **Implementar JWT y middleware de autenticación**
   Para proteger las rutas futuras del dashboard y módulos de negocio.

7. **Agregar logging estructurado**
   Usar `morgan` (HTTP requests) y `winston` o `pino` (logs de aplicación).

8. **Estandarizar respuestas HTTP**
   Crear un formato de respuesta uniforme para éxito y error.

9. **Validar request body con un esquema**
   Implementar `express-validator` o `joi` para validación declarativa.

10. **Agregar pruebas automatizadas**
    Iniciar con tests unitarios (Jest o Mocha) para los controladores y modelos.

---

## 20. Problemas conocidos

### Críticos

| Problema | Descripción | Impacto |
|----------|-------------|---------|
| Credenciales hardcodeadas | `db.js` tiene usuario root sin contraseña en texto plano | Riesgo de seguridad en cualquier entorno compartido |
| Conexión sin pool | `createConnection` no maneja reconexión ni múltiples conexiones | Puede fallar bajo concurrencia |
| dotenv no cargado | La dependencia está instalada pero `server.js` no la requiere | Las variables de entorno no tienen efecto |

### Moderados

| Problema | Descripción |
|----------|-------------|
| Sin middleware de errores | Los errores no capturados pueden colgar el servidor o devolver HTML por defecto |
| Frontend principal desconectado | `login.html` y `register.html` no envían datos al backend |
| Sin JWT ni sesión | No hay forma de mantener la sesión del usuario entre peticiones |
| Logging ausente | No hay registro de peticiones ni errores |

### Leves

| Problema | Descripción |
|----------|-------------|
| README desactualizado | Menciona PostgreSQL, el código usa MySQL |
| Script `test` placeholder | `npm test` falla, no hay suite de pruebas |
| `landin-page.html` vacío | Archivo creado sin contenido |
| Sin linter/formateador | El estilo de código depende del criterio del desarrollador |

---

## 21. Mejoras futuras

Basadas en el estado actual del código y en la planificación del proyecto.

### Prioridad alta

1. **Implementar JWT** — Generar token en login, validar en middleware para rutas protegidas.
2. **Conectar frontend principal** — Agregar fetch a `login.html` y `register.html`.
3. **Cargar dotenv** — Requerir dotenv en `server.js` y migrar credenciales a `.env`.
4. **Migrar a pool de conexiones** — Reemplazar `createConnection` por `createPool`.

### Prioridad media

5. **Middleware de autenticación** — Verificar JWT en rutas protegidas.
6. **Dashboard privado** — Página protegida post-login.
7. **Sección "Mi Perfil"** — Edición de datos personales del perfil.
8. **Módulo de productos** — CRUD de productos.
9. **Módulo de clientes** — Gestión de clientes.
10. **Módulo de ventas** — Registro de ventas.

### Prioridad baja

11. **Módulo de inventario** — Control de stock.
12. **Roles y permisos avanzados** — Autorización basada en roles (RBAC).
13. **Pruebas automatizadas** — Jest para backend, pruebas de integración.
14. **Linter y formateador** — ESLint + Prettier.
15. **Despliegue con Docker** — Dockerfile y docker-compose.
16. **HTTPS y rate limiting** — Seguridad en producción.
17. **Auditoría de acciones** — Tabla de logs de actividades.

---

## 22. Conclusiones

GestCom es un proyecto en fase temprana de desarrollo que cuenta con una base sólida para el módulo de autenticación. La arquitectura backend sigue el patrón MVC con Express 5 y MySQL, con un frontend HTML/CSS estático preparado para integrarse.

Las fortalezas actuales del proyecto incluyen:
- Separación clara de responsabilidades en el backend (rutas, controladores, modelos).
- Uso de parámetros preparados para prevenir SQL injection.
- Cifrado correcto de contraseñas con bcrypt.
- Esquema de base de datos bien diseñado con separación entre datos de cuenta y datos de perfil.
- Triggers SQL que automatizan la creación de perfiles y la actualización de fechas.
- Documentación del código en español, facilitando el mantenimiento por equipos hispanohablantes.

Las debilidades principales que requieren atención inmediata son:
- Conexión a base de datos hardcodeada sin pool de conexiones.
- `dotenv` instalado pero no cargado.
- Ausencia de JWT, sesiones o cualquier mecanismo de estado de autenticación.
- Frontend principal desconectado del backend.
- Sin pruebas automatizadas, linter, logging ni manejo de errores global.

El proyecto está correctamente encaminado pero requiere completar las fases de seguridad y middleware antes de abordar los módulos de negocio.
