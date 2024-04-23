using TBOTBackend.Model;

namespace TBOTBackend.Repositories;

public interface IExpenseRepository
{
    Task<List<Expense>> GetAll();
    Task<List<Expense>> GetAllByUserId(int userId);
    Task<Expense?> GetById(int id);
    void AddExpense(Expense expense);
    void DeleteExpense(Expense expense);
}