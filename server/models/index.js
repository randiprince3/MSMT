"use strict";
// cool stuff variables here
var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../../config.json")[env];
var db = {};

// this shit says if u have an environment variable use sequelize to link to da database
if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
  // here is says if u in your local place you use ur own whatever. which is mysql for me
} else {
  var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}
fs.readdirSync(__dirname)
  .filter(function(file) {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// This exports the variable db for ALL OTHERS TO USE
// from this file, var db is an object of the database info shit
module.exports = db;
