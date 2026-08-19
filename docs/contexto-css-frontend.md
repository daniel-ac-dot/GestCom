# Contexto CSS del Frontend — GestCom

## Propósito

Documento de referencia para generar las vistas nuevas (dashboard, ventas, productos, inventario, compras, proveedores, reportes) y su CSS, de forma que el resultado se integre con el diseño ya existente de GestCom. Está pensado para consumirse como contexto por una IA de generación de código (Claude) o por cualquier desarrollador.

## Estado actual del frontend

- Frontend actual en carpeta `Frontend/`, plano (sin subcarpetas de páginas), con páginas estáticas.
- Existen **dos lenguajes de diseño** que conviven:
  1. **Tema oscuro (marketing/landing)** — `Frontend/css/landingpage-rebuild.css`.
  2. **Tema claro (autenticación)** — `Frontend/css/login.css` y `Frontend/css/register.css`.
- Los formularios principales (`login.html`, `register.html`) son estáticos y **no** están conectados al backend.

**Decisión tomada:** los módulos internos del sistema (dashboard y módulos de negocio) usarán el **tema oscuro** como rector, basado en la paleta de la landing. El tema claro queda solo para las páginas de autenticación.

---

## 1. Tokens del tema oscuro (TEMA RECTOR - usarlos en global.css)

Variables definidas en `:root` (extraídas de `landingpage-rebuild.css`):

| Variable | Valor | Uso |
|---|---|---|
| `--bg-dark` | `#0a0f1e` | Fondo general del body |
| `--bg-card` | `#112240` | Superficies: tarjetas, paneles, formularios |
| `--bg-beneficios` | `#0d4a5e` | Acentos de sección / banners |
| `--accent` | `#38d3e0` | Cian de acento: highlights, iconos, enlaces |
| `--text` | `#e6f1ff` | Texto principal |
| `--text-muted` | `#a8b2d1` | Texto secundario / descripciones |
| `--btn` | `#2563eb` | Azul primario de acciones |
| `--border-subtle` | `rgba(255,255,255,0.05)` | Bordes sutiles, separadores |

Variables del tema de auth que conviene portar/normalizar a `global.css`:

| Variable | Valor | Uso |
|---|---|---|
| `--btn-blue` | `#3b93ff` | Botón primario claro (auth) |
| `--btn-hover` | `#2a7be6` | Estado hover |
| `--input-bg` | `#f2eeed` | Fondo de inputs |
| `--text-dark` | `#333333` | Texto oscuro sobre superficie clara |

**Regla:** en `global.css` definir un único set de tokens oscuros (los de la tabla superior) y no duplicar valores en cada archivo de módulo.

---

## 2. Tema de autenticación (claro, aparte)

Este tema NO se usa en los módulos internos. Se conserva para `pages/auth/login.html` y registro.

Características a mantener si se regeneran `pages/auth/*`:
- Fondo: imagen `Fondo-torre.webp` (`background: url(...) no-repeat center center/cover`).
- Tarjeta blanca centrada con `box-shadow: 0 15px 30px rgba(0,0,0,0.25)`.
- Inputs con icono a la izquierda (`padding: 14px 14px 14px 45px`), fondo `--input-bg`, borde sin borde, `box-shadow: inset 0 2px 4px rgba(0,0,0,0.05)`.
- Botón primario con sombra proyectada `0 4px 10px rgba(59,147,255,0.4)`.
- Pantalla responsive (max-width 768px / 480px).

---

## 3. Inventario de clases existentes (reutilizables)

### Botones (`landingpage-rebuild.css`)
- `.btn` — base: `padding: 10px 20px; border-radius: 8px; font-weight: 600; transition: 0.3s`.
- `.btn:hover` — `transform: translateY(-2px); opacity: 0.9`.
- `.btn-primary` — `background: var(--btn)` (azul `#2563eb`), con sombra.
- `.btn-outline` — transparente con `border: 2px solid var(--btn)`.
- `.btn-lg` — `padding: 14px 30px; font-size: 1.05rem`.

### Tarjetas y layout
- `.container` — `width: 90%; max-width: 1200px; margin: 0 auto`.
- `.card` — fondo `rgba(0,0,0,0.25)`, `border-radius: 14px`, `border: 1px solid var(--border-subtle)`, hover `translateY(-4px)`.
- `.form-box` — fondo `var(--bg-card)`, `border-radius: 16px`, padding `2.5rem`.
- `.section` — `padding: 6rem 0` con separador `border-top: 1px solid var(--border-subtle)`.
- `.navbar` / `.nav-container` / `.nav-links` / `.nav-btns` / `.nav-toggle` — barra sticky con `backdrop-filter: blur(12px)`, `background: rgba(10,15,30,0.85)`.

### Formularios (auth)
- `.input-group` — wrapper con icono absoluto a la izquierda.
- `.form-box input` — full width, `border-radius: 8px`, foco con `border-color` azul.

