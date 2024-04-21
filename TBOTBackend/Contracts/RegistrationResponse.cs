using System.ComponentModel.DataAnnotations;

namespace TBOTBackend.Contracts;

public record RegistrationResponse(
    [Required]string Email,
    [Required]string Username);