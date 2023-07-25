package adapter.primary.httpResponse

import domain.entity.Post
import domain.service.dto.post.{CreatePostDTO, UpdatePostDTO}
import org.joda.time.DateTime
import play.api.libs.json.JodaReads.jodaDateReads
import play.api.libs.json.JodaWrites.jodaDateWrites
import play.api.libs.json._
import play.api.mvc.{Result, Results}
import utils.pagination.Paged

object PostResponse extends Results {

  implicit val dateTimeFormat: Format[DateTime] = Format(
    jodaDateReads("yyyy-MM-dd"),
    jodaDateWrites("yyyy-MM-dd")
  )

  implicit val postWrites: Writes[Post] = (post: Post) =>
    Json.obj(
      "id"        -> post.id.value,
      "userId"    -> post.userId.value,
      "author"    -> post.author,
      "title"     -> post.title,
      "content"   -> post.content,
      "thumbnail" -> s"http://localhost:9000/assets/images/posts/${post.id.value}/${post.thumbnail}",
      "createdAt" -> post.createdAt,
      "updatedAt" -> post.updatedAt
    )

  implicit val createFormat: OFormat[CreatePostDTO] = Json.format[CreatePostDTO]
  implicit val updateFormat: OFormat[UpdatePostDTO] = Json.format[UpdatePostDTO]

  def GetPostsPaginatedResponse(paged: Paged[Post]): Result =
    Ok(Json.obj(
      "success"         -> true,
      "totalPages"      -> paged.totalPages,
      "totalPosts"      -> paged.totalItems,
      "posts"           -> paged.items,
      "currentPage"     -> paged.currentPage,
      "hasPreviousPage" -> paged.hasPreviousPage,
      "hasNextPage"     -> paged.hasNextPage
    ))

  def GetSinglePostResponse(post: Post): Result =
    Ok(Json.obj(
      "success" -> true,
      "post"    -> post
    ))

  def CreatePostResponse(post: CreatePostDTO): Result =
    Ok(Json.obj(
      "success" -> true,
      "message" -> "Create post successfully!",
      "post"    -> post
    ))

  def UpdatePostResponse(post: UpdatePostDTO): Result =
    Ok(Json.obj(
      "success" -> true,
      "message" -> s"Update post ${post.postId} successfully!",
      "post"    -> post
    ))

  def DeletePostResponse(postId: Long): Result =
    Ok(Json.obj(
      "success" -> true,
      "message" -> s"Delete post with ID $postId successfully!"
    ))
}
