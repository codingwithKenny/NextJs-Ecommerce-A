import Layout from "@/components/Layout";
import ProductForm from "@/components/product";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function editProduct(){
    const router = useRouter()
    const {id} = router.query
    const [productInfo,setProductInfo]=useState(null)

    useEffect(()=>{
        if(!id){
            return;
        }
        axios.get(`/api/products?id=${id}`).then(response=>[
            setProductInfo(response.data)
        ])

    },[id])
    
    return(
        <Layout>
           <div>
           <h1>Edit product</h1>
            {productInfo && (
               <ProductForm {...productInfo}/>
            )}
           </div>
           
        </Layout>
    )
}