using Microsoft.AspNetCore.Mvc;
using BasculaAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BasculaAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BasculaController : ControllerBase
    {
        private readonly SistemaBasculaDbContext _context;

        public BasculaController(SistemaBasculaDbContext context)
        {
            _context = context;
        }

        [HttpPost("registrar")]
        public async Task<IActionResult> RegistrarPeso([FromBody] ScaleInputDto input)
        {
            if (input == null || input.Peso <= 0 || (input.UnidadOrigen.ToLower() != "kg" && input.UnidadOrigen.ToLower() != "lb"))
            {
                return BadRequest("Datos inválidos. El peso debe ser mayor a 0 y la unidad debe ser 'kg' o 'lb'.");
            }

            try
            {
                decimal constConversion = 2.20462m;
                decimal pesoKg = 0;
                decimal pesoLb = 0;

                if (input.UnidadOrigen.ToLower() == "kg")
                {
                    pesoKg = input.Peso;
                    pesoLb = input.Peso * constConversion;
                }
                else // "lb"
                {
                    pesoLb = input.Peso;
                    pesoKg = input.Peso / constConversion;
                }

                var nuevoRegistro = new RegistroPeso
                {
                    PesoKg = Math.Round(pesoKg, 3),
                    PesoLb = Math.Round(pesoLb, 3),
                    UnidadOrigen = input.UnidadOrigen.ToLower(),
                    FechaRegistro = DateTime.Now
                };

                _context.RegistroPesos.Add(nuevoRegistro);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Registro guardado exitosamente", data = nuevoRegistro });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno: {ex.Message}");
            }
        }

        [HttpGet("reportes")]
        public async Task<IActionResult> ObtenerReportes([FromQuery] DateTime? desde, [FromQuery] DateTime? hasta)
        {
            try
            {
                var query = _context.RegistroPesos.AsQueryable();

                if (desde.HasValue)
                {
                    query = query.Where(r => r.FechaRegistro >= desde.Value.Date);
                }

                if (hasta.HasValue)
                {
                    // Aseguramos que cubra todo el día "hasta"
                    var endOfDay = hasta.Value.Date.AddDays(1).AddTicks(-1);
                    query = query.Where(r => r.FechaRegistro <= endOfDay);
                }

                var resultados = await query.OrderByDescending(r => r.FechaRegistro).ToListAsync();
                return Ok(resultados);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener reportes: {ex.Message}");
            }
        }
    }
}
