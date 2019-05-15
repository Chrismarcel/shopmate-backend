import mysql from 'mysql';
import dotenv from 'dotenv';
import { promisify } from 'util';

dotenv.config();

const {
  DB_HOST: host,
  DB_PASSWORD: password,
  DB_USER: user,
  DB_NAME: database
} = process.env;

const dbPool = mysql.createPool({
  host,
  user,
  password,
  database
});

const dbQuery = promisify(dbPool.query).bind(dbPool);

export default dbQuery;
