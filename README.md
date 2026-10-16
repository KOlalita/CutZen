# CutZen

Aplicación web para gestionar una barbería: los clientes reservan cita online, los barberos controlan su agenda y el administrador gestiona el negocio desde un panel propio.

![.NET 8](https://img.shields.io/badge/.NET-8-512BD4?logo=dotnet&logoColor=white)
![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![SQL Server](https://img.shields.io/badge/SQL%20Server-EF%20Core-CC2927?logo=microsoftsqlserver&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)

## Funcionalidades

La aplicación tiene tres roles, cada uno con su propia interfaz protegida por rutas según el rol.

**Cliente** (`/dashboard`)
- Registro e inicio de sesión.
- Consulta de barberos y servicios disponibles.
- Reserva de citas eligiendo servicio, barbero y un hueco horario calculado según la disponibilidad real del barbero.
- Selección del método de pago (tarjeta, efectivo o pago móvil).
- Historial de citas, próxima cita destacada, perfil e información de la barbería.
- Modo oscuro.

**Barbero** (`/barber`)
- Agenda de citas propias y actualización de su estado (pendiente, cancelada, completada).
- Estadísticas de su actividad.

**Administrador** (`/admin`)
- Gestión de usuarios, clientes y barberos (alta, edición y baja lógica).
- Catálogo de servicios: precio, duración, descripción e imagen.
- Vista global de todas las citas.
- Configuración del horario semanal de cada barbero: jornada, descanso y días activos.

## Arquitectura

```
CutZen/
├── CutZenApi/      API REST en ASP.NET Core (.NET 8)
│   └── CutZenApi/
│       ├── Controllers/   Auth, Client, Barber, Admin
│       ├── Services/      Lógica de negocio tras interfaces (inyección de dependencias)
│       ├── Models/        User, Service, Appointment, Availability
│       ├── DTOs/          Contratos de entrada y salida
│       ├── Migrations/    Migraciones de EF Core
│       └── Data/          AppDbContext
└── CutZenClient/   SPA en React 19 + Vite
    └── src/
        ├── Pages/         Auth, Booking, Barber y Admin dashboards
        ├── components/    Vistas por rol y componentes compartidos
        ├── api/           Cliente HTTP y llamadas de autenticación
        └── hooks/         useDarkMode
```

### Stack

| Capa | Tecnología |
|---|---|
| Cliente | React 19, Vite, React Router 7, Tailwind CSS 4, Flowbite React, Lucide |
| API | ASP.NET Core 8, controladores, Swagger (Swashbuckle) |
| Datos | Entity Framework Core 8 con SQL Server |
| Autenticación | JWT Bearer, contraseñas con BCrypt, autorización por roles |

### API

Todos los endpoints cuelgan de `/api`. Salvo `auth`, requieren token JWT.

| Prefijo | Rol | Operaciones |
|---|---|---|
| `auth` | Público | `POST register`, `POST login` |
| `client` | Cualquier usuario autenticado | Barberos, servicios, huecos disponibles (`available-slots`), citas (listar y crear), perfil, información |
| `barber` | Barbero | Citas, estadísticas, actualizar cita |
| `admin` | Administrador | Usuarios, barberos, servicios, citas y horarios (`barbers/{id}/schedule`) |

Con la API en ejecución en modo Development, Swagger UI documenta todos los endpoints.

## Puesta en marcha

### Requisitos
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) 20 o superior
- SQL Server (LocalDB basta en Windows)

### 1. API

```bash
cd CutZenApi/CutZenApi
```

Configura la cadena de conexión y la clave JWT. Para no guardar secretos en el repositorio, usa *user secrets*:

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=(localdb)\\MSSQLLocalDB;Database=CutZenApi;Trusted_Connection=True;TrustServerCertificate=True;"
dotnet user-secrets set "JwtSettings:Key" "<clave-aleatoria-de-al-menos-32-caracteres>"
```

Aplica las migraciones y arranca:

```bash
dotnet ef database update
dotnet run
```

### 2. Cliente

```bash
cd CutZenClient
npm install
```

Crea un archivo `.env` con la URL de la API:

```env
VITE_API_BASE_URL=https://localhost:<puerto-de-la-api>
```

```bash
npm run dev
```

Otros scripts: `npm run build` (build de producción), `npm run lint`, `npm run preview`.

## Modelo de datos

- **User**: nombre, teléfono, descripción, rol (`Admin`, `Barber`, `Client`) y baja lógica (`IsActive`).
- **Service**: nombre, precio, duración en minutos, descripción, imagen y estado.
- **Availability**: por barbero y día de la semana, con hora de inicio y fin y descanso opcional.
- **Appointment**: cliente, barbero, servicio, inicio y fin, estado y método de pago.

## Autor

**Adriano Paniagua Quiroga**
