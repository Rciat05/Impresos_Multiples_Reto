namespace BasculaAPI.Models
{
    public class ScaleInputDto
    {
        public decimal Peso { get; set; }
        public string UnidadOrigen { get; set; } = "kg"; // Puede ser "kg" o "lb"
    }
}
