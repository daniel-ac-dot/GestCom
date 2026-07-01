# Plan Definitivo: Implementacion De Triggers SQL

## Objetivo

Preparar la implementacion de 2 triggers SQL en el proyecto GestCom, sin iniciar todavia la implementacion de inicio de sesion ni registro de usuarios.

Los triggers se agregaran en el archivo:

```txt
database/sqlgestcom.sql
```

Estos triggers trabajaran sobre las tablas actuales:

- `usuarios`
- `perfil_usuario`

## Trigger 1: Crear Perfil Automaticamente

### Nombre Del Trigger

```sql
trg_usuarios_after_insert_crear_perfil
```

### Tipo

```sql
AFTER INSERT ON usuarios
```

### Objetivo

Crear automaticamente un registro en la tabla `perfil_usuario` cada vez que se cree un nuevo usuario en la tabla `usuarios`.

### Justificacion

Cada usuario debe tener un perfil asociado. Este trigger evita que existan usuarios sin perfil y prepara la base de datos para una futura seccion de "Mi Perfil".

### SQL Del Trigger

```sql
DELIMITER //

CREATE TRIGGER trg_usuarios_after_insert_crear_perfil
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
    INSERT INTO perfil_usuario (id_usuario)
    VALUES (NEW.id);
END//

DELIMITER ;
```

### Explicacion

- `AFTER INSERT ON usuarios`: el trigger se ejecuta despues de insertar un usuario.
- `FOR EACH ROW`: se ejecuta una vez por cada usuario insertado.
- `NEW.id`: representa el `id` del usuario que acaba de crearse.
- El trigger inserta ese `id` en `perfil_usuario.id_usuario`.

## Trigger 2: Actualizar Fecha De Perfil

### Nombre Del Trigger

```sql
trg_perfil_usuario_before_update_fecha
```

### Tipo

```sql
BEFORE UPDATE ON perfil_usuario
```

### Objetivo

Actualizar automaticamente el campo `fecha_actualizacion` cada vez que se modifique un perfil de usuario.

### Justificacion

Permite llevar control de la ultima modificacion del perfil sin depender del frontend ni del backend.

### SQL Del Trigger

```sql
DELIMITER //

CREATE TRIGGER trg_perfil_usuario_before_update_fecha
BEFORE UPDATE ON perfil_usuario
FOR EACH ROW
BEGIN
    SET NEW.fecha_actualizacion = NOW();
END//

DELIMITER ;
```

### Explicacion

- `BEFORE UPDATE ON perfil_usuario`: el trigger se ejecuta antes de actualizar un perfil.
- `NEW.fecha_actualizacion`: modifica el nuevo valor que se guardara.
- `NOW()`: guarda la fecha y hora actual.
- Cada vez que el usuario cambie datos como telefono, nacionalidad, genero o fecha de nacimiento, se actualizara automaticamente la fecha.

## Ubicacion En El Archivo SQL

Los triggers deben escribirse despues de la creacion de las tablas.

Orden recomendado en `database/sqlgestcom.sql`:

```sql
CREATE DATABASE IF NOT EXISTS gestcom;
USE gestcom;

CREATE TABLE roles (...);

CREATE TABLE usuarios (...);

CREATE TABLE perfil_usuario (...);

-- Triggers
DELIMITER //

CREATE TRIGGER trg_usuarios_after_insert_crear_perfil
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
    INSERT INTO perfil_usuario (id_usuario)
    VALUES (NEW.id);
END//

CREATE TRIGGER trg_perfil_usuario_before_update_fecha
BEFORE UPDATE ON perfil_usuario
FOR EACH ROW
BEGIN
    SET NEW.fecha_actualizacion = NOW();
END//

DELIMITER ;
```

## Paso A Paso Para Escribirlos En `sqlgestcom.sql`

1. Abrir el archivo:

```txt
database/sqlgestcom.sql
```

2. Ubicar el final de la tabla `perfil_usuario`.

Actualmente termina aproximadamente asi:

