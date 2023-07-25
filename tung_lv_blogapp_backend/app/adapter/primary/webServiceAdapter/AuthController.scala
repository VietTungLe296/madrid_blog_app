package adapter.primary.webServiceAdapter

import domain.entity.User
import domain.repository.UserRepository
import domain.service.dto.user.UserForm
import play.api.http.Status._
import play.api.libs.json.Json
import play.api.mvc._
import utils.jwt.JWTUtils

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

case class UserRequest[A](user: UserForm, request: Request[A]) extends WrappedRequest(request)

class AuthAction @Inject() (bodyParser: BodyParsers.Default, jwtUtils: JWTUtils, userRepository: UserRepository)(implicit
    ec:                                 ExecutionContext
) extends ActionBuilder[UserRequest, AnyContent] {

  override def parser: BodyParser[AnyContent] = bodyParser

  override def invokeBlock[T](request: Request[T], block: UserRequest[T] => Future[Result]): Future[Result] =
    getUser(request).map { user =>
      val login = UserForm(Some(user.email), Some(user.username), Some(user.password))
      block(UserRequest(login, request))
    }.getOrElse(Future.successful(Results.Unauthorized(Json.obj(
      "success" -> false,
      "error"   -> Json.obj(
        "message" -> "Unauthorized - Access is denied due to invalid credentials",
        "code"    -> UNAUTHORIZED)))))

  private def getUser[T](request: Request[T]): Option[User] =
    for {
      token <- extractToken(request)
      if jwtUtils.validateToken(token).isRight
      email <- jwtUtils.getEmailFromToken(token).toOption
      user  <- userRepository.findUserByEmail(email)
    } yield user

  private def extractToken[T](request: Request[T]): Option[String] =
    request.cookies.get("jwtToken").flatMap(cookie => Some(cookie.value))

  override protected def executionContext: ExecutionContext = ec
}
