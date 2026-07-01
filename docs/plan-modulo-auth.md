# Plan De Desarrollo: Modulo De Inicio De Sesion Y Registro

## Objetivo

Implementar el modulo de autenticacion de GestCom separando el registro basico de cuenta del perfil ampliado del usuario.

El registro inicial debe ser simple, solicitando unicamente los datos necesarios para crear una cuenta:

- Nombre
- Apellido
- Correo electronico
- Contrasena
- Confirmacion de contrasena

Los datos personales adicionales se completaran posteriormente dentro de la plataforma, desde una seccion como "Mi Perfil".

## Alcance De Esta Fase

Esta fase incluye:

- Rediseno de la tabla `usuarios`.
- Creacion de una tabla separada para datos de perfil.
- Ajuste del registro para aceptar solo datos basicos.
- Preparacion para futuras restricciones SQL.
- Documentacion del uso futuro de triggers.
- Ajuste del formulario definitivo `register.html`.
- Base para el flujo de inicio de sesion.

Esta fase no incluye todavia:

- Implementacion de triggers.
- Implementacion completa de JWT.
- Dashboard privado.
- Menu de edicion de perfil.
- Roles avanzados.

## Modelo De Datos Propuesto

### Tabla `usuarios`

La tabla `usuarios` representa la cuenta de acceso al sistema.

Campos:

- `id`
- `nombre`
- `apellido`
- `fecha_registro`
- `correo_usuario`
- `password`
- `estado`
- `id_rol`

Esta tabla se enfoca en autenticacion, control de acceso y estado de la cuenta.

### Tabla `perfil_usuario`

La tabla `perfil_usuario` almacena datos personales complementarios que el usuario podra completar despues de iniciar sesion.

Campos:

- `id`
- `id_usuario`
- `fecha_nacimiento`
- `numero_telefonico`
- `nacionalidad`
- `genero`
- `fecha_actualizacion`

La relacion sera:

- Un usuario tiene un perfil.
- Un perfil pertenece a un usuario.

Restricciones sugeridas:

- `perfil_usuario.id_usuario` debe ser llave foranea hacia `usuarios.id`.
- `perfil_usuario.id_usuario` debe ser unico para evitar multiples perfiles por usuario.

## Justificacion De La Separacion

Separar `usuarios` y `perfil_usuario` permite que el registro inicial sea mas simple y rapido.

Ademas, mejora el diseno de base de datos porque separa dos responsabilidades distintas:

- `usuarios`: datos necesarios para acceder al sistema.
- `perfil_usuario`: datos personales editables posteriormente.

Esto evita pedir informacion innecesaria durante el registro y permite completar el perfil una vez iniciada la sesion.

## Registro De Cuenta

El formulario definitivo `register.html` debe solicitar:

- Nombre
- Apellido
- Correo electronico
- Contrasena
- Confirmar contrasena

El backend debe recibir unicamente:

```js
{
  nombre,
  apellido,
  correo_usuario,
  password
}
```

El backend sera responsable de:

- Validar campos obligatorios.
- Validar formato de correo.
- Validar longitud minima de contrasena.
- Verificar que el correo no este registrado.
- Cifrar la contrasena con `bcrypt`.
- Crear el usuario con estado activo.
- Asignar rol por defecto.

## Datos Que Se Completaran Despues

Los siguientes datos no se pediran en el registro inicial:

- Fecha de nacimiento
- Numero telefonico
- Nacionalidad
- Genero

Estos datos se completaran despues desde una seccion interna, por ejemplo:

- Mi Perfil
- Configuracion de cuenta
- Datos personales

## Restricciones SQL

Se recomienda aplicar restricciones como:

- `correo_usuario UNIQUE NOT NULL`
- `password NOT NULL`
- `estado NOT NULL`
- Restriccion para permitir solo estados validos, por ejemplo `A` e `I`.
- Llave foranea entre `perfil_usuario.id_usuario` y `usuarios.id`.
- `UNIQUE` en `perfil_usuario.id_usuario`.

En una fase posterior se pueden agregar restricciones adicionales para:

