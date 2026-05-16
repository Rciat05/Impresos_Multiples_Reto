// Servicio Background: Corre permanentemente leyendo el puerto COM
public class LectorBasculaService : BackgroundService
{
    private readonly RegistroPeso _registro;
    private readonly ILogger<LectorBasculaService> _logger;

    // CONFIGURACIÓN CLAVE: con PuTTY
    private readonly string _puertoCom = "COM3";
    private readonly bool _esModoSICS = false; // Ponlo en 'true' si necesitas enviarle la letra "S"

    public LectorBasculaService(RegistroPeso registro, ILogger<LectorBasculaService> logger)
    {
        _registro = registro;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var serialPort = new SerialPort(_puertoCom, 9600, Parity.None, 8, StopBits.One);

                // Tiempos de espera para que no se quede congelado
                serialPort.ReadTimeout = 1000;
                serialPort.WriteTimeout = 500;

                serialPort.Open();
                _logger.LogInformation($"[OK] Báscula conectada en el puerto {_puertoCom}");

                while (serialPort.IsOpen && !stoppingToken.IsCancellationRequested)
                {
                    // Si la Mettler Toledo está en modo SICS, debemos pedirle el dato
                    if (_esModoSICS)
                    {
                        serialPort.WriteLine("S"); // Comando estándar de Mettler Toledo
                        await Task.Delay(200, stoppingToken); // Darle tiempo de responder
                    }

                    if (serialPort.BytesToRead > 0)
                    {
                        string datoCrudo = serialPort.ReadLine();

                        // Limpieza: Buscar solo el número dentro de todo lo que envíe la báscula
                        // Ej. Convierte "S S   15.50 kg" en "15.50"
                        Match match = Regex.Match(datoCrudo, @"[-+]?[0-9]*\.?[0-9]+");

                        if (match.Success)
                        {
                            _registro.UltimoPeso = match.Value;
                        }
                    }

                    // Pausa ligera para no consumir toda la CPU
                    await Task.Delay(100, stoppingToken);
                }
            }
            catch (UnauthorizedAccessException)
            {
                _logger.LogWarning($"El puerto {_puertoCom} está ocupado por otro programa (¿Tienes PuTTY abierto?). Reintentando...");
            }
            catch (Exception)
            {
                _logger.LogWarning($"Esperando conexión con la báscula en {_puertoCom}... (Revisar cable)");
            }

            // Si falla o se desconecta, espera 3 segundos y vuelve a intentar el ciclo completo
            await Task.Delay(3000, stoppingToken);
        }
    }
}