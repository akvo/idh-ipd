CREATE USER ipd WITH CREATEDB PASSWORD 'password';

CREATE DATABASE idh_ipd
WITH OWNER = ipd
     TEMPLATE = template0
     ENCODING = 'UTF8'
     LC_COLLATE = 'en_US.UTF-8'
     LC_CTYPE = 'en_US.UTF-8';
