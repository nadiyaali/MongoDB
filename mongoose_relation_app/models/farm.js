const mongoose = require("mongoose")
const {Schema} = mongoose
const Product = require("./product")

const farmSchema = new Schema({
    name:{
        type:String,
        required:[true, "Farm must have a name!"]
    },
    city:{
        type:String
    },
    email:{
        type:String,
        required : [true, "Email required"]
    },
    products:[
    {
        type:Schema.Types.ObjectId,
        ref:"Product"
    }]
})

// For deleting a Farm, we will use mongoose middleware which is different from Express middleware
farmSchema.pre("findOneAndDelete", async function (data){
    console.log("PRE MONGOOSE MIDDLEWARE")
    console.log(data)
})

farmSchema.post("findOneAndDelete", async function (farm){
    console.log("POST MONGOOSE MIDDLEWARE")
    console.log(farm)
    // This post middleware will have the farm data, the pre one will be empty
    if(farm.products.length){
        // find all the products using id in thr farm.products list
        const summary = await Product.deleteMany({_id:{ $in:farm.products }})
        console.log(summary)
    }
})



const Farm = mongoose.model('Farm', farmSchema);
 
module.exports = Farm;