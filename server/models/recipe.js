const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for users
const ingrediantSchema = new Schema({
	ingrediantname: {type:String, required: true, trim: true },
});

const stepSchema = new Schema({
	description: {type:String, required: true, trim: true },
	time:{ type : Number },
	photo:{ type : String },
	photoData: { type : String },
	video:{ type : String }	
});
const RecipeSchema = new Schema({
	_id:{ type : Number },
	name:{type:String, required: true, trim: true },
	overview:{ type : String },
    ingrediants: [ingrediantSchema],
  	steps:[stepSchema]  
});
module.exports = mongoose.model('Recipes', RecipeSchema, 'recipes');