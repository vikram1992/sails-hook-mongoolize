`SAILS-HOOK-MONGOOLIZE`

# README #

This hook ensures that SEQUELIZE and MONGOOSE orms are initialized post sails lift and exposes them in global scope.

### CONFIGURATION ###

* Disable sails ORM hook in .sailsrc
```
{
  "hooks": {
    "orm": false
  }
}
```

* Define DB Connection in local.js file or corresponding environment file(production.js/staging.js) in this format
```
mongoolize: {
    mongoose : {
      uri: 'mongodb://USERNAME:PASSWORD@IP:PORT_NO',
            options:{ useMongoClient: true }
    },
    sequelize: {
      username: USERNAME,
      password: PASSWORD,
      database: DATABASE,
      host: HOST,
      port: PORT,
      options: {
        define: {
          freezeTableName: true,
          timestamps: false,
        },
        dialect: 'mysql',
      }
    }
  },
```  

* By default sails models lies under api/models. Add two folders to it i.e mongo and sql for separation of concerns. EG:
```
-- api
    -- models
        -- mysql
        -- mongo
```

### What this hook does ###

* Exposes Sequelize and Mongoose objects globally with `sequelize` and `mongoose` aliases.
* Exposes all models under sql and mongo globally with their corresponding file names as aliases.

### How do I get set up? ###

* npm install sails-hook-mongoolize

### Sample Model format for Sequelize
```
module.exports = {
    attributes: {},
    table_name: TABLENAME,
    classMethods: [],
    options: {},
    associations: function() {}
}
```
### Contribution guidelines ###

* Kindly raise an issue. Looking for feedbacks and enhancements :)
