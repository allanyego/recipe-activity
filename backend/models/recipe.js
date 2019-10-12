const mongoose = require('mongoose'),
    recipeSchema = mongoose.Schema({
        title: {
            type: mongoose.SchemaTypes.String
        },
        ingredients: {
            type: mongoose.SchemaTypes.String
        },
        instructions: {
            type: mongoose.SchemaTypes.String
        },
        difficulty: {
            type: mongoose.SchemaTypes.Number
        },
        time: {
            type: mongoose.SchemaTypes.Number
        }
    });

module.exports = {
    Recipe: mongoose.model('Recipe', recipeSchema)
}