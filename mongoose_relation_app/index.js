const express = require("express")
const app = express()
const path= require("path")
const mongoose = require("mongoose")
const port = 3000
const Product = require("./models/product.js")
const methodOverride = require("method-override")
const { findByIdAndUpdate } = require("./models/product.js")
const categories = ["fruit","vegetable","dairy","baked goods"]

mongoose.connect('mongodb://127.0.0.1:27017/RelationProducts')
.then(()=>{
    console.log("Mongo Connection open!!")
})
.catch( err =>{
    console.log("Oh No Mongo ERROR !!!!")
    console.log(err)
})


app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.urlencoded({extended:true}))
// add ?_method=PUT to submit url
app.use(methodOverride("_method"))


app.listen(port, ()=>{
    console.log("Listening on Port 3000")
})

//////////////////// Farm Routes ////////////////////////////
const Farm = require("./models/farm.js")

app.get("/farms", async(req,res) =>{
    const farmList = await Farm.find({})
    res.render("farms/index.ejs", {farmList})
})

app.get("/farms/new", (req,res) =>{
    res.render("farms/new.ejs")
})

app.get("/farms/:id", async(req,res) =>{
    console.log("********FIND FARM BY ID*******")
    const { id } = req.params
    const foundFarm = await Farm.findById(id).populate("products")
    console.log(foundFarm)
    res.render("farms/details.ejs",{foundFarm})

})

app.get("/farms/:id/products/new", async (req,res)=>{
    const { id } = req.params
    const foundFarm = await Farm.findById(id) 
    res.render("products/new.ejs",{categories,foundFarm})
})



app.post("/farms/:id/products", async(req,res)=>{
    console.log("Saving product with farm ID")
    //console.log(req.body)
    // Get the farm through ID
    const { id } = req.params
    const foundFarm = await Farm.findById(id) 
    res.send(foundFarm)
    //create product
   
    const {name,price,category} = req.body
    const newProduct = new Product({name,price,category})
    
    //First add to Farm
    foundFarm.products.push(newProduct)
    
    // Add farm to product
    newProduct.farm = foundFarm
    
    await newProduct.save()
    await foundFarm.save()
    console.log(foundFarm)
    console.log(newProduct)
    
    //res.redirect(`/farms/${foundFarm._id}`)
    //res.redirect("/products")
})


app.post("/farms", async(req,res) =>{
    const farm = new Farm(req.body) 
    await farm.save()
    res.redirect("/farms")
})

app.delete("/farms/:id", async(req,res) =>{
    console.log("************** Deleteing Farm ******************************")
    // DANGER : Dont use param instead of params
    const farm = await Farm.findByIdAndDelete(req.params.id)
    console.log(farm)
    res.redirect("/farms")
})






////////////////////// Products Routes ////////////////////////
// get all products
app.get("/products",async (req,res)=>{
    const {category} = req.query
    if(category){
        console.log(category)
        const productList = await Product.find({category:category})
        res.render("products/index.ejs",{productList, category})
    }
    else{
    const productList = await Product.find({})   
    //console.log(productList)
    //res.send("App product list is on its way")
    res.render("products/index.ejs",{productList, category:"All"})
    }
})

// get form for new product
app.get("/products/new", (req,res) => {
    console.log("New product page")
    res.render("products/new.ejs",{categories})
})


// get one product by id
app.get("/products/:id", async (req,res) =>{
    const { id } = req.params
    const foundProduct = await Product.findById(id).populate("farm")
    //console.log(foundProduct)
    //res.send(foundProduct)
    res.render("products/details.ejs",{foundProduct})
})

// the form info is in req.body but is undefines, u need to parse it to get the actual values 
// add new product
app.post("/products", async (req,res) =>{
    console.log(req.body)
    const newProduct = new Product(req.body)
    await newProduct.save()
    console.log(newProduct)
    //res.send("Product added to database")
    res.redirect(`/products/${newProduct.id}`)
})

// update product
app.get("/products/:id/edit", async (req,res) =>{
    const { id } = req.params
    const foundProduct = await Product.findById(id) 
    res.render("products/edit.ejs",{foundProduct, categories})
})

// Put request will replace all the values of the item in db
//Patch request can replace only some values, e.g price only
// npm install method-override to use this put request
//because the form can only submit POST
app.put("/products/:id", async (req,res) =>{
    console.log(req.body)
    const { id } = req.params
    // add runValidators to enforce validation on new data
    const updateProduct = await Product.findByIdAndUpdate(id, req.body,{runValidators:true, new:true})
    res.redirect(`/products/${updateProduct._id}`)
})

//Delete a  product
app.delete("/products/:id", async (req,res) =>{
    const { id } = req.params
    const deletedProduct = await Product.findByIdAndDelete(id)
    //res.send("Product deleted")
    res.redirect("/products")
})