'use strict';
// Load ORM
const Sequelize = require('sequelize');

// Environment variable to define the URL of the data base to use.
// To use SQLite data base:
//    DATABASE_URL = sqlite:quiz.sqlite
const url = process.env.DATABASE_URL || 'sqlite:blog.sqlite';

const sequelize = new Sequelize(url);

// Importar modelos
const PostsModel = require('./post')(sequelize);
const AttachmentsModel = require('./attachment')(sequelize);

// Definir la relación 1-a-1 entre los modelos
AttachmentsModel.hasOne(PostsModel, { as: 'post', foreignKey: 'attachmentId' });
PostsModel.belongsTo(AttachmentsModel, {
  as: 'attachment',
  foreignKey: 'attachmentId',
});

// Exportar modelos y la instancia de sequelize
module.exports = sequelize;
