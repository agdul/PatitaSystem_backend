USE db_patitaSystem;

SELECT * FROM Rol;

-- Insert rol

INSERT INTO Rol (nombre_rol) VALUES ('Administrador'), ('Vendedor'), ('Estilista');

-- Provincia
SELECT * FROM Provincia;

INSERT INTO Provincia (nombre_provincia) VALUES
('Corrientes'),
('Chaco'),
('Misiones');


-- Localidades para Corrientes (id_provincia = 1)
INSERT INTO Localidad (nombre_localidad, id_provincia) VALUES
('Capital', 1),
('Goya', 1),
('Ituzaingó', 1);

-- Localidades para Chaco (id_provincia = 2)
INSERT INTO Localidad (nombre_localidad, id_provincia) VALUES
('Resistencia', 2),
('Sáenz Peña', 2);

-- Localidades para Misiones (id_provincia = 3)
INSERT INTO Localidad (nombre_localidad, id_provincia) VALUES
('Posadas', 3),
('Oberá', 3);




-- Direccion

SELECT * FROM Direccion;

INSERT INTO Direccion (codigo_postal, calle, altura, id_localidad) VALUES
('3400','Av. 3 de Abril', '1234', 1);   -- Capital, Corrientes


-- Genero
SELECT * FROM Genero;

INSERT INTO Genero (nombre_genero) VALUES
('Masculino'),
('Femenino'),
('Otro');


-- Usuario

SELECT * FROM Usuario;