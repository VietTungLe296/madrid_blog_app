package domain.service.dto.post

import adapter.primary.webServiceAdapter.UserRequest
import exception.InvalidFieldException
import play.api.libs.Files
import play.api.mvc.MultipartFormData

import java.nio.file.Paths

case class PostForm(author: Option[String], title: Option[String], content: Option[String], thumbnail: Option[(String, Array[Byte])])

object PostForm {

  def extractFormData(request: UserRequest[MultipartFormData[Files.TemporaryFile]]): PostForm = {
    val formData = request.body.dataParts

    val author  = formData.get("author").flatMap(_.headOption).map(_.trim)
    val title   = formData.get("title").flatMap(_.headOption).map(_.trim)
    val content = formData.get("content").flatMap(_.headOption).map(_.trim)

    val files     = request.body.files
    if (files.size > 1) throw new InvalidFieldException("Only one image file is allowed!")
    val thumbnail = files.headOption.map { file =>
      if (file.contentType.exists(_.startsWith("image/"))) {
        val thumbnailPath  = file.ref.path.toFile.getAbsolutePath
        val thumbnailBytes = java.nio.file.Files.readAllBytes(Paths.get(thumbnailPath))
        (file.filename, thumbnailBytes)
      } else throw new InvalidFieldException("Only JPEG, PNG, WEBP, and SVG files are allowed!")
    }

    PostForm(author, title, content, thumbnail)
  }

  def validateAuthorPattern(author: String): Boolean = author.matches("^[A-Za-z][A-Za-z0-9_]{2,49}$")

  def validateTitlePattern(title: String): Boolean = title.trim.nonEmpty && title.length <= 150

  def validateContentPattern(content: String): Boolean = content.trim.nonEmpty
}
