using System.ComponentModel.DataAnnotations;

namespace TBOTBackend.Contracts;

public record RegistrationRequest(
    [Required]string Username,
    [Required]string Email,
    [Required]string Password);