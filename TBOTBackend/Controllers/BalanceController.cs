using Microsoft.AspNetCore.Mvc;
using TBOTBackend.Model;
using TBOTBackend.Repositories;

namespace TBOTBackend.Controllers;

[ApiController]
[Route("balance")]

public class BalanceController : ControllerBase
{
    private readonly ILogger<BalanceController> _logger;
    private readonly IBalanceRepository _balanceRepository;

    public BalanceController(ILogger<BalanceController> logger, IBalanceRepository balanceRepository)
    {
        _logger = logger;
        _balanceRepository = balanceRepository;
    }
    
    [HttpGet("{userId}")]
    public async Task<ActionResult<List<Balance>>> GetBalancesByUserId(int userId)
    {
        try
        {
            var balances = await _balanceRepository.GetAllByUserId(userId);
            if (balances == null)
            {
                return NotFound();
            }
            return Ok(balances);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching balances for user {UserId}", userId);
            return StatusCode(500, "Internal server error");
        }
    }
}