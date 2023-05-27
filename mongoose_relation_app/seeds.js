const mongoose = require("mongoose")
const Product = require("./models/product.js")

mongoose.connect('mongodb://127.0.0.1:27017/RelationProducts')
.then(()=>{
    console.log("Mongo Connection open!!")
})
.catch( err =>{
    console.log("Oh No Mongo ERROR !!!!")
    console.log(err)
})

// const p = new Product({name:"Apple", price:2.00, category: "fruit"})
// p.save().then(p=>{
//     console.log(p)
// }).catch(e=>{
//     console.log("ERROR IN SAVING PRODUCT")
//     console.log(e)
// })

const seedProducts = [
    {name:"Watermelon", price:5.80, category: "fruit"},
    {name:"Cherry Tomatoes", price:1.80, category: "vegetable"},
    {name:"Milk", price:4.50, category: "dairy"},
    {name:"Nectarine", price:8.80, category: "fruit"},
    {name:"Jalapeno", price:1.30, category: "vegetable"},
]

Product.insertMany(seedProducts)
.then(res =>{
    console.log(res)
})
.catch(e =>{
    console.log(e)
})

