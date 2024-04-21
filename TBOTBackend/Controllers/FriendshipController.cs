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
    
    [HttpPost("sendRequest")]
    public async Task<IActionResult> SendFriendRequest(int senderId, int receiverId)
    {
        await _friendshipRepository.SendFriendRequest(senderId, receiverId);
        return Ok("Friend request sent successfully.");
    }

    [HttpPut("acceptRequest")]
    public async Task<IActionResult> AcceptFriendRequest(int senderId, int receiverId)
    {
        await _friendshipRepository.AcceptFriendRequest(senderId, receiverId);
        return Ok("Friend request accepted successfully.");
    }

    [HttpDelete("declineRequest")]
    public async Task<IActionResult> DeclineFriendRequest(int senderId, int receiverId)
    {
        await _friendshipRepository.DeclineFriendRequest(senderId, receiverId);
        return Ok("Friend request declined successfully.");
    }
}