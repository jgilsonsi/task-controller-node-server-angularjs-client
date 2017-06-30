USE task;

CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT AUTO_INCREMENT NOT NULL,
    date_create TIMESTAMP NOT NULL,
    description VARCHAR(255) NOT NULL,
    date_task TIMESTAMP NOT NULL,
    date_done TIMESTAMP NULL,
    PRIMARY KEY(id)
);