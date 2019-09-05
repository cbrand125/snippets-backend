DROP TABLE IF EXISTS snippet;

CREATE TABLE snippet
(
  id SERIAL PRIMARY KEY,
  title TEXT,
  code TEXT,
  description TEXT,
  favorites INT DEFAULT 0,
  author TEXT,
  language TEXT
);

INSERT INTO snippet
  (code, title, description, author, language)
VALUES
  ('const america = 1776;', 'freedom', 'I declared a const', 'Cody', 'javascript'),
  ('// I cannot believe this comment', 'Comment', 'single line comment', 'Dean', 'javascript');