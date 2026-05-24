CREATE DATABASE proyecto;
USE proyecto;

CREATE TABLE clientes (
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
telefono VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE empleados (
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL
);

CREATE TABLE servicios (
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL
);

CREATE TABLE empleado_servicio (
id INT AUTO_INCREMENT PRIMARY KEY,
empleado_id INT NOT NULL,
servicio_id INT NOT NULL,
FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE CASCADE ON UPDATE CASCADE,

UNIQUE (empleado_id, servicio_id)
);

CREATE TABLE citas (
id INT AUTO_INCREMENT PRIMARY KEY,
fecha DATETIME NOT NULL,
cliente_id INT NOT NULL,
empleado_id INT NOT NULL,
servicio_id INT NOT NULL,
FOREIGN KEY (cliente_id) REFERENCES clientes(id),
FOREIGN KEY (empleado_id) REFERENCES empleados(id),
FOREIGN KEY (servicio_id) REFERENCES servicios(id),

UNIQUE (empleado_id, fecha)
);

INSERT INTO clientes (nombre, telefono) VALUES
('Jorge Delgado', '3209419316'),
('Carlos Perez', '3001234567'),
('Luis Gomez', '3024567890'),
('Andres Martinez', '3031112233'),
('Juan Rodriguez', '3045556677');

INSERT INTO empleados (nombre) VALUES
('Diego Ariza'),
('Roger Martinez'),
('Diego Martinez'),
('Maria Torres'),
('Yesid Guerra');

INSERT INTO servicios (nombre) VALUES
('Corte Clasico'),
('Fade Degradado'),
('Barba');

INSERT INTO empleado_servicio (empleado_id, servicio_id) VALUES
(1, 1),
(1, 3),
(2, 1),
(2, 2),
(3, 1),
(4, 3),
(5, 2);

INSERT INTO citas (cliente_id, empleado_id, servicio_id, fecha) VALUES
(1, 1, 1, '2026-05-10 10:00:00'),
(2, 2, 2, '2026-05-10 11:00:00'),
(3, 1, 3, '2026-05-10 12:30:00'),
(4, 3, 1, '2026-05-11 09:00:00'),
(5, 2, 2, '2026-05-11 14:00:00');



