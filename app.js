import express from 'express'
const app = express()

app.set('view engine', 'ejs');  // Set EJS as template engine
app.set('views', './views');    // Specify views directory (if not default)

// Middleware for handling form submissions 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

import session from 'express-session';

app.use(session({
  secret: 'random_string12345', // Need to replace this with a random string
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set at false right now because using HTTP rather than HTTPS
}));

// Middleware to check login status
const checkAuth = (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  next();
};

// Makes user data available to all templates
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
  });

// ———————————————————————————————————————————————————————————— // 

// Meals functions
import { getMeals, 
         getMeal, 
         addMeal } from "./Server/meals.js"; // Relative path

// User functions
import { existsUser,
         getUser,
         createUser,
         deleteUser,
         modifyUsername,
         modifyPassword } from "./Server/user.js"; 

// ———————————————————————————————————————————————————————————— // 

app.get('/homepage', (req,res) => {
    res.render("homepage.ejs")
})

app.get('/plats', async (req,res) => {
    const meals = await getMeals()
    //console.log(meals)
    res.render("plats.ejs", {
        meals
    })
})

app.get('/account', checkAuth, async (req, res) => {
    const user = await getUser(req.session.user.id); // Fetch latest data
    res.render('account', { user }); // Pass user object
});

// GET route to display the login form
app.get('/login', (req, res) => {
  res.render("login.ejs", {
    accountExists: null // Initially no check has been done
  });
});

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

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/homepage');
});

/*
app.post('/plats', async (req,res) => {
    const {comment} = req.body

    // ...


})*/


// ———————————————————————————————————————————————————————————— // 


app.use(express.static("public"))

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

app.listen(8080, () => {
    console.log("Server is running on port 8080")
})


// ———————————————————————————————————————————————————————————— // 
