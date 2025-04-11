import express from 'express'

import { getMeals, getMeal, addMeal } from "./Server/meals.js"; // Relative path

const app = express()

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




// ——————————————————————————————————————————————————— // 

app.use(express.static("public"))

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

app.listen(8080, () => {
    console.log("Server is running on port 8080")
})
