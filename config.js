var connectionString = process.env.DATABASE_URL || "postgres://localhost/todo";

module.exports = connectionString;