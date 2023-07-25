package domain.entity

import org.joda.time.DateTime

case class PostID(value: Long)

case class Post(
    id:        PostID,
    userId:    UserID,
    author:    String,
    title:     String,
    content:   String,
    thumbnail: String,
    createdAt: DateTime,
    updatedAt: DateTime
) {}
