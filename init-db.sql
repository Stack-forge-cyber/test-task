CREATE DATABASE npc_dashboard;
\connect npc_dashboard

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL CHECK (length(trim(name)) > 0),
    budget_kopecks BIGINT NOT NULL CHECK (budget_kopecks BETWEEN 0 AND 999999999999),
    start_date DATE NOT NULL,
    priority INTEGER NOT NULL CHECK (priority BETWEEN 1 AND 5)
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
    title VARCHAR(160) NOT NULL CHECK (length(trim(title)) > 0),
    effort_minutes INTEGER NOT NULL CHECK (effort_minutes >= 0),
    end_date DATE NOT NULL,
    priority INTEGER NOT NULL CHECK (priority BETWEEN 1 AND 5)
);

CREATE INDEX tasks_project_id_id_idx ON tasks(project_id, id);

CREATE TABLE users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username VARCHAR(60) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  auth_version INTEGER NOT NULL DEFAULT 1 CHECK (auth_version > 0)
);

INSERT INTO projects (name, budget_kopecks, start_date, priority)
SELECT
  'Проект ' || lpad(n::text, 3, '0'),
  (5000000 + n * 137550)::BIGINT,
  DATE '2026-01-01' + (n % 240),
  1 + (n % 5)
FROM generate_series(1, 180) AS n;

INSERT INTO tasks (project_id, title, effort_minutes, end_date, priority)
SELECT
  p.id,
  CASE t.n WHEN 1 THEN 'Подготовить требования' WHEN 2 THEN 'Реализовать решение' ELSE 'Проверить результат' END,
  (8 + p.id % 15) * 60 + t.n * 150,
  p.start_date + (t.n * 14),
  1 + ((p.id + t.n) % 5)
FROM projects AS p
CROSS JOIN generate_series(1, 3) AS t(n);
