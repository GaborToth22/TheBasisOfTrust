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
            e.HasOne(e => e.Payer)
                .WithMany()
                .HasForeignKey(e => e.PaidById)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);

            e.Property(s => s.Amount)
                .HasColumnType("decimal(18, 2)");
        });
        
        builder.Entity<ExpenseParticipant>(e =>
        {
            e.HasKey(ep => new { ep.ExpenseId, ep.UserId });
            
            e.HasOne(ep => ep.Expense)
                .WithMany(e => e.Participants)
                .HasForeignKey(ep => ep.ExpenseId);
            
            e.HasOne(ep => ep.User)
                .WithMany()
                .HasForeignKey(ep => ep.UserId);
        });
        
        builder.Entity<Balance>(e =>
        {
            e.HasOne(b => b.Expense)
                .WithMany()
                .HasForeignKey(b => b.ExpenseId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(b => b.User)
                .WithMany()
                .HasForeignKey(b => b.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);
            
            e.HasOne(b => b.ParticipantUser)
                .WithMany()
                .HasForeignKey(b => b.ParticipantUserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);
        });
        
        builder.Entity<Friendship>(e =>
        {
            e.Property(f => f.Id)
                .ValueGeneratedOnAdd();
            e.HasKey(f => f.Id);
            
            e.HasOne(f => f.Sender)
                .WithMany(u => u.FriendshipsSent)
                .HasForeignKey(f => f.SenderId)
                .OnDelete(DeleteBehavior.NoAction);

            e.HasOne(f => f.Receiver)
                .WithMany(u => u.FriendshipsReceived)
                .HasForeignKey(f => f.ReceiverId)
                .OnDelete(DeleteBehavior.NoAction);
        });
        
        
        base.OnModelCreating(builder);
    }
}