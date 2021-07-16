const { Pool } = require("pg");

let pool;

if (process.env.NODE_ENV === "production") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  pool = new Pool();
}

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
