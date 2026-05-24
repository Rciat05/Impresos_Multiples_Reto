using Microsoft.AspNetCore.Mvc;
using BasculaAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BasculaAPI
{
    [Route("api/[controller]")]
    [ApiController]
    public class PesosController : ControllerBase
    {
        private readonly SistemaBasculaDbContext _context;

        // Inyectamos el contexto de la base de datos
        public PesosController(SistemaBasculaDbContext context)
        {
            _context = context;
        }

        // POST: api/Pesos
        // Sirve para recibir y registrar los datos de la báscula
        [HttpPost]
        public async Task<IActionResult> RegistrarPeso([FromBody] RegistroPeso nuevoPeso)
        {
            if (nuevoPeso == null)
            {
                return BadRequest("Los datos del peso no pueden ser nulos.");
            }

            try
            {
                // Aseguramos la fecha actual en el servidor
                nuevoPeso.FechaRegistro = DateTime.Now;

                _context.RegistroPesos.Add(nuevoPeso);
                await _context.SaveChangesAsync(); // Guarda en SQL Server

                return Ok(new { mensaje = "¡Peso registrado con éxito!", id = nuevoPeso.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno: {ex.Message}");
            }
        }

        // GET: api/Pesos
        // Opcional para ver el historial
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RegistroPeso>>> ObtenerHistorial()
        {
            return await _context.RegistroPesos.OrderByDescending(p => p.FechaRegistro).ToListAsync();
        }
    }
}
