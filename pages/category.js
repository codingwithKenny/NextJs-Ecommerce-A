import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Category(){
    const [editedCategory,setEditedCategory] = useState(null)
    const [name,setName] = useState('')
    const [category,setCategory] = useState([])
    const [parentCategory,setParentCategory] = useState('')

    useEffect(() => {
        fetchCategories()
      }, []);
      function fetchCategories(){
        axios.get("/api/category").then((response) => {
            setCategory(response.data);
          });
      }
    
    function saveCategory(e){
        e.preventDefault()
        const data = {name,parentCategory}
        console.log(data)
        axios.post('/api/category', data)
        setName('')
        fetchCategories()

       
    }
    function editCategory(category){
        setEditedCategory(category)
        setName(category.name)
        setParentCategory(category?.parent?._id)

    }
    return(
        <Layout>
            <h1>Category</h1>
            <label>{editedCategory? `Edit Category ${editedCategory.name}`: ' Create New Category '}</label>
            <form onSubmit={saveCategory} className="flex gap-2">
                <input 
                type="text"
                 className="mb-0" 
                 placeholder="Category Name"
                 onChange={(e) => setName(e.target.value)}
                 value={name}
                 />
                 <select
                  className="mb-0"
                  value={parentCategory}
                  onChange={(e)=> setParentCategory(e.target.value)}>
                    <option value="">select parent Category</option>
                    {category?.map((item,e)=>{
                        return(
                            <option value={item._id}>{item.name}</option>
                        )
                    })}
                 </select>
                <button type="submit" className="btn-primary py-1">Save</button>
            </form>
            <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category Name</td>
            <td>Parent category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {category?.map((items, e) => {
            return (
              <tr key={e} className="">
                <td>{items.name}</td>
                <td>{items?.parent?.name}</td>
                <td>
                    <button 
                    className="btn-primary"
                    onClick={()=> editCategory(items)}>
                        Edit
                    </button>
                    <button className="btn-primary">Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
        </Layout>
    )
}