### Tipografía
- Fuente: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`.
- `h1, h2, h3` con `font-weight: 700` y `letter-spacing: -0.5px`.
- `h2` de sección: `font-size: 2.4rem; text-align: center`, con `<span>` en `var(--accent)`.

---

## 4. Patrones y convenciones de estilo

- **Breakpoints responsive:** `@media (max-width: 900px)`, `600px`, `400px`. Los grids de 2 columnas pasan a 1 columna en 900px.
- **Comentarios por sección:**
  ```
  /* =========================
     BOTONES
  ========================= */
  ```
- **Idioma:** todo en español.
- **Nomenclatura:** BEM-ligero (`.btn-primary`, `.hero-container`, `.plan-header`), kebab-case en nombres de archivo y clases.
- **Selectores:** se usan clases; evitar estilos inline.
- **Transiciones:** `transition: 0.3s ease` / `color 0.2s` / `background 0.2s`.
- **Grids:** CSS Grid (`grid-template-columns: 1fr 1fr`, `grid-template-areas`) para secciones; flexbox para barras.

---

## 5. Estructura objetivo del frontend (a construir)

```
frontend/
├── index.html
├── pages/
│   ├── auth/            # login.html, register.html (tema claro)
│   ├── dashboard/       # inicio.html
│   ├── ventas/          # ventas.html, nueva-venta.html
│   ├── productos/       # productos.html, nuevo-producto.html, editar-producto.html
│   ├── inventario/      # inventario.html, movimientos.html, ajustes.html
│   ├── compras/         # compras.html, nueva-compra.html, recepciones.html
│   ├── proveedores/     # proveedores.html, nuevo-proveedor.html
│   └── reportes/        # reportes.html
├── components/          # header.html, sidebar.html
├── css/
│   ├── global.css       # tokens + reset + tipografía
│   ├── login.css        # tema claro (auth) o absorbido por global.css
│   ├── layout.css       # sidebar + header + main-content + responsive
│   ├── components.css   # tablas, botones, input select, badges, modales, paginación
│   └── modules/         # ventas.css, productos.css, inventario.css, compras.css, proveedores.css
├── js/
│   ├── auth/            # login.js
│   ├── layout/          # header.js, sidebar.js
│   └── modules/         # ventas.js, productos.js, inventario.js, compras.js, proveedores.js
└── assets/
    ├── images/
    ├── icons/
    └── logo/
```

### Notas sobre la estructura
- Se crea `frontend/` **en paralelo** a la carpeta actual `Frontend/` (que aún conserva landing y auth) hasta migrarla.
- Rutas de assets dentro de `frontend/`: `./assets/...` desde `index.html`, `../assets/...` desde `pages/**`.

---

## 6. Mapa de estilos por responsabilidad

| Archivo CSS | Contenido | Qué reutiliza |
|---|---|---|
| `global.css` | Reset (`*`), tokens oscuros, tipografía `Segoe UI`, colores, breakpoints, utilidades (`.container`) | Paleta de la landing |
| `layout.css` | `.app-shell`, `.sidebar`, `.sidebar-link`, `.header-top`, `.main-content`, toggler responsive | Patrón `.navbar` de la landing |
| `components.css` | `.data-table`, `.btn-*`, `.input-group`, `.select`, `.badge` (estado A/I), `.modal`, `.card`, `.stat-card`, `.pagination`, `.empty-state` | `.btn*`, `.card`, `.form-box`, `.input-group` |
| `modules/*.css` | Solo estilos específicos de la vista (ej. grid del punto de venta, layout de nueva venta) | Sobre la base anterior |

**Componentes compartidos:** `components/header.html` y `components/sidebar.html` se cargan en cada página mediante **inclusión vía JS** (fetch + inyección del partial), no duplicando el HTML a mano.

---

## 7. Componentes del sistema a construir (base del dashboard)

- **Sidebar:** navegación de módulos (Dashboard, Ventas, Productos, Inventario, Compras, Proveedores, Reportes). Fondo `var(--bg-dark)` o `var(--bg-card)`, enlaces con hover en `var(--accent)`, ítem activo resaltado. Responsive: colapsable.
- **Header:** logo + usuario/avatar + acciones (perfil, cerrar sesión). Fondo con blur tipo `.navbar`.
- **Layout:** grid `sidebar + main-content`; `main-content` con scroll propio.
- **Tablas de datos (`.data-table`):** modo oscuro legible — filas con `border-bottom: 1px solid var(--border-subtle)`, hover con `--bg-card`/blanco al 5%, cabecera con `--text-muted`, badges de estado (activo/inactivo, entrada/salida).
- **Cards de resumen (KPI):** fondo `var(--bg-card)`, `border-radius: 14px` (patrón `.card`), con valor destacado, para `dashboard/inicio.html`.

---

## 8. Convenciones para el código generado

Al generar HTML/CSS de los módulos respetar:

1. Cargar primero `global.css` → `layout.css` → `components.css` → `modules/<modulo>.css`.
2. No inventar colores: usar solo los tokens de la sección 1 en el tema oscuro.
3. No duplicar estilos genéricos en `modules/*.css`; ahí solo lo específico del módulo.
4. Usar clases BEM-ligero en español (ej. `.venta-grid`, `.producto-form`, `.stock-badge`).
5. Nombres de archivos en kebab-case.
6. Responsive con los breakpoints 900 / 600 / 400 px.
7. Comentarios por sección con el formato `/* ===== */`.
8. Header/sidebar cargados por JS (fetch de `components/`), nunca pegados en cada página.
9. En `pages/auth/*` mantener el tema claro actual (login.css / register.css).

---

## 9. Pendientes y advertencias

- **No unificar aún** con la carpeta `Frontend/` (landing y auth siguen viviendo ahí). Migrar cuando convengan.
- **CSS antiguo duplicado:** los tres CSS actuales separan tokens; en `frontend/css/global.css` consolidarlos.
- **Falta CSS de:** tablas, modales, badges, paginación, sidebar, header de app, selects, avisos/alertas (toast). Crearlos en `components.css`.
- **Auth sin backend:** `login.html`/`register.html` aún no hacen fetch; `pruebaLogin/pruebaRegister` sirven de referencia de endpoints (`/api/auth/login`, `/api/auth/register`).
- **Backend:** Express 5 + MySQL (`gestcom`), rutas en `/api/auth/*`; módulos nuevos requerirán rutas/controladores/modelos similares (MVC).