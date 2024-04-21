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

    public async Task<User?> GetUserByUserName(string userName)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == userName);
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