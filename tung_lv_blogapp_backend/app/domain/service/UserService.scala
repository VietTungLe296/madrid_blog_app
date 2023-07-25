package domain.service

import domain.entity.User
import domain.repository.UserRepository
import domain.service.dto.user.{LoginDTO, RegisterDTO, UserForm}
import exception.{EntryException, InvalidFieldException}
import utils.jwt.JWTUtils

import javax.inject.Inject
import scala.util.{Failure, Success}

class UserService @Inject() (val userRepository: UserRepository, val jwtUtils: JWTUtils) {

  def register(email: Option[String], username: Option[String], password: Option[String]): RegisterDTO =
    (email, username, password) match {
      case (Some(email), Some(username), Some(password)) =>
        (
          UserForm.isValidEmail(email),
          UserForm.isValidUsername(username),
          UserForm.isValidPassword(password),
          findUserByUsername(username).isEmpty,
          findUserByEmail(email).isEmpty) match {
          case (false, _, _, _, _) => throw new InvalidFieldException("Mail address must has format xxx@yyy.zzz!")
          case (_, false, _, _, _) => throw new InvalidFieldException(
              "Username must start with a letter, total length should be 3-50 characters including letters, numbers or underscores!")
          case (_, _, false, _, _) => throw new InvalidFieldException(
              "Password length should be 8-20 characters, including letters, at least one number and one special character!")
          case (_, _, _, false, _) => throw new EntryException("Username already exists!")
          case (_, _, _, _, false) => throw new EntryException("This email is already registered!")
          case _                   =>
            userRepository.register(email, username, password) match {
              case Success(user) => RegisterDTO(user.id.value, user.email, user.password)
              case Failure(_)    => throw new InternalError
            }
        }
      case _                                             => throw new InvalidFieldException("Please make sure email, username and password field are not empty!")
    }

  def findUserByUsername(username: String): Option[User] = userRepository.findUserByUsername(username)

  def login(email: Option[String], password: Option[String]): LoginDTO =
    (email, password) match {
      case (Some(email), Some(password)) =>
        findUserByEmail(email) match {
          case Some(user) =>
            if (userRepository.checkPassword(user, password)) {
              val jwtToken = jwtUtils.generateToken(user.email)
              LoginDTO(user.id.value, user.username, user.email, jwtToken)
            } else {
              throw new InvalidFieldException("Incorrect password!")
            }
          case _          => throw new EntryException("This email has not been registered with any account!")
        }
      case _                             => throw new InvalidFieldException("Please make sure email and password field are not empty!")
    }

  def findUserByEmail(email: String): Option[User] = userRepository.findUserByEmail(email)
}
