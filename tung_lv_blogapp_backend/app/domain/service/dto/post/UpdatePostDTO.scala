package domain.service.dto.post

import org.joda.time.DateTime

case class UpdatePostDTO(postId: Long, author: String, title: String, content: String, updatedAt: DateTime)
