package utils.bcrypt

import com.github.t3hnar.bcrypt._

object BCryptHashing {

  def hash(password: String): String =
    password.bcryptBounded(generateSalt)

  def verify(password: String, passwordHash: String): Boolean =
    password.isBcryptedBounded(passwordHash)
}
