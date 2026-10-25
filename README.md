# Dashboard «Проекты и задачи»

Тестовое приложение на React, Express и PostgreSQL. В первом разделе Dashboard показаны проекты и задачи выбранного проекта. Проекты загружаются частями при прокрутке; задачи можно создавать, изменять и удалять после входа.

## Локальный запуск

Нужен Docker с плагином Compose. Node.js и PostgreSQL на компьютере устанавливать не требуется.

1. Из корня репозитория запустите `docker compose up -d --build`.
2. Создайте учётную запись проверяющего командой `docker compose exec -T api node server/dist/provisionReviewer.js`. Команда выведет логин `reviewer` и случайный пароль. Сохраните пароль: при повторном запуске команды он изменится.
3. Откройте [http://localhost:8080](http://localhost:8080) и войдите с полученными данными.

Контейнер Nginx доступен на `127.0.0.1:8080`. API и PostgreSQL доступны только внутри сети Compose.

## Структура

- `client/` — React Dashboard на основе Soft UI Dashboard React, таблицы AG Grid.
- `server/` — REST API на Express и `pg-promise`.
- `init-db.sql` — схема и демонстрационные данные PostgreSQL.
- `compose.yaml` — локальный запуск приложения.

