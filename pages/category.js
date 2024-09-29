import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Category() {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [Properties,setProperties] = useState([])

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/category").then((response) => {
      setCategory(response.data);
    });
  }

  function saveCategory(e) {
    e.preventDefault();
    const data = { name};

    if (parentCategory){
      data.parentCategory = parentCategory
    }
    if (Properties.length > 0) {
      // transform and assign Properties
      data.Properties = Properties.map((p,i) => ({
          key:i,
          name: p.name,
          value: p.value.split(",") 
      }));
  }else{
    data.Properties = []; // Explicitly set to empty array

  }
    if (editedCategory) {
      axios
        .put("/api/category", { ...data, _id: editedCategory._id })
        .then(() => {
          setEditedCategory(null);
          setParentCategory("");
          setName("");
          setProperties([])
          fetchCategories(); // Only call after saving
        });
    } else {
      axios.post("/api/category", data).then(() => {
        setName("");
        setParentCategory("");
        setProperties([])
        fetchCategories(); // Only call after saving
      });
    }
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category?.parent?._id);
    setProperties(category?.Properties.map(({name,value},i)=>({
      key:i,
      name,
      value:value.join(',')
    })))
  }

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this category?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/api/category/${id}`)
          .then(() => {
            Swal.fire("Deleted!", "The category has been deleted.", "success");
            // Refetch the categories after deletion
            fetchCategories();
          })
          .catch((error) => {
            console.error("Error deleting category:", error);
            Swal.fire("Error!", "There was a problem deleting the category.", "error");
          });
      }
    });
  };
  function addProperties() {

    setProperties(prev=>(
      [...prev,{name:'',value:''}]
      
    ))
    
  }
  function handleNameChange(index, newPropertyName) {
    setProperties((prev) => {
      const Properties = [...prev]
      Properties[index].name = newPropertyName
      return Properties
      
    });
  }
  function handleValueChange(index, newPropertyName) {
    setProperties((prev) => {
      const Properties = [...prev]
      Properties[index].value = newPropertyName
      return Properties
      
    });
  //  console.log(Properties)
  }
  function handleRemoveProperty(index) {
    setProperties((prev) => prev.filter((_, i) => i !== index));
    
  }

 


  return (
    <Layout>
      <h1>Category</h1>
      <label>{editedCategory ? `Edit Category ${editedCategory.name}` : "Create New Category"}</label>
      <form onSubmit={saveCategory} className="">
        <div className="flex gap-2">
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
          onChange={(e) => setParentCategory(e.target.value)}
        >
          <option value="">Select parent category</option>
          {category?.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
        </div>
       <div className="mb-2">
        <label className="block">Properties</label>
       <button
       type="button"
        className="btn-default text-sm mb-2"
        onClick={addProperties}>
          Add New Property
          </button>
          {Properties.length >0 && Properties.map((property,index)=>(
           <div key={index} className="flex gap-2 ">
             <input
              type="text" 
              className=""
              placeholder="property name (e.g color)"
              value={property.name}
             onChange={(e)=>handleNameChange(index,e.target.value)}></input>
             <input 
             type="text" 
             onChange={(e)=>handleValueChange(index,e.target.value)}
             placeholder="property Value"
             value={property.value}></input>
              <button
              type="button"
              className="btn-primary mb-2"
              onClick={(e)=>handleRemoveProperty(index)}>
              Remove
              </button>
           </div>

          )) }
          
       </div>
       {editedCategory && (
        <button
        type="button"
        onClick={()=> {setEditedCategory(null)
          setName('')
          setParentCategory('')
          setProperties([])
        }}
        className="btn-default mr-2">
          Cancel
          </button>
       )}
        <button type="submit" className="btn-primary py-1">
          Save
        </button>
      </form>
     {!editedCategory && (
       <table className="basic mt-4">
       <thead>
         <tr>
           <td>Category Name</td>
           <td>Parent Category</td>
           <td></td>
         </tr>
       </thead>
       <tbody>
         {category?.map((items) => (
           <tr key={items._id}>
             <td>{items.name}</td>
             <td>{items?.parent?.name}</td>
             <td>
               <button className="btn-primary" onClick={() => editCategory(items)}>
                 Edit
               </button>
               <button onClick={() => handleDelete(items._id)} className="btn-primary">
                 Delete
               </button>
             </td>
           </tr>
         ))}
       </tbody>
     </table>
     )}
    </Layout>
  );
}
