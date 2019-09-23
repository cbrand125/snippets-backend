DROP TABLE IF EXISTS author;
DROP TABLE IF EXISTS snippet;
---
CREATE TABLE author (name TEXT PRIMARY KEY, password TEXT);
INSERT INTO
  author (name, password)
VALUES
  ('Dandy', 'dean123'),
  ('Scott', 'password');
---
  CREATE TABLE snippet (
    id SERIAL PRIMARY KEY,
    title TEXT,
    code TEXT,
    description TEXT,
    favorites INT DEFAULT 0,
    author TEXT REFERENCES author,
    language TEXT
  );
INSERT INTO
  snippet (code, title, description, author, language)
VALUES
  (
    'const america = 1776;',
    'freedom',
    'constant declaration',
    'Dandy',
    'javaScript'
  ),
  (
    '// I cannot believe this comment',
    'Comment',
    'single line comment',
    'Scott',
    'javaScript'
  );