package domain.service

import domain.entity.Post
import domain.repository.PostRepository
import domain.service.dto.post.{CreatePostDTO, PostForm, UpdatePostDTO}
import exception.{InvalidCreatorException, InvalidFieldException, NotFoundException}
import org.joda.time.DateTime
import utils.pagination.Paged

import javax.inject.Inject
import scala.util.{Failure, Success}

class PostService @Inject() (
    val postRepository: PostRepository
) {

  def getAllPostsPaginated(page: Int, keyword: String): Paged[Post] = postRepository.getAllPostsPaginated(page, keyword)

  def getAllPostsByUserPaginated(page: Int, keyword: String, userId: Long): Paged[Post] =
    postRepository.getAllPostsByUserPaginated(page, keyword, userId)

  def createPost(
      userId:    Long,
      author:    Option[String],
      title:     Option[String],
      content:   Option[String],
      thumbnail: Option[(String, Array[Byte])]
  ): CreatePostDTO =
    (author, title, content, thumbnail) match {
      case (None, _, _, _) => throw new InvalidFieldException("Missing author name field!")
      case (_, None, _, _) => throw new InvalidFieldException("Missing title field!")
      case (_, _, None, _) => throw new InvalidFieldException("Missing content field!")
      case (_, _, _, None) => throw new InvalidFieldException("Missing thumbnail field!")
      case _               =>
        (
          PostForm.validateAuthorPattern(author.get),
          PostForm.validateTitlePattern(title.get),
          PostForm.validateContentPattern(content.get)) match {
          case (false, _, _) => throw new InvalidFieldException("Author name should be 3-50 characters of letters, numbers or underscores!")
          case (_, false, _) => throw new InvalidFieldException("Title is required and maximum length is 150!")
          case (_, _, false) => throw new InvalidFieldException("Content must not be empty!")
          case _             =>
            postRepository.createPost(userId, author.get, title.get, content.get, thumbnail.get, DateTime.now(), DateTime.now()) match {
              case Success(post) => CreatePostDTO(post.id.value, post.author, post.title, post.content, post.createdAt)
              case Failure(_)    => throw new InternalError
            }
        }
    }

  def updatePost(
      postId:       Long,
      userId:       Long,
      newAuthor:    Option[String],
      newTitle:     Option[String],
      newContent:   Option[String],
      newThumbnail: Option[(String, Array[Byte])]
  ): UpdatePostDTO = {
    val post = getPostByID(postId)

    if (isOwnerPost(post, userId)) {
      val author    = newAuthor.getOrElse(post.author)
      val title     = newTitle.getOrElse(post.title)
      val content   = newContent.getOrElse(post.content)
      val thumbnail = newThumbnail.getOrElse(("", Array.emptyByteArray))

      (
        PostForm.validateAuthorPattern(author),
        PostForm.validateTitlePattern(title),
        PostForm.validateContentPattern(content)) match {
        case (false, _, _) => throw new InvalidFieldException("Author name should be 3-50 characters of letters, numbers or underscores!")
        case (_, false, _) => throw new InvalidFieldException("Title is required and maximum length is 150!")
        case (_, _, false) => throw new InvalidFieldException("Content must not be empty!")
        case _             => postRepository.updatePost(postId, author, title, content, thumbnail, DateTime.now()) match {
            case Success(post) => UpdatePostDTO(post.id.value, post.author, post.title, post.content, post.updatedAt)
            case Failure(_)    => throw new InternalError
          }
      }
    } else {
      throw new InvalidCreatorException(s"You are not the creator of post ${post.id.value}")
    }
  }

  def deletePost(postId: Long, userId: Long): Long = {
    val post = getPostByID(postId)

    if (isOwnerPost(post, userId)) {
      postRepository.deletePost(postId) match {
        case Success(id) => id
        case Failure(_)  => throw new InternalError
      }
    } else {
      throw new InvalidCreatorException(s"You are not the creator of post ${post.id.value}")
    }
  }

  def getPostByID(postId: Long): Post =
    postRepository.getPostByID(postId) match {
      case Some(post) => post
      case None       => throw new NotFoundException(s"Post with ID $postId doesn't exist!")
    }

  private def isOwnerPost(post: Post, userId: Long): Boolean = post.userId.value == userId
}
