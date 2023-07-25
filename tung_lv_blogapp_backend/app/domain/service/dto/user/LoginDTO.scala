package domain.service.dto.user

case class LoginDTO(userId: Long, username: String, email: String, token: String)
