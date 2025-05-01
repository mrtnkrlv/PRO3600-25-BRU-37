import express from 'express'
const app = express()

// Middleware for handling form submissions 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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


// DO NOT TOUCH! EXAMPLE FUNCTIONS
/*
app.get("/", async (req,res) => {
    res.send("Front page")
})

app.get("/meal", async (req,res) => {
    const meal = await getMeal(1)
    res.send(meal)
})*/

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

app.get('/account', (req,res) => {
    res.render("account.ejs")
})

// GET route to display the login form
app.get('/login', (req, res) => {
  res.render("login.ejs", {
    accountExists: null // Initially no check has been done
  });
});

// POST route to handle the form submission
app.post('/login', async (req, res) => {
  const email = req.body.email; // Access form data with req.body
  const password = req.body.password;
  
  // Now check if user exists
  const accountExists = await existsUser(email);
  
  if (accountExists){
    // Verify password and redirect to dashboard or another page
    res.redirect('/homepage'); // Redirect to homepage
  } 
  else{
    // Render login page with message or redirect to signup
    res.render("login.ejs", {
      accountExists: false
    });
  }
});


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
