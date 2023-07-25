package utils.jwt

import io.jsonwebtoken._

import java.util.Date
import scala.util.{Failure, Success, Try}

class JWTUtils {

  private val jwtSecretKey = "tung_lv_bbs"

  def generateToken(payload: String): String =
    Jwts.builder()
      .setSubject(payload)
      .setIssuedAt(new Date())
      .setExpiration(new Date(new Date().getTime + 1800000))
      .signWith(SignatureAlgorithm.HS256, jwtSecretKey)
      .compact()

  def validateToken(authToken: String): Either[String, Claims] =
    Try(Jwts.parser().setSigningKey(jwtSecretKey).parseClaimsJws(authToken)) match {
      case Success(jws)                         => Right(jws.getBody)
      case Failure(e: SignatureException)       => Left(s"Invalid signature: ${e.getMessage}")
      case Failure(e: MalformedJwtException)    => Left(s"Invalid token: ${e.getMessage}")
      case Failure(e: ExpiredJwtException)      => Left(s"Token has expired:  ${e.getMessage}")
      case Failure(e: UnsupportedJwtException)  => Left(s"Unsupported token: ${e.getMessage}")
      case Failure(e: IllegalArgumentException) => Left(s"Invalid argument: ${e.getMessage}")
      case Failure(e)                           => Left(s"Unknown error: ${e.getMessage}")
    }

  def getEmailFromToken(token: String): Try[String] = Try {
    Jwts.parser().setSigningKey(jwtSecretKey).parseClaimsJws(token).getBody.getSubject
  }
}
