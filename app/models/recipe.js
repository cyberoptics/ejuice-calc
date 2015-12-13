
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var recipeSchema = mongoose.Schema({

    user_id             : String,
    values              : Array,
    flavors             : Array


});


// create the model for users and expose it to our app
module.exports = mongoose.model('Recipe', recipeSchema);
