using TBOTBackend.Model;

namespace TBOTBackend.Repositories;

public interface IBalanceRepository
{
    void AddBalance(Expense expense);
    void DeleteBalance(Balance balance);
    Task<List<Balance>> GetAllByUserId(int userId);
}