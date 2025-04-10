import express from 'express'

import { getMeal, addMeal } from "./Server/meals.js"; // Relative path

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

app.get('/plats', (req,res) => {
    res.render("plats.ejs") 
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
