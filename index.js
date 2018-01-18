module.exports = sails => {
    const Sequelize = require('sequelize');
    const Mongoose = require('mongoose');
    return {
        configure() {
            let opts = {
                define: {
                    // don't add the timestamp attributes (updatedAt, createdAt)
                    timestamps: false,
                    //prevent sequelize from pluralizing table names
                    freezeTableName: true
                }
            };
            let mysqlConfig = sails.config.custom.connection.mysql;
            global['sequelize'] = new Sequelize('mysql://' + mysqlConfig.username + ':' + mysqlConfig.password + '@' + mysqlConfig.host + ':' + mysqlConfig.port + '/' + mysqlConfig.database, opts);
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
                    let modelName = files[i].substring(0, files[i].lastIndexOf('.'));
                    let options = require(appDir + '/api/models/mongo/' + files[i]);
                    global[modelName] = Mongoose.model(options.document_name, options.attributes);
                }
                cb(null, {});
            });
        },

        initializeSql(appDir, cb) {
            let fs = require('fs');

            fs.readdir(appDir + '/api/models/sql', (err, files) => {
                for (let i = 0; i < files.length; i++) {
                    let modelName = files[i].substring(0, files[i].lastIndexOf('.'));
                    let options = require(appDir + '/api/models/sql/' + files[i]);
                    global[modelName] = sequelize.define(options.table_name, options.attributes);
                }
                cb(null, {});
            });
        }


    };
};