```sql
CREATE TABLE perfil_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    fecha_nacimiento DATE NULL,
    numero_telefonico VARCHAR(15) NULL,
    nacionalidad VARCHAR(30) NULL,
    genero CHAR(1) NULL,
    fecha_actualizacion DATETIME NULL,
    CONSTRAINT chk_perfil_genero CHECK (genero IS NULL OR genero IN ('M', 'F', 'O')),
    CONSTRAINT fk_perfil_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);
```

3. Debajo de esa tabla, agregar una seccion de triggers:

```sql
-- Triggers
```

4. Cambiar temporalmente el delimitador para que MySQL permita bloques `BEGIN ... END`:

```sql
DELIMITER //
```

5. Escribir el trigger que crea automaticamente el perfil:

```sql
CREATE TRIGGER trg_usuarios_after_insert_crear_perfil
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
    INSERT INTO perfil_usuario (id_usuario)
    VALUES (NEW.id);
END//
```

6. Escribir el trigger que actualiza `fecha_actualizacion`:

```sql
CREATE TRIGGER trg_perfil_usuario_before_update_fecha
BEFORE UPDATE ON perfil_usuario
FOR EACH ROW
BEGIN
    SET NEW.fecha_actualizacion = NOW();
END//
```

7. Restaurar el delimitador normal:

```sql
DELIMITER ;
```

## Resultado Final Esperado En El SQL

La parte final de `database/sqlgestcom.sql` deberia quedar asi:

```sql
CREATE TABLE perfil_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    fecha_nacimiento DATE NULL,
    numero_telefonico VARCHAR(15) NULL,
    nacionalidad VARCHAR(30) NULL,
    genero CHAR(1) NULL,
    fecha_actualizacion DATETIME NULL,
    CONSTRAINT chk_perfil_genero CHECK (genero IS NULL OR genero IN ('M', 'F', 'O')),
    CONSTRAINT fk_perfil_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- Triggers
DELIMITER //

CREATE TRIGGER trg_usuarios_after_insert_crear_perfil
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
    INSERT INTO perfil_usuario (id_usuario)
    VALUES (NEW.id);
END//

CREATE TRIGGER trg_perfil_usuario_before_update_fecha
BEFORE UPDATE ON perfil_usuario
FOR EACH ROW
BEGIN
    SET NEW.fecha_actualizacion = NOW();
END//

DELIMITER ;
```

## Prueba Manual Recomendada

Despues de implementar los triggers, se puede probar con datos temporales.

Primero debe existir un rol:

```sql
INSERT INTO roles (nombre)
VALUES ('Cliente');
```

Luego insertar un usuario:

```sql
INSERT INTO usuarios (
    nombre,
    apellido,
    fecha_registro,
    correo_usuario,
    password,
    estado,
    id_rol
)
VALUES (
    'Juan',
    'Perez',
    CURDATE(),
    'juan@example.com',
    'password_prueba',
    'A',
    1
);
```

Verificar que se creo automaticamente el perfil:

```sql
SELECT *
FROM perfil_usuario;
```

Actualizar el perfil:

```sql
UPDATE perfil_usuario
SET numero_telefonico = '3001234567'
WHERE id_usuario = 1;
```

Verificar que `fecha_actualizacion` se actualizo:

```sql
SELECT *
FROM perfil_usuario
WHERE id_usuario = 1;
```

## Consideraciones Importantes

- Estos triggers no implementan login ni registro.
- Solo preparan la base de datos para cuando esas funciones se conecten definitivamente.
- El primer trigger depende de que exista la tabla `perfil_usuario`.
- El segundo trigger depende de que exista el campo `fecha_actualizacion`.
- Si se ejecuta el script varias veces sobre la misma base, MySQL puede mostrar error porque el trigger ya existe.
- Para una version mas avanzada se podria usar `DROP TRIGGER IF EXISTS`, pero por ahora se recomienda mantenerlo simple para fines academicos.

## Triggers Seleccionados

Los triggers definitivos para esta fase son:

```txt
1. trg_usuarios_after_insert_crear_perfil
   Crea automaticamente un perfil cuando se crea un usuario.

2. trg_perfil_usuario_before_update_fecha
   Actualiza automaticamente la fecha de modificacion del perfil.
```
