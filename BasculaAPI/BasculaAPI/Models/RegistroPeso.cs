using System;
using System.Collections.Generic;

namespace BasculaAPI.Models;

public partial class RegistroPeso
{
    public int Id { get; set; }

    public decimal PesoKg { get; set; }

    public decimal PesoLb { get; set; }

    public string UnidadOrigen { get; set; } = null!;

    public DateTime? FechaRegistro { get; set; }
}
