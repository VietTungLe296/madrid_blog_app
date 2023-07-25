package domain.service.dto.user

import play.api.libs.json.Json
import play.api.mvc.{AnyContent, Request}

case class UserForm(email: Option[String], username: Option[String], password: Option[String])

object UserForm {

  def extractData(request: Request[AnyContent]): UserForm = {
    val json     = request.body.asJson.getOrElse(Json.obj())
    val email    = (json \ "email").asOpt[String].filter(_.trim.nonEmpty)
    val username = (json \ "username").asOpt[String].filter(_.trim.nonEmpty)
    val password = (json \ "password").asOpt[String].filter(_.trim.nonEmpty)

    UserForm(email, username, password)
  }

  def isValidEmail(email: String): Boolean =
    email.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")

  def isValidUsername(username: String): Boolean =
    username.matches("^[A-Za-z][A-Za-z0-9_]{2,49}$")

  def isValidPassword(password: String): Boolean =
    password.matches("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{7,19}$")
}
