const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      Recipe = require('../models/recipe');
 let nextId=0;     

class RecipesRepository {

    
    // get all the recipes

    getRecipes(callback) {
        console.log('*** RecipesRepository.getRecipes');
        Recipe.count((err, recipeCount) => {
            let count = recipeCount;
            console.log(`Recipes count: ${count}`);
            Recipe.find({}, (err, recipes) => {
                if (err) { 
                    console.log(`*** RecipesRepository.getRecipes error: ${err}`); 
                    return callback(err); 
                }
                this.getNextId(recipes);
                callback(null, {
                    recipes: recipes
                });
            });

        });
    }

   

    // get a  recipe
    getRecipe(id, callback) {
        console.log('*** RecipesRepository.getRecipe');
        Recipe.findById(id, (err, recipe) => {
            if (err) { 
                console.log(`*** RecipesRepository.getRecipe error: ${err}`); 
                return callback(err); 
            }
            callback(null, recipe);
        });
    }
    getNextId(collection) {
      nextId = 1;
      collection.forEach(function(item) {
        nextId = item.id >= nextId ? item._id + 1 : nextId;
        
        console.log(nextId);
      });
      return nextId;
    }
    // insert a  recipe
    insertExecute(body, callback) {
        let recipe = new Recipe();
        console.log("Next ID Is ****** "+nextId);
        recipe._id = nextId++;
        
        recipe.name = body.name;
        recipe.overview = body.overview;
        recipe.ingrediants = body.ingrediants;
        recipe.steps = body.steps;
        
        recipe.save((err, recipe) => {
            if (err) { 
                console.log(`*** RecipesRepository insertRecipe error: ${err}`); 
                return callback(err, null); 
            }

            callback(null, recipe);
        });
    }
    insertRecipe(body, callback) {
        
        console.log('*** RecipesRepository.insertRecipe');

        console.log(body);
        if(!nextId) {
            let temp = this.insertExecute.bind(null,body, callback)
            this.getRecipes(temp);
        } else {
           this.insertExecute(body, callback); 
        }

    }

    updateRecipe(id, body, callback) {
        console.log('*** RecipesRepository.editRecipe');


        Recipe.findById(id, (err, recipe)  => {
            if (err) { 
                console.log(`*** RecipesRepository.editRecipe error: ${err}`); 
                return callback(err); 
            }
            recipe.name = body.name;
            recipe.overview = body.overview;
            recipe.ingrediants = body.ingrediants;
            recipe.steps = body.steps;
            recipe.save((err, recipe) => {
                if (err) { 
                    console.log(`*** RecipesRepository.updateRecipe error: ${err}`); 
                    return callback(err, null); 
                }

                callback(null, recipe);
            });

        });
    }

    // delete a recipe
    deleteRecipe(id, callback) {
        console.log('*** RecipesRepository.deleteRecipe');
        Recipe.remove({ '_id': id }, (err, recipe) => {
            if (err) { 
                console.log(`*** RecipesRepository.deleteRecipe error: ${err}`); 
                return callback(err, null); 
            }
            callback(null, recipe);
        });
    }

}

module.exports = new RecipesRepository();