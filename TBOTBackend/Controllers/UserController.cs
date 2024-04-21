using Microsoft.AspNetCore.Mvc;
using TBOTBackend.Model;
using TBOTBackend.Repositories;

namespace TBOTBackend.Controllers;

[ApiController]
[Route("users")]
public class UserController : ControllerBase
{
    private readonly ILogger<UserController> _logger;
    private readonly IUserRepository _userRepository;

    public UserController(IUserRepository userRepository, ILogger<UserController> logger)
    {
        _logger = logger;
        _userRepository = userRepository;
    }
    
    [HttpGet]
    public async Task<ActionResult<IList<User>>> GetAll()
    {
        try
        {
            return Ok(await _userRepository.GetAll());
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error getting ads data.");
            return NotFound("Error getting ads data.");
        }
    }
    
    [HttpGet("{username}")]
    public async Task<ActionResult<User>> GetUserByUsername(string username)
    {
        try
        {
            var user = await _userRepository.GetUserByUsername(username);
            return Ok(user);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error getting user data.");
            return NotFound("Error getting user data.");
        }
    }
    
    [HttpGet("{email}")]
    public async Task<ActionResult<User>> GetUserByEmail(string email)
    {
        try
        {
            var user = await _userRepository.GetUserByEmail(email);
            return Ok(user);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error getting user data.");
            return NotFound("Error getting user data.");
        }
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUserById(int id)
    {
        try
        {
            var user = await _userRepository.GetUserById(id);
            return Ok(user);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error getting user data.");
            return NotFound("Error getting user data.");
        }
    }
}