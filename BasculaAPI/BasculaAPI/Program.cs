using System.IO.Ports;

var builder = WebApplication.CreateBuilder(args);

// 1. Configurar CORS para permitir que React lea los datos
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

// 2. Registrar el almacén de datos y el servicio de lectura en segundo plano
builder.Services.AddSingleton<RegistroPeso>();
builder.Services.AddHostedService<LectorBasculaService>();

var app = builder.Build();
app.UseCors();

// 3. Crear el endpoint que React va a consultar
app.MapGet("/api/peso", (RegistroPeso registro) =>
{
    return Results.Ok(new { pesoActual = registro.UltimoPeso });
});

app.Run();

// --- CLASES AUXILIARES ---

// Clase Singleton: Mantiene en memoria el último peso leído
public class RegistroPeso
{
    public string UltimoPeso { get; set; } = "0.00";
}

// Servicio Background: Corre permanentemente leyendo el puerto COM
public class LectorBasculaService : BackgroundService
{
    private readonly RegistroPeso _registro;

    public LectorBasculaService(RegistroPeso registro)
    {
        _registro = registro;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // IMPORTANTE: Deberás cambiar "COM3" por el puerto real al que se conecte el cable
        using var serialPort = new SerialPort("COM3", 9600, Parity.None, 8, StopBits.One);

        try
        {
            serialPort.Open();
            while (!stoppingToken.IsCancellationRequested)
            {
                if (serialPort.BytesToRead > 0)
                {
                    // Lee la línea enviada por la báscula
                    string datoCrudo = serialPort.ReadLine();

                    // Aquí asignarás lógica de limpieza si la báscula manda texto extra (ej. " KG")
                    _registro.UltimoPeso = datoCrudo.Trim();
                }

                // Pequeña pausa para no saturar el procesador
                await Task.Delay(100, stoppingToken);
            }
        }
        catch (Exception ex)
        {
            // Si el cable no está conectado, el programa no "crashea", solo lo reporta en consola
            Console.WriteLine($"Advertencia de Hardware: {ex.Message}");
        }
    }
}