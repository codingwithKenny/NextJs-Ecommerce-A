import { Category } from "@/models/Category"
import mongooseConnect from "../lib/mongoose"

export default async function handler(req,res){
    const {method} = req

    try {
        await mongooseConnect()

    if(method === "POST"){

        const {name,parentCategory} = req.body
        if(!name){
            res.status(400).json({
                message:"filling in your category Name"
            })
        }
         const categoryDoc = await Category.create({
            name,
            parent:parentCategory})
          res.status(201).json({
            message:"this Category created succesfully",
            categoryDoc
          })
    }

    if (method === "GET"){
        const response = await Category.find().populate('parent')
        res.status(201).json(response)
    }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'internal error '
        })
        
    }

}