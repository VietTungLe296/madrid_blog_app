package adapter.primary.webServiceAdapter

import com.typesafe.scalalogging.Logger
import exception.{EntryException, InvalidCreatorException, InvalidFieldException, NotFoundException}
import play.api.http.HttpErrorHandler
import play.api.http.Status._
import play.api.libs.json.Json
import play.api.mvc.Results._
import play.api.mvc._

import javax.inject.Singleton
import scala.concurrent._

@Singleton
class ErrorHandler extends HttpErrorHandler {

  private val logger = Logger(getClass)

  def onClientError(request: RequestHeader, statusCode: Int, message: String): Future[Result] =
    Future.successful(
      Status(statusCode)(Json.obj(
        "success" -> false,
        "error"   -> Json.obj(
          "message" -> message,
          "code"    -> statusCode
        )
      ))
    )

  def onServerError(request: RequestHeader, exception: Throwable): Future[Result] =
    exception match {
      case e: EntryException =>
        Future.successful(
          BadRequest(Json.obj(
            "success" -> false,
            "error"   -> Json.obj(
              "message" -> e.getMessage,
              "code"    -> BAD_REQUEST))))

      case e: InvalidFieldException =>
        Future.successful(
          UnprocessableEntity(Json.obj(
            "success" -> false,
            "error"   -> Json.obj(
              "message" -> e.getMessage,
              "code"    -> UNPROCESSABLE_ENTITY))))

      case e: NotFoundException =>
        Future.successful(
          NotFound(Json.obj(
            "success" -> false,
            "error"   -> Json.obj(
              "message" -> e.getMessage,
              "code"    -> NOT_FOUND))))

      case e: InvalidCreatorException =>
        Future.successful(
          Forbidden(Json.obj(
            "success" -> false,
            "error"   -> Json.obj(
              "message" -> e.getMessage,
              "code"    -> FORBIDDEN))))

      case _ =>
        logger.error("INTERNAL ERROR => ", exception)

        Future.successful(
          InternalServerError(Json.obj(
            "success" -> false,
            "error"   -> Json.obj(
              "message" -> "Internal server error occurred!",
              "code"    -> INTERNAL_SERVER_ERROR))))
    }
}
