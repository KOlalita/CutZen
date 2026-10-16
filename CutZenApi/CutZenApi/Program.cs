using CutZenApi.Configuration;
using CutZenApi.Data;
using CutZenApi.Services.Admin;
using CutZenApi.Services.Admin.Interfaces;
using CutZenApi.Services.Auth;
using CutZenApi.Services.Auth.Intefaces;
using CutZenApi.Services.Barber;
using CutZenApi.Services.Barber.Interfaces;
using CutZenApi.Services.Client;
using CutZenApi.Services.Client.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Add the connection string to the database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Authentication service
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings") //Bind the JwtSettings section of the configuration to the JwtSettings class
);


builder.Services.AddScoped<IClientService, ClientService>();
builder.Services.AddScoped<IBarberService, BarberService>();
builder.Services.AddScoped<IAdminService, AdminService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    var key = Encoding.UTF8.GetBytes(
    builder.Configuration["JwtSettings:Key"]
    );

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("CutZenPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "https://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// In app pipeline:
app.UseCors("CutZenPolicy");  // BEFORE UseAuthentication
app.UseAuthentication();
app.UseAuthorization();
//Serve static files (for profile pictures, etc.)
app.UseStaticFiles();

app.MapControllers();

app.Run();
