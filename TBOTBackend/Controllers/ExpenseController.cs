using System.Collections.ObjectModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using TBOTBackend.Model;
using TBOTBackend.Repositories;

namespace TBOTBackend.Controllers;


[ApiController]
[Route("expense")]

public class ExpenseController : ControllerBase
{
    private readonly ILogger<ExpenseController> _logger;
    private readonly IExpenseRepository _expenseRepository;
    private readonly IBalanceRepository _balanceRepository;

    public ExpenseController(IExpenseRepository expenseRepository, ILogger<ExpenseController> logger, IBalanceRepository balanceRepository)
    {
        _logger = logger;
        _expenseRepository = expenseRepository;
        _balanceRepository = balanceRepository;
    }
    
    [HttpGet]
    public async Task<ActionResult<IList<Expense>>> GetAll()
    {
        try
        {
            return Ok(await _expenseRepository.GetAll());
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error getting ads data.");
            return NotFound("Error getting ads data.");
        }
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<Expense>> GetById(int id)
    {
        try
        {
            var expense = await _expenseRepository.GetById(id);
            return Ok(expense);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error getting user data.");
            return NotFound("Error getting user data.");
        }
    }
    
    [HttpPost]
    public ActionResult<Expense> CreateExpense([FromBody] ExpenseInputModel model)
    {
        try
        {
            var participants = new Collection<ExpenseParticipant>();
            foreach (var id in  model.ParticipantIds)
            {
                participants.Add(new ExpenseParticipant { UserId = id });
            }
            
            var expense = new Expense
            {
                Amount = model.Amount,
                Date = model.Date,
                Description = model.Description,
                PaidById = model.PaidById,
                Participants = participants,
                Split = (Split)model.Split
            };
            
            _expenseRepository.AddExpense(expense);
            _balanceRepository.AddBalance(expense);
            return Ok(expense);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error creating expense.");
            return BadRequest("Error creating expense.");
        }
    }
    
    [HttpDelete("{id}")]
    public async Task<ActionResult<Expense>> DeleteExpense(int id)
    {
        try
        {
            var expense = await _expenseRepository.GetById(id);
            _expenseRepository.DeleteExpense(expense);
            return Ok(expense);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error getting ad data.");
            return NotFound("Error getting ad data.");
        }
    }
}