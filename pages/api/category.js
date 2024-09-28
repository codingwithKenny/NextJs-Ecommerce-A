import { Category } from "@/models/Category";
import mongooseConnect from "../lib/mongoose";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  try {
    await mongooseConnect();

    if (method === "POST") {
      const { name, parentCategory,Properties } = req.body;
      if (!name) {
        return res.status(400).json({
          message: "Please provide a category name",
        });
      }
      const categoryDoc = await Category.create({
        name,
        parent: parentCategory,
        Properties
      });
      res.status(201).json({
        message: "Category created successfully",
        categoryDoc,
      });
    }

    if (method === "GET") {
      const response = await Category.find().populate("parent");
      res.status(200).json(response);
    }

    if (method === "PUT") {
      const { name, parentCategory, Properties, _id } = req.body;
      
      const categoryDoc = await Category.updateOne(
        { _id },
        { 
          name, 
          parent: parentCategory, 
          Properties
        }
      );
    
      res.json(categoryDoc);
    }
    

    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}
