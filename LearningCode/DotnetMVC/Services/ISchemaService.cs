using DotnetMVC.Models;

namespace DotnetMVC.Services;

public interface ISchemaService
{
    FieldSchema GetSchema();
    object GetManifest();
}
