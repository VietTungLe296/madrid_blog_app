package domain.repository

import domain.entity.Post
import org.joda.time.DateTime
import utils.pagination.Paged

import scala.util.Try

trait PostRepository {

  def getAllPostsPaginated(page: Int, keyword: String): Paged[Post]

  def getAllPostsByUserPaginated(page: Int, keyword: String, userId: Long): Paged[Post]

  def getPostByID(postId: Long): Option[Post]

  def createPost(
      userId: Long,
      author: String,
      title: String,
      content: String,
      thumbnail: (String, Array[Byte]),
      createdAt: DateTime,
      updatedAt: DateTime
  ): Try[Post]

  def updatePost(
      postId: Long,
      author: String,
      title: String,
      content: String,
      thumbnail: (String, Array[Byte]),
      updatedAt: DateTime
  ): Try[Post]

  def deletePost(postId: Long): Try[Long]
}
