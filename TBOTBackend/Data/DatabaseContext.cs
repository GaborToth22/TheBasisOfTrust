using Microsoft.EntityFrameworkCore;
using TBOTBackend.Model;

namespace TBOTBackend.Data;

public class DatabaseContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Expense> Expenses { get; set; }
    public DbSet<Balance> Balances { get; set; }
    public DbSet<ExpenseParticipant> ExpenseParticipants { get; set; }
    public DbSet<Friendship> Friendships { get; set; }

    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        
        builder.Entity<Expense>(e =>
        {
            e.HasKey(e => e.Id);

            e.Property(e => e.Amount)
                .HasColumnType("decimal(18, 2)");

            e.HasOne<User>()
                .WithMany()
                .HasForeignKey(e => e.PaidById)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);
        });
        
        builder.Entity<ExpenseParticipant>(e =>
        {
            e.HasKey(ep => new { ep.ExpenseId, ep.UserId });
        });
        
        builder.Entity<Balance>(e =>
        {
            e.HasKey(b => b.Id);

            e.Property(b => b.Amount)
                .IsRequired();

            e.Property(b => b.ExpenseId)
                .IsRequired();

            e.Property(b => b.UserId)
                .IsRequired(); 

            e.Property(b => b.ParticipantUserId)
                .IsRequired(); 
            
            e.HasIndex(b => b.ExpenseId);
            e.HasIndex(b => b.UserId);
            e.HasIndex(b => b.ParticipantUserId);

            e.HasOne<Expense>()
                .WithMany()
                .HasForeignKey(b => b.ExpenseId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne<User>()
                .WithMany()
                .HasForeignKey(b => b.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);
        
            e.HasOne<User>()
                .WithMany()
                .HasForeignKey(b => b.ParticipantUserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);
        });
        
        builder.Entity<Friendship>(e =>
        {
            e.HasKey(f => f.Id);

            e.Property(f => f.Id)
                .ValueGeneratedOnAdd();

            e.HasOne<User>()
                .WithMany(u => u.FriendshipsSent)
                .HasForeignKey(f => f.SenderId)
                .OnDelete(DeleteBehavior.NoAction);

            e.HasOne<User>()
                .WithMany(u => u.FriendshipsReceived)
                .HasForeignKey(f => f.ReceiverId)
                .OnDelete(DeleteBehavior.NoAction);
        });
        
        
        base.OnModelCreating(builder);
    }
}