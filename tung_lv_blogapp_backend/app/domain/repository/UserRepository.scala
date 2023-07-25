package domain.repository

import domain.entity.User

import scala.util.Try

trait UserRepository {

  def register(email: String, username: String, password: String): Try[User]

  def checkPassword(user: User, passwordLogin: String): Boolean

  def findUserByUsername(username: String): Option[User]

  def findUserByEmail(email: String): Option[User]

  def findUserByID(userId: Long): Option[User]
}
