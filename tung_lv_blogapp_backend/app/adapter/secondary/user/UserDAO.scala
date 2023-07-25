package adapter.secondary.user

import domain.entity.{User, UserID}
import scalikejdbc._
import skinny.orm.{Alias, SkinnyCRUDMapperWithId}

import scala.util.Random

object UserDAO extends SkinnyCRUDMapperWithId[UserID, User] with SQLSyntaxSupport[User] {

  implicit val session: AutoSession = AutoSession

  override val tableName = "user"

  override val columns: collection.Seq[String] = Seq("id", "email", "password", "username")

  override def useSnakeCaseColumnName: Boolean = false

  override def defaultAlias: Alias[User] = createAlias("u")

  override def idToRawValue(id: UserID): Any = id.value

  override def rawValueToId(value: Any): UserID = UserID(value.toString.toLong)

  override def extract(rs: WrappedResultSet, n: scalikejdbc.ResultName[User]): User =
    User(
      id       = UserID(rs.get(n.id)),
      username = rs.get(n.username),
      email    = rs.get(n.email),
      password = rs.get(n.password)
    )

  override def useExternalIdGenerator = true

  override def generateId: UserID = UserID(Random.nextLong(10000000))
}
