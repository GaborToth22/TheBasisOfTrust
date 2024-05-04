using Microsoft.AspNetCore.Mvc;
using TBOTBackend.Model;
using TBOTBackend.Repositories;

namespace TBOTBackend.Controllers;

[ApiController]
[Route("friendship")]

public class FriendshipController : ControllerBase
{
    private readonly ILogger<FriendshipController> _logger;
    private readonly IFriendshipRepository _friendshipRepository;

    public FriendshipController(ILogger<FriendshipController> logger, IFriendshipRepository friendshipRepository)
    {
        _logger = logger;
        _friendshipRepository = friendshipRepository;
    }
    
    [HttpPost("sendRequest/{senderId}/{receiverId}")]
    public async Task<IActionResult> SendFriendRequest(int senderId, int receiverId)
    {
        var message = await _friendshipRepository.SendFriendRequest(senderId, receiverId);
        return Ok(new { message });
    }

    [HttpPut("acceptRequest/{senderId}/{receiverId}")]
    public async Task<IActionResult> AcceptFriendRequest(int senderId, int receiverId)
    {
        var message = await _friendshipRepository.AcceptFriendRequest(senderId, receiverId);
        return Ok(new { message });
    }

    [HttpDelete("declineRequest/{senderId}/{receiverId}")]
    public async Task<IActionResult> DeclineFriendRequest(int senderId, int receiverId)
    {
        var message = await _friendshipRepository.DeclineFriendRequest(senderId, receiverId);
        return Ok(new { message });
    }
    
    [HttpGet("{userId}")]
    public async Task<ActionResult<List<Friendship>>> GetAllFriendships(int userId)
    {
        try
        {
            var friendships = await _friendshipRepository.GetAllFriendshipsById(userId);
            return Ok(friendships);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error");
        }
    }
}