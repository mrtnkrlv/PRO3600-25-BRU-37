/**
 * @module app
 */

/**
 * @file app.js
 * @description Point d'entrée principal de l'application web PRO3600.
 * Configure le serveur Express, les middlewares, les routes principales et la gestion des sessions.
 */

import express from 'express'
import pool from './Server/database.js';
const app = express()

/**
 * Définit EJS comme moteur de templates.
 */
app.set('view engine', 'ejs'); 

/**
 * Définit le dossier des vues.
 */
app.set('views', './views');    

/**
 * Middleware pour gérer l'encodage des formulaires HTML.
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Middleware pour parser les requêtes JSON.
 */
app.use(express.json());

import session from 'express-session';

/**
 * Configuration de la session utilisateur.
 */
app.use(session({
  secret: 'random_string12345', // Need to replace this with a random string
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set at false right now because using HTTP rather than HTTPS
}));

/**
 * Middleware de vérification d'authentification.
 * Redirige vers /login si l'utilisateur n'est pas connecté.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const checkAuth = (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  next();
};


/**
 * Middleware pour rendre l'utilisateur disponible dans toutes les vues.
 */
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
  });

// ———————————————————————————————————————————————————————————— // 

// Meals functions
import { getMeals, 
         getMeal, 
         addMeal, 
         getMealByName  } from "./Server/meals.js"; // Relative path

// User functions
import { existsUser,
         getUser,
         createUser,
         deleteUser,
         modifyUsername,
         modifyPassword, 
         getUsernameByComment} from "./Server/user.js"; 

// ———————————————————————————————————————————————————————————— // 


import RouteCache from './Server/RouteCache.js'   //On importe le ficher associé au cache pour le contenu statique

app.get('/homepage', (req,res) => {
    res.render("homepage.ejs")
})

app.get('/plats', async (req,res) => {

    const meals = await getMeals()
    //console.log(meals)
    //Get comments WITH usernames via SQL JOIN
    const [comments] = await pool.query(`
    SELECT comments.*, user.username 
    FROM comments
    JOIN user ON comments.userId = user.id;
    `)
    res.render("plats.ejs", {
        meals, comments
    })
})

/**
 * Route: Affiche le compte utilisateur (nécessite l'authentification).
 */
app.get('/account', checkAuth, async (req, res) => {
    const user = await getUser(req.session.user.id); // Fetch latest data
    res.render('account', { user }); // Pass user object
});

// GET route to display the login form
app.get('/login', RouteCache(300), (req, res) => {

  res.render("login.ejs", {
    accountExists: null // Initially no check has been done
  });
});

/**
 * Route: Gère la connexion utilisateur.
 */
app.post('/login', async (req, res) => {
    const { email, pwd } = req.body; // Use "email" to match form input name
  
    // Fetch user by email (stored in id column)
    const user = await getUser(email);
    
    if (user && pwd === user.pwd){ // Compare plaintext passwords 
        req.session.user = { 
            id: user.id, // Store email (from id column)
            username: user.username 
            };
      return res.redirect('/homepage'); // Go to account page, not homepage
    }
  
    res.render('login', { error: 'Invalid credentials' });
});

/**
 * Route: Déconnexion utilisateur.
 */
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/homepage');
});

// Comments functions
import { getComment,
  createComment,
  deleteComment,
  getCommentsByMeal,
  getCommentsByUser,
  updateComment,
  getComments} from "./Server/comments.js"; 


app.post('/plats', async (req,res) => {
    const {comment, meal} = req.body
    const userId = req.session.user.id
    const mealId = await getMealByName(meal)
    const content = comment
    await createComment(mealId, userId, content, null)
    res.redirect("/plats")
    // console.log(newComment)
})


// ———————————————————————————————————————————————————————————— // 

/**
 * Sert les fichiers statiques du dossier "public".
 */
app.use(express.static("public"))

/**
 * Middleware de gestion des erreurs.
 */
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

/**
 * Lance le serveur sur le port 8080.
 */
app.listen(8080, () => {
    console.log("Server is running on port 8080")
})


// ———————————————————————————————————————————————————————————— // 
