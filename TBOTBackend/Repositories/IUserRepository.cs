using TBOTBackend.Model;

namespace TBOTBackend.Repositories;

public interface IUserRepository
{
    void AddUserToDb(string username, string email);
    Task<List<User>> GetAll();
    Task<User?> GetUserByUsername(string username);
    Task<User?> GetUserById(int id);
    Task<User?> GetUserByEmail(string email);
    void UpdateUser(User user);
    void DeleteUser(User user);
}