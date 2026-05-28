using Microsoft.EntityFrameworkCore;
using BasculaAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. REGISTRO DE SERVICIOS (DbContext)
// ==========================================

// Aquí registramos tu conexión a SQL Server usando el appsettings.json
builder.Services.AddDbContext<SistemaBasculaDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Soporte para los Controladores del API y Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Habilitar CORS para permitir llamadas desde React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// ==========================================
// SERVICIO BACKGROUND EN PAUSA (Tu compañero)
// ==========================================
/*
public class LectorBasculaService : Microsoft.Extensions.Hosting.BackgroundService
{
    protected override async System.Threading.Tasks.Task ExecuteAsync(System.Threading.CancellationToken stoppingToken)
    {
        await System.Threading.Tasks.Task.Delay(1000, stoppingToken);
    }
}
*/

var app = builder.Build();

// ==========================================
// 2. CONFIGURACIÓN DEL PIPELINE HTTP (Middleware)
// ==========================================

// Activar Swagger para que puedas hacer pruebas visuales
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseAuthorization();

// Mapear los controladores automáticamente (así encuentra tu PesosController)
app.MapControllers();

System.Console.WriteLine("¡Servidor del Backend Iniciando con SQL Server!");

app.Run();