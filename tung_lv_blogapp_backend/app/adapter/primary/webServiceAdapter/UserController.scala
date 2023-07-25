package adapter.primary.webServiceAdapter

import adapter.primary.httpResponse.UserResponse
import domain.service.UserService
import domain.service.dto.user.UserForm
import play.api.libs.json.Json
import play.api.mvc._

import javax.inject.{Inject, Singleton}

@Singleton
class UserController @Inject() (
    val userService:          UserService,
    val authAction:           AuthAction,
    val controllerComponents: ControllerComponents
) extends BaseController {

  def login: Action[AnyContent] = Action { implicit request =>
    val form = UserForm.extractData(request)

    val loginDTO = userService.login(form.email, form.password)

    UserResponse.LoginResponse(loginDTO)
  }

  def register: Action[AnyContent] = Action { implicit request =>
    val form = UserForm.extractData(request)

    val registerDTO = userService.register(form.email, form.username, form.password)

    UserResponse.RegisterResponse(registerDTO)
  }

  def logout: Action[AnyContent] = authAction {
    Ok(Json.obj("success" -> true, "message" -> "You are now logged out!"))
      .discardingCookies(DiscardingCookie("jwtToken"), DiscardingCookie("userId")).withNewSession
  }

  def ajaxValidateEmail: Action[AnyContent] = Action { implicit request =>
    val json  = request.body.asJson.get
    val email = (json \ "email").as[String]

    userService.findUserByEmail(email) match {
      case None    => Ok
      case Some(_) => UnprocessableEntity("This email is already registered!")
    }
  }

  def ajaxValidateUsername: Action[AnyContent] = Action { implicit request =>
    val json     = request.body.asJson.get
    val username = (json \ "username").as[String]

    userService.findUserByUsername(username) match {
      case None    => Ok
      case Some(_) => UnprocessableEntity("Username already exists!")
    }
  }
}
