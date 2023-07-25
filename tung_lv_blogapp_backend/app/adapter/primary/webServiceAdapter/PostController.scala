package adapter.primary.webServiceAdapter

import adapter.primary.httpResponse.PostResponse
import domain.service.dto.post.PostForm.extractFormData
import domain.service.{PostService, UserService}
import play.api.libs.Files
import play.api.mvc._

import javax.inject.{Inject, Singleton}

@Singleton
class PostController @Inject() (
    val postService:          PostService,
    val userService:          UserService,
    val authAction:           AuthAction,
    val controllerComponents: ControllerComponents
) extends BaseController {

  def getAllPostsPaginated(page: Int, keyword: String): Action[AnyContent] = Action {
    val posts = postService.getAllPostsPaginated(page, keyword)

    PostResponse.GetPostsPaginatedResponse(posts)
  }

  def getAllPostsByUserPaginated(page: Int, keyword: String): Action[AnyContent] = authAction { implicit request =>
    val userId = request.cookies.get("userId").get.value.toLong

    val posts = postService.getAllPostsByUserPaginated(page, keyword, userId)

    PostResponse.GetPostsPaginatedResponse(posts)
  }

  def getPostByID(postId: Long): Action[AnyContent] = Action {
    val post = postService.getPostByID(postId)

    PostResponse.GetSinglePostResponse(post)
  }

  def createPost(): Action[MultipartFormData[Files.TemporaryFile]] = authAction(parse.multipartFormData) { implicit request =>
    val userId   = request.cookies.get("userId").get.value.toLong
    val formData = extractFormData(request)

    val createDTO = postService.createPost(userId, formData.author, formData.title, formData.content, formData.thumbnail)

    PostResponse.CreatePostResponse(createDTO)
  }

  def updatePost(postId: Long): Action[MultipartFormData[Files.TemporaryFile]] = authAction(parse.multipartFormData) { implicit request =>
    val userId   = request.cookies.get("userId").get.value.toLong
    val formData = extractFormData(request)

    val updateDTO = postService.updatePost(postId, userId, formData.author, formData.title, formData.content, formData.thumbnail)

    PostResponse.UpdatePostResponse(updateDTO)
  }

  def deletePost(postId: Long): Action[AnyContent] = authAction { implicit request =>
    val userId = request.cookies.get("userId").get.value.toLong

    postService.deletePost(postId, userId)

    PostResponse.DeletePostResponse(postId)
  }
}
