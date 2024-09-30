const { Schema, model, models, default: mongoose } = require("mongoose");


const ProductSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    price:{
        type:Number,
        required:true,
    },
    images:
          [{type:String}],
    category:{
            type:mongoose.Types.ObjectId,
            ref:"Category"
            
        },
    Properties:{type:Object}
    
})

export const Product = models.Product || model('Product',ProductSchema)