using Microsoft.EntityFrameworkCore;
using TBOTBackend.Data;
using TBOTBackend.Model;

namespace TBOTBackend.Repositories;

public class ExpenseRepository : IExpenseRepository
{
    private readonly DatabaseContext _dbContext;
    private readonly IUserRepository _userRepository;
    
    public ExpenseRepository(DatabaseContext dbContext, IUserRepository userRepository)
    {
        _dbContext = dbContext;
        _userRepository = userRepository;
    }
    
    public async Task<List<Expense>> GetAll()
    {
        return await _dbContext.Expenses.ToListAsync();
    }

    public async Task<List<Expense>> GetAllByUserId(int userId)
    {
        var expensesWithUserIds = await _dbContext.Expenses
            .Where(e => e.Participants.Any(p => p.UserId == userId))
            .Include(e => e.Participants)
            .ToListAsync();
        
        foreach (var expense in expensesWithUserIds)
        {
            foreach (var participant in expense.Participants)
            {
                var user = await _userRepository.GetUserById(participant.UserId);
                if (user != null)
                {
                    participant.Username = user.Username;
                }
            }
        }

        return expensesWithUserIds;
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