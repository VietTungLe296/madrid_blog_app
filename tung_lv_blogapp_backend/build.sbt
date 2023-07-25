ThisBuild / scalaVersion := "2.13.10"

ThisBuild / version := "1.0-SNAPSHOT"

lazy val root = (project in file("."))
  .enablePlugins(PlayScala)
  .settings(
    name := """tung_lv_blogapp_backend""",
    libraryDependencies ++= Seq(
      guice,
      jdbc,
      "org.scalatestplus.play"     %% "scalatestplus-play"           % "5.1.0" % Test,
      "com.typesafe.play"          %% "play-json"                    % "2.9.4",
      "mysql"                       % "mysql-connector-java"         % "8.0.32",
      "org.scalikejdbc"            %% "scalikejdbc"                  % "3.5.0",
      "org.scalikejdbc"            %% "scalikejdbc-config"           % "3.5.0",
      "org.scalikejdbc"            %% "scalikejdbc-play-initializer" % "2.8.0-scalikejdbc-3.5",
      "org.skinny-framework"       %% "skinny-orm"                   % "3.1.0",
      "com.github.t3hnar"          %% "scala-bcrypt"                 % "4.3.0",
      "io.jsonwebtoken"             % "jjwt"                         % "0.9.1",
      "com.typesafe.scala-logging" %% "scala-logging"                % "3.9.5",
      "com.typesafe.play"          %% "play-json-joda"               % "2.7.4"
    )
  )
