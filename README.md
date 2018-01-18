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
* By default sails models lies under api/models. Add two folders to it i.e mongo and sql for separation of concerns. EG:
```
-- api
    -- models
        -- sql
        -- mongo
```

### What this hook does ###

* Exposes Sequelize and Mongoose objects globally with `sequelize` and `mongoose` aliases.
* Exposes all models under sql and mongo globally with their corresponding file names as aliases.

### How do I get set up? ###

* npm install sails-hook-mongoolize

### Contribution guidelines ###

* Kindly raise an issue. Looking for feedbacks and enhancements :)