using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using TBOTBackend.Data;
using TBOTBackend.Repositories;
using TBOTBackend.Services.Authentication;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

AddServices();
ConfigureSwagger();
AddDbContext();
AddAuthentication();
AddIdentity();

var app = builder.Build();

//ezt csak a native miatt tettem be hogy testeléshez átengedjen mindent 
app.UseCors(options =>
{
    options.AllowAnyOrigin() // Vagy megadhatod az engedélyezett eredeti URL-eket is: options.WithOrigins("http://localhost:8081")
        .AllowAnyMethod()
        .AllowAnyHeader();
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
await app.Services.InitializeDbAsync();

app.Run();

void AddServices()
{
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddScoped<IUserRepository, UserRepository>();
    builder.Services.AddScoped<IFriendshipRepository, FriendshipRepository>();
    builder.Services.AddScoped<IBalanceRepository, BalanceRepository>();
    builder.Services.AddScoped<IExpenseRepository, ExpenseRepository>();
    builder.Services.AddScoped<IAuthService, AuthService>();
    builder.Services.AddScoped<ITokenService, TokenService>();
}

void AddAuthentication()
{
    builder.Services
        .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddCookie(options => { options.Cookie.Name = "token"; })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters()
            {
                ClockSkew = TimeSpan.Zero,
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = builder.Configuration["JwtSettings:ValidIssuer"],
                ValidAudience = builder.Configuration["JwtSettings:ValidAudience"],
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(
                        builder.Configuration["JwtSettings:IssuerSigningKey"])
                ),
            };

            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    context.Token = context.Request.Cookies["token"];
                    return Task.CompletedTask;
                }
            };
        });
}

void AddDbContext()
{
    builder.Services.AddDbContext<DatabaseContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("TBOT") ?? throw new InvalidOperationException("Connection string 'TBOT' not found.")));
    builder.Services.AddDbContext<UsersContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("TBOT") ?? throw new InvalidOperationException("Connection string 'TBOT' not found.")));
}

void AddIdentity()
{
    builder.Services
        .AddIdentityCore<IdentityUser>(options =>
        {
            options.SignIn.RequireConfirmedAccount = false;
            options.User.RequireUniqueEmail = true;
            options.Password.RequireDigit = false;
            options.Password.RequiredLength = 6;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireLowercase = false;
        })
        .AddEntityFrameworkStores<UsersContext>();
}

void ConfigureSwagger()
{
    builder.Services.AddSwaggerGen(option =>
    {
        option.SwaggerDoc("v1", new OpenApiInfo { Title = "Demo API", Version = "v1" });
        option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            In = ParameterLocation.Header,
            Description = "Please enter a valid token",
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            BearerFormat = "JWT",
            Scheme = "Bearer"
        });
        option.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                new string[] { }
            }
        });
    });
}