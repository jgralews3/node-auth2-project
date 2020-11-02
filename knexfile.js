// Update with your config settings.

module.exports = {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './users/users.db3'
    },
    pool: {
      afterCreate: (conn, done) => {
        conn.run("PRAGMA foreign_keys = ON", done)
      },
    },
  }
