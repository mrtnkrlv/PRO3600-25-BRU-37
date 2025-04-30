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

app.get('/account', async (req,res) => {
    res.render("account.ejs");
})


// Need to set up GET and POST routes!!
// >>

app.get('/account/login', async (req,res) => {
    //const accountExists = await existsUser(req.params.)
    res.render("account/login.ejs",/*{
        accountExists
    }*/);
}) 


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


// Allowing user to login with TSP email address:
// >> Add all TSP email addresses in the corresponding DB
// >> Verify if an account has already been created (boolean attribute?)
// >> Then log them in/send an error message accordingly