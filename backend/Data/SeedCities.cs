using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using MentalHealthApp.Models;
using MentalHealthApp.Data;
using System.Text.Json.Serialization;

public static class SeedCities
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        using (var context = serviceProvider.GetRequiredService<ApplicationDbContext>())
        {
            if (context.Cities.Any())
            {
                Console.WriteLine("⚠️ Orașele există deja în baza de date.");
                return;
            }

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "cities500.json");
            if (!File.Exists(filePath))
            {
                Console.WriteLine($"❌ Fișierul {filePath} nu a fost găsit!");
                return;
            }

            Console.WriteLine("📂 Citind fișierul JSON...");
            var jsonData = await File.ReadAllTextAsync(filePath);
            var cities = JsonSerializer.Deserialize<List<CityJsonModel>>(jsonData);

            if (cities == null || !cities.Any())
            {
                Console.WriteLine("❌ Fișierul JSON este gol sau corupt!");
                return;
            }

            Console.WriteLine($"✅ {cities.Count} orașe încărcate din JSON!");

            var newCities = cities
                .Select(c => new City
                {
                    
                    Name = c.Name,
                    NameAscii = c.NameAscii,
                    Country = c.Country,
                    Iso2 = c.Iso2,
                    Iso3 = c.Iso3,
                    Admin1 = c.Admin1,
                    Capital = c.Capital,
                    Lat = double.TryParse(c.Lat, out var lat) ? lat : 0,
                    Lon = double.TryParse(c.Lon, out var lon) ? lon : 0,
                    Pop = int.TryParse(c.Pop, out var pop) ? pop : 0
                }).ToList();

            Console.WriteLine($"📝 Adăugând {newCities.Count} orașe în baza de date...");
            await context.Cities.AddRangeAsync(newCities);
            await context.SaveChangesAsync();

            Console.WriteLine($"✅ {newCities.Count} orașe adăugate cu succes!");
        }
    }

}


public class CityJsonModel
{
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("city")]
    public string Name { get; set; }

    [JsonPropertyName("city_ascii")]
    public string NameAscii { get; set; }  // Variantă ASCII a numelui orașului

    [JsonPropertyName("country")]
    public string Country { get; set; }

    [JsonPropertyName("iso2")]
    public string Iso2 { get; set; }

    [JsonPropertyName("iso3")]
    public string Iso3 { get; set; }

    [JsonPropertyName("admin_name")]
    public string Admin1 { get; set; }

    [JsonPropertyName("capital")]
    public string Capital { get; set; }

    [JsonPropertyName("lat")]
    public string Lat { get; set; }

    [JsonPropertyName("lng")]
    public string Lon { get; set; }

    [JsonPropertyName("population")]
    public string Pop { get; set; }
}
