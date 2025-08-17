const { Sequelize } = require("sequelize");

// Используем DATABASE_URL вместо отдельных переменных
module.exports = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
