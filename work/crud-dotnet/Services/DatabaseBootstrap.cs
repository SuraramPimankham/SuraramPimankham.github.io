using Npgsql;

namespace CrudDotNet.Services;

public static class DatabaseBootstrap
{
    private const string CreateItemsSql = """
        CREATE TABLE IF NOT EXISTS items (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT NOT NULL DEFAULT '',
            image TEXT NOT NULL DEFAULT ''
        );
        """;

    public static void EnsureSchema(NpgsqlDataSource dataSource)
    {
        using var conn = dataSource.OpenConnection();
        using var cmd = new NpgsqlCommand(CreateItemsSql, conn);
        cmd.ExecuteNonQuery();
    }
}
