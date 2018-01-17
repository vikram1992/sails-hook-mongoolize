module.exports = sails => {
  const Sequelize = require('sequelize');
  const Mongoose = require('mongoose');
  return {
    configure() {
      global['sequelize'] = new Sequelize(sails.config.custom.connection.mysql);
      global['mongoose'] = Mongoose.connect(sails.config.custom.connection.mongo.uri, sails.config.custom.connection.mongo.options);

    },

    initialize(next) {
      let path = require('path');
      let appDir = path.dirname(require.main.filename);

      let async = require('async');

      async.parallel([
        this.initializeMongo.bind(this.initializeMongo, appDir),
        this.initializeSql.bind(this.initializeSql, appDir)
      ], function (err, results) {
        if (err) return next(err);

        next();
      });

    },

    initializeMongo(appDir, cb) {
      let fs = require('fs');
      fs.readdir(appDir + '/api/models/mongo', (err, files) => {
        for (let i = 0; i < files.length; i++) {
          let modelName = require(appDir + files[i]);
          global[modelName] = Mongoose.model(modelName, require(appDir + modelName));
        }
        cb(null, {});
      });
    },

    initializeSql(appDir, cb) {
      let fs = require('fs');
      fs.readdir(appDir + '/api/models/sql', (err, files) => {
        for (let i = 0; i < files.length; i++) {
          let modelName = require(appDir + files[i]);
          let options = require(appDir + modelName);
          global[modelName] = Sequelize.define(options.table_name, options.attributes);
        }
        cb(null, {});
      });
    }


  };
};



