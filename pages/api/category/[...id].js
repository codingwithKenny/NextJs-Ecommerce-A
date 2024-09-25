import { Category } from "@/models/Category";
import mongooseConnect from "@/pages/lib/mongoose";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;
  console.log(id)

  try {
    await mongooseConnect();

    if (method === "DELETE") {
      if (id) {
        const result = await Category.deleteOne({ _id: id });
        res.status(200).json(result);
      } else {
        res.status(400).json({ message: "Category ID is required" });
      }
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
