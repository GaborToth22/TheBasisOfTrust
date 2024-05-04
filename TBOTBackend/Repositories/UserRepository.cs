using Microsoft.EntityFrameworkCore;
using TBOTBackend.Data;
using TBOTBackend.Model;

namespace TBOTBackend.Repositories;

public class UserRepository : IUserRepository
{
    
    private readonly DatabaseContext _dbContext;
    
    public UserRepository(DatabaseContext dbContext)
    {
        _dbContext = dbContext;
    }


    public void AddUserToDb(string username, string email)
    {
        _dbContext.Add(new User
        {
            Username = username,
            Email = email
        });
        _dbContext.SaveChanges();
    }
    public async Task<List<User>> GetAll()
    {
        return await _dbContext.Users.ToListAsync();
    }

    public async Task<User?> GetUserByUsername(string username)
    {
        return await _dbContext.Users
            .Include(u => u.FriendshipsSent)
                .ThenInclude(f => f.Receiver)
            .Include(u => u.FriendshipsSent)
                .ThenInclude(f => f.Sender)
            .Include(u => u.FriendshipsReceived)
                .ThenInclude(f => f.Sender)
            .Include(u => u.FriendshipsReceived)
                .ThenInclude(f => f.Receiver)
            .Where(u => u.Username == username)
            .Select(u => new User 
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                FriendshipsSent = u.FriendshipsSent.Select(f => new Friendship 
                {
                    Id = f.Id,
                    SenderId = f.SenderId,
                    ReceiverId = f.ReceiverId,
                    ReceiverName = f.Receiver.Username,
                    ReceiverEmail = f.Receiver.Email,
                    Accepted = f.Accepted
                    // Itt adhatsz meg más tulajdonságokat is, amelyekre szükséged van
                }).ToList(),
                FriendshipsReceived = u.FriendshipsReceived.Select(f => new Friendship 
                {
                    Id = f.Id,
                    SenderId = f.SenderId,
                    SenderName = f.Sender.Username,
                    SenderEmail = f.Sender.Email,
                    ReceiverId = f.ReceiverId,
                    Accepted = f.Accepted
                    // Itt adhatsz meg más tulajdonságokat is, amelyekre szükséged van
                }).ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<User?> GetUserById(int id)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
    }
    
    public async Task<User?> GetUserByEmail(string email)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public void UpdateUser(User user)
    {
        _dbContext.Update(user);
        _dbContext.SaveChanges();
    }

    public void DeleteUser(User user)
    {
        _dbContext.Remove(user);
        _dbContext.SaveChanges();
    }
}