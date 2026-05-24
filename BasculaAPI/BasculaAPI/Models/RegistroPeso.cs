using System;
using System.Collections.Generic;

namespace BasculaAPI.Models;

public partial class RegistroPeso
{
    public int Id { get; set; }

    public string? NombreProducto { get; set; }

    public decimal Peso { get; set; }

    public string Unidad { get; set; } = null!;

    public DateTime? FechaRegistro { get; set; }
}
