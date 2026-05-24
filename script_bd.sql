CREATE DATABASE SistemaBasculaDB;
GO

USE SistemaBasculaDB;
GO

CREATE TABLE RegistroPesos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    NombreProducto VARCHAR(100) NULL,
    Peso DECIMAL(10, 2) NOT NULL,
    Unidad VARCHAR(5) NOT NULL,
    FechaRegistro DATETIME DEFAULT GETDATE()
);
GO
