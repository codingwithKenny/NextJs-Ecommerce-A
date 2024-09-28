import { Product } from "@/models/Products";
import mongooseConnect from "../lib/mongoose";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;


  try {
    await mongooseConnect();


    if (method==='GET'){
      if(req.query?.id){
        res.json(await Product.findById(req.query.id))

      }else{
        res.json(await Product.find())
      }
     
    }

    if (method === "PUT"){
      const {title,description,price,images,category,_id} = req.body
      await Product.updateOne({_id},{title,description,price,images,category})
      res.json(true)
    }

    if (method === "DELETE") {
      if (req.query?.id) {
        const result = await Product.deleteOne({_id: req.query.id });
        
        res.json(true);
      } else {
        res.status(400).json({ message: "Product ID is required" });
      }
    }

    if (method === "POST") {
      const { title, description, price,images,category } = req.body;

      if (!title || !price) {
        return res
          .status(400)
          .json({ message: "Title and price are required" });
      }

      const productData = await Product.create({ title, description, price,images,category });
      return res.status(201).json({
        message: "Product created",
        productData,
      });
    } else {
      return res.status(405).json({
        message: "Method Not Allowed",
      });
    }
    
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
