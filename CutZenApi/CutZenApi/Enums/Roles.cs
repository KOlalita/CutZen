using System.Text.Json.Serialization;

namespace CutZenApi.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Roles
    {
        Admin = 1,
        Barber = 2,
        Client = 3
    }
}