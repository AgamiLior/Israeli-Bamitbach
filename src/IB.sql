DROP DATABASE IF EXISTS ibdb;

CREATE DATABASE ibdb;

-- \c ibdb;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS reviews;

CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL UNIQUE,
  password text NOT NULL,
  password_confirm text NOT NULL,
  type text NOT NULL DEFAULT user
);


CREATE TABLE classes
(
  id SERIAL PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users,
  pasta text NOT NULL,
  sauce text NOT NULL,
  party integer NOT NULL,
  tools boolean NOT NULL,
  start_date_time text NOT NULL,
  end_date_time text NOT NULL,
  location text NOT NULL,
  more_info text
);

CREATE TABLE reviews
(
  id SERIAL PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users,
  review text NOT NULL,
  stars integer DEFAULT 5
);

CREATE TABLE likes 
(
  id SERIAL PRIMARY KEY,
  review_id integer NOT NULL REFERENCES reviews,
  count integer NOT NULL
);

CREATE TABLE images
(
  id SERIAL PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users,
  url text NOT NULL

);


INSERT INTO users
  (name, email, phone, password, password_confirm, type)
VALUES
  ('Lior Agami', 'agamil1019@gmail.com', '9292845515', '123', '123', 'admin');



-- INSERT INTO classes
--   (user_id, pasta, sauce, party, tools, date, start_time, end_time, location)
-- VALUES
--   (1, 'ravioli', 'marinara', 2, True, '1990-10-19', '16:00:00', '18:00:00', 'new york');

-- INSERT INTO classes
--   (user_id, pasta, sauce, party, tools, date, start_time, end_time, location, more_info)
-- VALUES
--   (1, 'fetuchini', 'rose', 4, False, '1990-10-19', '16:00:00', '18:00:00', 'new york', 'love');

-- INSERT INTO reviews
--   (user_id, review, stars)
-- VALUES
--   (1,'best class ever!', 5);