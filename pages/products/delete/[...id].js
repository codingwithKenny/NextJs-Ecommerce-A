import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function deleteProduct(){
    const router = useRouter()
    const {id} = router.query
    const [productInfo,setProductInfo]= useState()

    useEffect(()=>{
        if(!id){
            return;
        }
        axios.get(`/api/products?id=${id}`).then(response=>{
            setProductInfo(response.data)
    
        })

    },[id])

    function goBackToProduct(){
        router.push('/products')
    }
   async function deleteProduct(){
         await axios.delete(`/api/products?id=${id}`)
        goBackToProduct()
    }
    return(
        <Layout>
            <h1 className="text-center">Do You Want To Delete {productInfo?.title}</h1>
            <div className="text-center">
            <button className="bg-red-800 text-white mr-4 p-2" onClick={deleteProduct}>Yes</button>
            <button className="bg-gray-500 text-white p-2" onClick={goBackToProduct}>No</button>
            </div>
            


        </Layout>
    )
}