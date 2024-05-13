using Microsoft.EntityFrameworkCore;
using TBOTBackend.Data;
using TBOTBackend.Model;

namespace TBOTBackend.Repositories;

public class BalanceRepository : IBalanceRepository
{
    private readonly DatabaseContext _dbContext;
    
    public BalanceRepository(DatabaseContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public void AddBalance(Expense expense)
    {
        if (expense.Split == Split.Equally)
        {
            foreach (var participant in expense.Participants)
            {
                if (participant.UserId != expense.PaidById)
                {
                    var balance = new Balance
                    {
                        ExpenseId = expense.Id,
                        UserId = expense.PaidById,
                        Amount = expense.Amount / expense.Participants.Count,
                        ParticipantUserId = participant.UserId,
                    };
                    _dbContext.Balances.Add(balance);
                }
            }
        }
        else if (expense.Split == Split.YouOwe)
        {
            foreach (var participant in expense.Participants)
            {
                if (participant.UserId != expense.PaidById)
                {
                    var balance = new Balance
                    {
                        ExpenseId = expense.Id,
                        UserId = expense.PaidById,
                        Amount = expense.Amount ,
                        ParticipantUserId = participant.UserId,
                    };
                    _dbContext.Balances.Add(balance);
                }
            }
        }
        else if (expense.Split == Split.OwesYou)
        {
            foreach (var participant in expense.Participants)
            {
                if (participant.UserId != expense.PaidById)
                {
                    var balance = new Balance
                    {
                        ExpenseId = expense.Id,
                        UserId = expense.PaidById,
                        Amount = expense.Amount ,
                        ParticipantUserId = participant.UserId,
                    };
                    _dbContext.Balances.Add(balance);
                }
            }
        }
        _dbContext.SaveChanges();
    }

    public void DeleteBalance(Balance balance)
    {
        _dbContext.Remove(balance);
        _dbContext.SaveChanges();
    }

    public async Task<List<Balance>> GetAllByUserId(int userId)
    {
        return await _dbContext.Balances
            .Where(b => b.UserId == userId || b.ParticipantUserId == userId)
            .ToListAsync();
    }
}