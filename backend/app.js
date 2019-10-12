const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { Recipe } = require('./models/recipe');


const app = express(),
  mongoURL = 'mongodb+srv://wallee:wallee3000@cluster0-8npit.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(process.env.MONGO_SRV || mongoURL, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
  .then(mongooseSuccess)
  .catch(mongooseError);

app.use(cors());
app.use(bodyParser.json());

app.post('/api/recipes', postRecipe);
app.get('/api/recipes', getRecipes);
app.get('/api/recipes/:id', getRecipe);
app.put('/api/recipes/:id', putRecipe);
app.delete('/api/recipes/:id', deleteRecipe);

/**
 * @returns {Function}
 */
function cors() {
  return (_req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      next();
  }
}

/**
 * Mongoose success and error promise handlers
 */
function mongooseSuccess() {
  console.log('Successfully connected to MongoDB Atlas!');
}
function mongooseError(error) {
  console.groupCollapsed();
  console.log('Unable to connect to MongoDB Atlas!');
  console.error(error);
  console.log('Are you sure you\'re connected to the internet?');
  console.groupEnd();
}

// POST middleware
function postRecipe(req, res, next) {
  const newRecipe = new Recipe({
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    difficulty: req.body.difficulty,
    time: req.body.time
  });

  newRecipe.save()
    .then(onSaveSuccess(req, res, next))
    .catch(onSaveError(req, res, next));
}
function onSaveSuccess(_req, res, _next) {
  return () => {
    res.status(201).json({
      message: 'Recipe created successfully.'
    });
  }
}
function onSaveError(_req, res, _next) {
  return (error) => {
    res.status(400).json({
      error: error
    });
  }
}

// GET all middleware
function getRecipes(_req, res, _next) {
  Recipe.find()
    .then(recipes => {
      res.status(200).json(recipes);
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
}

// GET one recipe middleware
function getRecipe(req, res, next) {
  Recipe.findOne({
    _id: req.params.id
  })
    .then(onRecipe(req, res, next))
    .catch(onNoRecipe(req, res, next));
}
function onRecipe(_req, res, _next) {
  return (recipe) => {
    res.status(200).json(recipe);
  }
}
function onNoRecipe(_req, res, _next) {
  return (error) => {
    res.status(404).json({
      error: error
    });
  }
}

// PUT some recipe
function putRecipe(req, res, next) {
  const recipe = new Recipe({
    _id: req.params.id,
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    difficulty: req.body.difficulty,
    time: req.body.time
  });

  Recipe.findOneAndUpdate({ _id: req.params.id }, recipe)
    .then(onUpdateSuccess(req, res, next))
    .catch(onUpdateError(req, res, next));
}
function onUpdateSuccess(_req, res, _next) {
  return () => {
    res.status(201).json({
      message: 'Recipe updated successfully.'
    });
  };
}
function onUpdateError(_req, res, _next) {
  return (error) => {
    res.status(400).json({
      error: error
    });
  };
}

/**
 * DELETE a recipe
 */
function deleteRecipe(req, res, next) {
  Recipe.findOneAndDelete({ _id: req.params.id })
    .then(onDeleteSuccess(req, res, next))
    .catch(onDeleteError(req, res, next));
}
function onDeleteSuccess(_req, res, _next) {
  return () => {
    res.status(200).json({
      message: 'Recipe deleted!'
    });
  }
}
function onDeleteError(_req, res, _next) {
  return (error) => {
    res.status(400).json({
      error: error
    });
  }
}

module.exports = app;