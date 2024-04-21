using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TBOTBackend.Data;

public static class DataExtension
{
    public static async Task InitializeDbAsync(this IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var databaseContext = scope.ServiceProvider.GetRequiredService<DatabaseContext>();
        var usersContext = scope.ServiceProvider.GetRequiredService<UsersContext>();

        if (!await databaseContext.Database.CanConnectAsync() || !await AllMigrationsApplied(databaseContext))
        {
            await databaseContext.Database.MigrateAsync();
        }

        if (!await usersContext.Database.CanConnectAsync() || !await AllMigrationsApplied(usersContext))
        {
            await usersContext.Database.MigrateAsync();
        }
    }

    private static async Task<bool> AllMigrationsApplied(DbContext context)
    {
        var applied = await context.GetService<IHistoryRepository>()
            .GetAppliedMigrationsAsync();

        var total = context.GetService<IMigrationsAssembly>().Migrations.Select(m => m.Key);

        return !total.Except(applied.Select(m => m.MigrationId)).Any();
    }
}