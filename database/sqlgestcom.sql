CREATE DATABASE IF NOT EXISTS gestcom;
use gestcom;

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    fecha_registro DATE NOT NULL,
    correo_usuario VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    estado CHAR(1) NOT NULL,
    id_rol INT NOT NULL,
    CONSTRAINT chk_usuarios_estado CHECK (estado IN ('A', 'I')),
    CONSTRAINT fk_usuarios_roles FOREIGN KEY (id_rol) REFERENCES roles(id)
);

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



