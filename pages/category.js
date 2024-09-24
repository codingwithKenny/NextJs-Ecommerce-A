import Layout from "@/components/Layout";
import { useState } from "react";

export default function Category(){
    const [name,setName] = useState()
    function saveCategory(e){
        e.preventDefault()
        const data = {name}
        console.log(data)
    }
    return(
        <Layout>
            <h1>Category</h1>
            <label>New Category</label>
            <form onSubmit={saveCategory} className="flex gap-2">
                <input 
                type="text"
                 className="mb-0" 
                 placeholder="Category Name"
                 onChange={(e) => setName(e.target.value)}
                 />
                <button type="submit" className="btn-primary py-1">Save</button>
            </form>
        </Layout>
    )
}