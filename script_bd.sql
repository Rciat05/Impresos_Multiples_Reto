CREATE DATABASE SistemaBasculaDB;
GO

USE SistemaBasculaDB;
GO

CREATE TABLE RegistroPesos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    PesoKg DECIMAL(10, 3) NOT NULL,
    PesoLb DECIMAL(10, 3) NOT NULL,
    UnidadOrigen VARCHAR(5) NOT NULL,
    FechaRegistro DATETIME DEFAULT GETDATE()
);
GO

-- Insertamos algunos registros de prueba simulados
INSERT INTO RegistroPesos (PesoKg, PesoLb, UnidadOrigen, FechaRegistro)
VALUES 
    (10.000, 22.046, 'kg', DATEADD(day, -2, GETDATE())),
    (4.536, 10.000, 'lb', DATEADD(day, -1, GETDATE())),
    (25.500, 56.218, 'kg', GETDATE());
GO
