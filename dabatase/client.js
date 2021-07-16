const { Pool } = require('pg')

let pool

if (process.env.NODE_ENV === 'production') {
    const connectionString = process.env.DATABASE_URL

    pool = new Pool({
        connectionString: process.env.DATABASE_URL
    })
} else {
    pool = new Pool()
}



module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
}