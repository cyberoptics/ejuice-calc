var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var recipeSchema = new Schema({
  user_id: Schema.Types.ObjectId,
  name: String,
  values: Array,
  flavors: Array
});
// create the model for users and expose it to our app
module.exports = mongoose.model('Recipe', recipeSchema);
