module.exports = sails => {
    const Sequelize = require('sequelize');
    const Mongoose = require('mongoose');
    return {
        defaults() {
            let defaultConfig = {};
            defaultConfig[this.identity] = {
                sequelize: {options: {}},
                mongoose:{options: {}}
            };
            return defaultConfig;
        },

        configure() {
            let mongoolizeConfig = sails.config.mongoolize;

            let mysqlConfig = mongoolizeConfig.sequelize;

            let mongoConfig = mongoolizeConfig.mongoose;

            if(mysqlConfig.username && mysqlConfig.host && mysqlConfig.database){
                global['sequelize'] = new Sequelize('mysql://' + mysqlConfig.username + ':' + mysqlConfig.password + '@' + mysqlConfig.host + ':' + mysqlConfig.port + '/' + mysqlConfig.database, mysqlConfig.options);
            }

            if(mongoConfig.uri){
                global['mongoose'] = Mongoose.connect(mongoConfig.uri, mongoConfig.options);
            }
        },

        initialize(next) {
            let path = require('fs');
            let appDir = sails.config.appPath;
            let async = require('async');

            let tasks = [];

            if(path.existsSync(appDir + '/api/models/mongo')){
                tasks.push(this.initializeMongo.bind(this.initializeMongo, appDir + '/api/models/mongo/'))
            }

            if(path.existsSync(appDir + '/api/models/mysql')){
                tasks.push(this.initializeSql.bind(this.initializeMongo, appDir + '/api/models/mysql/'))
            }

            async.parallel(tasks, function (err, results) {
                if (err) return next(err);

                next();
            });

        },

        initializeMongo(appDir, cb) {
            let fs = require('fs');

            fs.readdir(appDir, (err, files) => {
                for (let i = 0; i < files.length; i++) {
                    let modelName = files[i].substring(0, files[i].lastIndexOf('.'));
                    let options = require(appDir + files[i]);
                    global[modelName] = Mongoose.model(options.document_name, options.attributes);
                    sails.log.info(`Loaded Mongoose Model ::: ${modelName}`);
                }
                cb(null, {});
            });
        },

        initializeSql(appDir, cb) {
            let fs = require('fs');

            fs.readdir(appDir, (err, files) => {
                let modelOptions = [];
                for (let i = 0; i < files.length; i++) {
                    let modelName = files[i].substring(0, files[i].lastIndexOf('.'));
                    let options = require(appDir + files[i]);
                    let model = sequelize.define(options.table_name, options.attributes);
                    sails.log.info(`Loaded Sequelize Model ::: ${modelName}`);
                    let classMethods = options.classMethods || [];
                    let instanceMethods = options.instanceMethods || [];
                    classMethods.forEach(classMethod=>{
                        model[classMethod.name] = classMethod;
                    });
                    instanceMethods.forEach(instanceMethod=>{
                        model.prototype[instanceMethod.name] = instanceMethod;
                    });
                    global[modelName] = model;
                    modelOptions.push({name: modelName, options: options});
                }
                for(let i=0; i<modelOptions.length; i++){
                    let modelAssociation = modelOptions[i].options.associations;
                    if(modelAssociation && typeof modelAssociation === 'function'){
                        modelAssociation();
                    }
                }
                cb(null, {});
            });
        }


    };
};

