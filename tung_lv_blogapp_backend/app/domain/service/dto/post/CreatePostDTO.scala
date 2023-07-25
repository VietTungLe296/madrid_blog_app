package domain.service.dto.post

import org.joda.time.DateTime

case class CreatePostDTO(postId: Long, author: String, title: String, content: String, createdAt: DateTime)
