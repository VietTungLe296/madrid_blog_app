package domain.entity

case class UserID(value: Long)
case class User(id: UserID, username: String, email: String, password: String)
