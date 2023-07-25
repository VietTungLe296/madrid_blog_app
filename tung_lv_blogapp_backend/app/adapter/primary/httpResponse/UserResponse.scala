package adapter.primary.httpResponse

import domain.service.dto.user.{LoginDTO, RegisterDTO}
import play.api.libs.json.{Json, OFormat}
import play.api.mvc.{Cookie, Result, Results}

object UserResponse extends Results {

  implicit val loginFormat: OFormat[LoginDTO]       = Json.format[LoginDTO]
  implicit val registerFormat: OFormat[RegisterDTO] = Json.format[RegisterDTO]

  def LoginResponse(user: LoginDTO): Result =
    Ok(Json.obj(
      "success" -> true,
      "message" -> "Login successfully!",
      "user"    -> user))
      .withCookies(Cookie(name = "userId", value = user.userId.toString, maxAge = Some(1800), httpOnly = true))
      .withCookies(Cookie(name = "jwtToken", value = user.token, maxAge = Some(1800), httpOnly = true))

  def RegisterResponse(user: RegisterDTO): Result =
    Ok(Json.obj(
      "success" -> true,
      "message" -> "Create new account successfully!",
      "user"    -> user
    ))
}
