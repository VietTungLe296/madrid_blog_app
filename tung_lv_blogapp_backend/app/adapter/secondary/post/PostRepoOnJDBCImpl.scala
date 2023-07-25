package adapter.secondary.post

import com.typesafe.scalalogging.Logger
import domain.entity.{Post, PostID, UserID}
import domain.repository.PostRepository
import org.joda.time.DateTime
import scalikejdbc.jodatime.JodaParameterBinderFactory.jodaDateTimeParameterBinderFactory
import scalikejdbc.{scalikejdbcSQLInterpolationImplicitDef, DB, SQLSyntax}
import utils.pagination.Paged

import java.io.{File, IOException}
import java.nio.file.{Files, Paths, StandardOpenOption}
import scala.util.{Failure, Success, Try}

class PostRepoOnJDBCImpl extends PostRepository {

  private val logger           = Logger(getClass)
  private val POST_IMAGES_PATH = "public/images/posts"

  override def getAllPostsPaginated(page: Int, keyword: String): Paged[Post] = {
    val searchPattern = s"%$keyword%"
    val query         = sqls"title LIKE $searchPattern"

    getPagedPosts(query, page)
  }

  override def getAllPostsByUserPaginated(page: Int, keyword: String, userId: Long): Paged[Post] = {
    val searchPattern = s"%$keyword%"
    val query         = sqls"title LIKE $searchPattern AND userId = $userId"

    getPagedPosts(query, page)
  }

  private def getPagedPosts(query: SQLSyntax, page: Int): Paged[Post] = {
    val pageSize = 10
    val offset   = (page - 1) * 10

    val posts      = PostDAO.findAllByWithLimitOffset(query, pageSize, offset, Seq(PostDAO.defaultAlias.createdAt.desc))
    val totalPosts = PostDAO.countBy(query)
    val totalPages = math.ceil(totalPosts.toDouble / pageSize.toDouble).toLong

    Paged[Post](
      items           = posts,
      totalItems      = totalPosts,
      totalPages      = totalPages,
      currentPage     = page,
      hasPreviousPage = page > 1,
      hasNextPage     = page < totalPages
    )
  }

  override def getPostByID(postId: Long): Option[Post] =
    PostDAO.findById(PostID(postId))

  override def createPost(
      userId:    Long,
      author:    String,
      title:     String,
      content:   String,
      thumbnail: (String, Array[Byte]),
      createdAt: DateTime,
      updatedAt: DateTime
  ): Try[Post] =
    try
      DB localTx { implicit session =>
        val (filename, thumbnailBytes) = thumbnail

        val p            = PostDAO.column
        val postID: Long = PostDAO.createWithNamedValues(
          p.column("userId")    -> userId,
          p.column("author")    -> author,
          p.column("title")     -> title,
          p.column("content")   -> content,
          p.column("thumbnail") -> filename,
          p.column("createdAt") -> DateTime.now(),
          p.column("updatedAt") -> DateTime.now()
        ).value

        saveNewThumbnail(postID, filename, thumbnailBytes)

        Success(Post(PostID(postID), UserID(userId), author, title, content, filename, createdAt, updatedAt))
      }
    catch {
      case e: Throwable => Failure(e)
    }

  private def saveNewThumbnail(postId: Long, fileName: String, thumbnailBytes: Array[Byte]) =
    try {
      val directory = Paths.get(s"$POST_IMAGES_PATH/$postId")
      if (!Files.exists(directory)) {
        Files.createDirectory(directory)
      }
      Files.write(
        directory.resolve(fileName),
        thumbnailBytes,
        StandardOpenOption.CREATE,
        StandardOpenOption.TRUNCATE_EXISTING)
    } catch {
      case e: IOException => logger.error("An error occurred while saving file", e)
    }

  override def updatePost(
      postId:       Long,
      newAuthor:    String,
      newTitle:     String,
      newContent:   String,
      newThumbnail: (String, Array[Byte]),
      updatedAt:    DateTime
  ): Try[Post] =
    try
      DB localTx { implicit session =>
        val post                          = PostDAO.findById(PostID(postId)).get
        val (newFilename, thumbnailBytes) = newThumbnail

        val attributes  = Seq(
          Symbol("author")    -> newAuthor,
          Symbol("title")     -> newTitle,
          Symbol("content")   -> newContent,
          Symbol("updatedAt") -> updatedAt
        )
        val updateAttrs = if (newFilename.nonEmpty) {
          attributes :+ (Symbol("thumbnail") -> newFilename)
        } else {
          attributes
        }

        PostDAO.updateById(PostID(postId)).withAttributes(updateAttrs: _*)

        if (newFilename.nonEmpty) {
          deleteOldThumbnail(postId, post.thumbnail)
          saveNewThumbnail(postId, newFilename, thumbnailBytes)
        }

        Success(Post(PostID(postId), post.userId, newAuthor, newTitle, newContent, newFilename, post.createdAt, updatedAt))
      }
    catch {
      case e: Throwable => Failure(e)
    }

  private def deleteOldThumbnail(postId: Long, fileName: String) =
    try
      new File(POST_IMAGES_PATH + s"/$postId/$fileName").delete()
    catch {
      case e: IOException => logger.error("An error occurred while deleting file", e)
    }

  private def deleteThumbnailFolder(postId: Long): Unit =
    try {
      val folderPath      = Paths.get(POST_IMAGES_PATH, postId.toString)
      val directoryStream = Files.newDirectoryStream(folderPath)
      try
        directoryStream.iterator().forEachRemaining(path => Files.delete(path))
      finally
        directoryStream.close()
      Files.delete(folderPath)
    } catch {
      case e: IOException => logger.error("An error occurred while deleting folder", e)
    }

  override def deletePost(postId: Long): Try[Long] =
    try
      DB localTx { implicit session =>
        PostDAO.deleteById(PostID(postId))

        deleteThumbnailFolder(postId)

        Success(postId)
      }
    catch {
      case e: Throwable => Failure(e)
    }
}
