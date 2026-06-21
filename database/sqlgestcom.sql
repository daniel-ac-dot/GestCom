create database gestcom;
use gestcom;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL,
    apellido VARCHAR(20) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    fecha_registro DATE NOT NULL,
    correo_usuario VARCHAR(40) NOT NULL UNIQUE,
    numero_telefonico VARCHAR(15) NOT NULL,
    nacionalidad VARCHAR(20) NOT NULL,
    genero CHAR(1) NOT NULL,
    password VARCHAR(255) NOT NULL,
    estado CHAR(1) NOT NULL,
    id_rol INT NOT NULL
);

INSERT INTO usuarios
(
nombre,
apellido,
fecha_nacimiento,
fecha_registro,
correo_usuario,
numero_telefonico,
nacionalidad,
genero,
password,
estado,
id_rol
)
VALUES
(
'Daniel',
'Acuña',
'2000-01-01',
CURDATE(),
'daniel@gmail.com',
'3001234567',
'Colombiana',
'M',
'123456',
'A',
1
);