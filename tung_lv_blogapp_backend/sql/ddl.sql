SELECT *
FROM blog_app_db.post;
CREATE TABLE `post`
(
    `id`        bigint       NOT NULL,
    `userId`    bigint       NOT NULL,
    `author`    varchar(50)  NOT NULL,
    `title`     varchar(150) NOT NULL,
    `content`   longtext     NOT NULL,
    `thumbnail` varchar(255) NOT NULL,
    `createdAt` datetime DEFAULT NULL,
    `updatedAt` datetime DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `id_UNIQUE` (`id`),
    KEY         `userId` (`userId`),
    CONSTRAINT `userId` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user`
(
    `id`       bigint      NOT NULL,
    `email`    varchar(50) NOT NULL,
    `password` varchar(64) NOT NULL,
    `username` varchar(50) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