- Validar genero.
- Validar fecha de nacimiento.
- Controlar campos obligatorios cuando el perfil sea completado.

## Triggers SQL

Los triggers no se implementaran en esta primera tarea.

Sin embargo, se dejan definidos como parte del plan academico para una fase posterior.

### Trigger `AFTER INSERT ON usuarios`

Objetivo futuro:

Crear automaticamente un registro en `perfil_usuario` cuando se cree una cuenta nueva.

Justificacion:

Cada usuario debe tener un perfil asociado. Este trigger automatizara esa creacion y evitara que existan usuarios sin perfil.

Uso academico:

Permite demostrar automatizacion de procesos internos de la base de datos mediante triggers.

### Trigger `BEFORE UPDATE ON perfil_usuario`

Objetivo futuro:

Actualizar automaticamente el campo `fecha_actualizacion` cuando el usuario modifique sus datos personales.

Justificacion:

Permite llevar control de cuando fue modificada por ultima vez la informacion del perfil.

Uso academico:

Permite demostrar como un trigger puede mantener informacion de auditoria sin depender directamente del frontend.

### Trigger De Auditoria Futuro

En una fase mas avanzada se puede crear una tabla de auditoria, por ejemplo:

```sql
auditoria_usuarios
```

Uso futuro:

- Registrar creacion de usuarios.
- Registrar actualizacion de perfiles.
- Registrar cambios importantes en el estado de cuenta.

Este punto puede usarse para explicar auditoria y trazabilidad en base de datos.

## Flujo De Registro Propuesto

1. El usuario entra a la landing-page.
2. Selecciona "Crear cuenta".
3. Ingresa nombre, apellido, correo y contrasena.
4. El frontend valida campos basicos.
5. El backend valida nuevamente los datos.
6. El backend cifra la contrasena.
7. El backend crea el usuario.
8. El usuario recibe confirmacion de registro.
9. El usuario puede iniciar sesion.
10. Ya dentro de la plataforma, puede completar su perfil.

## Flujo De Login Propuesto

1. El usuario ingresa correo y contrasena.
2. El backend busca el usuario por correo.
3. El backend verifica que el usuario este activo.
4. El backend compara la contrasena usando `bcrypt`.
5. Si las credenciales son correctas, se inicia sesion.
6. En una fase posterior, se puede implementar JWT para proteger rutas privadas.

## Cambios Tecnicos Planeados

### Base De Datos

Modificar `database/sqlgestcom.sql` para:

- Reducir la tabla `usuarios` a datos de cuenta.
- Crear la tabla `perfil_usuario`.
- Crear la relacion entre ambas tablas.
- No crear triggers todavia.

### Backend

Modificar:

```txt
backend/controllers/authController.js
backend/models/usuarioModel.js
```

Para que el registro trabaje solo con:

- Nombre
- Apellido
- Correo
- Contrasena

### Frontend

Modificar:

```txt
Frontend/register.html
```

Para que el formulario definitivo tenga:

- Nombre
- Apellido
- Correo
- Contrasena
- Confirmar contrasena

Tambien corregir la ruta del CSS:

```html
<link rel="stylesheet" href="./css/register-style.css">
```

## Archivos De Prueba

Los archivos:

```txt
Frontend/pruebaLogin.html
Frontend/pruebaRegister.html
```

se conservaran temporalmente como referencia durante el desarrollo.

Posteriormente podran eliminarse o reemplazarse por pruebas mejor organizadas.

## Orden De Implementacion

1. Crear documentacion de esta fase.
2. Modificar el script SQL base.
3. Separar `usuarios` y `perfil_usuario`.
4. Ajustar el modelo de usuario en backend.
5. Ajustar el controlador de registro.
6. Ajustar el formulario `register.html`.
7. Verificar manualmente el registro.
8. Documentar pendientes de login, sesion y triggers.

## Pendientes Posteriores

- Conectar definitivamente `login.html`.
- Implementar JWT.
- Crear middleware de autenticacion.
- Crear dashboard protegido.
- Crear seccion "Mi Perfil".
- Implementar edicion de perfil.
- Implementar triggers SQL.
- Implementar auditoria.
- Agregar roles y permisos.
