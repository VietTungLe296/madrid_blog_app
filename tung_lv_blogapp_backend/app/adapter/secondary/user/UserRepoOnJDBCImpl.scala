package adapter.secondary.user

import domain.entity.{User, UserID}
import domain.repository.UserRepository
import scalikejdbc.{DB, scalikejdbcSQLInterpolationImplicitDef}
import utils.bcrypt.BCryptHashing

import scala.util.{Failure, Success, Try}

class UserRepoOnJDBCImpl extends UserRepository {

  override def register(email: String, username: String, password: String): Try[User] =
    try
      DB localTx { implicit session =>
        val u            = UserDAO.column
        val userId: Long = UserDAO.createWithNamedValues(
          u.email    -> email,
          u.username -> username,
          u.password -> BCryptHashing.hash(password)
        ).value

        val newUser =
          UserDAO.findById(UserID(userId)).getOrElse(throw new IllegalStateException("Failed to retrieved user after registration!"))
        Success(newUser)
      }
    catch {
      case e: Throwable => Failure(e)
    }

  override def checkPassword(user: User, passwordLogin: String): Boolean =
    BCryptHashing.verify(passwordLogin, user.password)

  override def findUserByUsername(username: String): Option[User] = UserDAO.findBy(sqls"username = $username")

  override def findUserByEmail(email: String): Option[User] = UserDAO.findBy(sqls"email = $email")

  override def findUserByID(userId: Long): Option[User] = UserDAO.findById(UserID(userId))
}
