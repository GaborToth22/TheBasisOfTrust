using Microsoft.EntityFrameworkCore;
using TBOTBackend.Data;
using TBOTBackend.Model;

namespace TBOTBackend.Repositories;

public class ExpenseRepository : IExpenseRepository
{
    private readonly DatabaseContext _dbContext;
    
    public ExpenseRepository(DatabaseContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public async Task<List<Expense>> GetAll()
    {
        return await _dbContext.Expenses.ToListAsync();
    }

    public async Task<List<Expense>> GetAllByUserId(int userId)
    {
        return await _dbContext.Expenses.Where(e => e.Participants.Any(p => p.UserId == userId))
            .ToListAsync();
    }

    public async Task<Expense?> GetById(int id)
    {
        return await _dbContext.Expenses.FirstOrDefaultAsync(e => e.Id == id);
    }

    public void AddExpense(Expense expense)
    {
        _dbContext.Add(expense);
        _dbContext.SaveChanges();
    }

    public void DeleteExpense(Expense expense)
    {
        _dbContext.Remove(expense);
        _dbContext.SaveChanges();
    }
}