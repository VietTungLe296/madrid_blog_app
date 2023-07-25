package adapter.secondary.post

import domain.entity.{Post, PostID, UserID}
import scalikejdbc._
import skinny.orm.{Alias, SkinnyCRUDMapperWithId}

import scala.util.Random

object PostDAO extends SkinnyCRUDMapperWithId[PostID, Post] with SQLSyntaxSupport[Post] {

  implicit val session: AutoSession = AutoSession

  override val tableName = "post"

  override val columns: collection.Seq[String] = Seq("id", "userId", "author", "title", "content", "thumbnail", "createdAt", "updatedAt")

  override def useSnakeCaseColumnName: Boolean = false

  override def defaultAlias: Alias[Post] = createAlias("p")

  override def idToRawValue(id: PostID): Any = id.value

  override def rawValueToId(value: Any): PostID = PostID(value.toString.toLong)

  override def extract(rs: WrappedResultSet, n: scalikejdbc.ResultName[Post]): Post =
    Post(
      id        = PostID(rs.get(n.column("id"))),
      userId    = UserID(rs.get(n.column("userId"))),
      author    = rs.get(n.column("author")),
      title     = rs.get(n.column("title")),
      content   = rs.get(n.column("content")),
      thumbnail = rs.get(n.column("thumbnail")),
      createdAt = rs.get(n.column("createdAt")),
      updatedAt = rs.get(n.column("updatedAt"))
    )

  override def useExternalIdGenerator = true

  override def generateId: PostID = PostID(Random.nextLong(10000000))
}
