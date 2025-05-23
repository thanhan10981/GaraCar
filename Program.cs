using GaraCarAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using OfficeOpenXml;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    }); builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<GaraCarContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();
ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseStaticFiles();



app.UseHttpsRedirection();

// ✅ Sử dụng CORS
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
