import adapter.secondary.post.PostRepoOnJDBCImpl
import adapter.secondary.user.UserRepoOnJDBCImpl
import domain.repository.{PostRepository, UserRepository}
import play.api.inject.{bind, SimpleModule}

class AppModule extends SimpleModule(
      bind[PostRepository].to[PostRepoOnJDBCImpl],
      bind[UserRepository].to[UserRepoOnJDBCImpl]
    )
