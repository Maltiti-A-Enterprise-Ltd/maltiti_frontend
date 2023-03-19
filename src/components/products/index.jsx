import axios from "axios";
import { useEffect } from "react";
import Button from "../button";
import { backendUrl } from "../constants";
import SearchInput from "../search";
import { TableHead } from "../table/table";

const Products = () => {

    const getProducts = () => {
        axios.get(`${backendUrl}/products/getProducts`, {
            // headers: {
            //   'Authorization': `Bearer ${response.data["token"]}` 
            // }
          })
          .then(response => {
            
          }).catch(function(error){

          }).finally({

          })
    }

    useEffect(() => {
        getProducts()
    }, [])

    return(
        <div>
            <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between mr-8 mt-8 ml-12">
                <SearchInput placeholder="Search products"/>
                <div className="flex flex-wrap gap-4 items-end justify-end -mb-3">
                    <Button name="Add product"/>
                </div>
                
                    
            </div>
            <table className="mt-8 min-w-full overflow-x-scroll divide-y divide-gray-200">
                <TableHead heads={["Name", "Price", "Category", "Description", "Weight", "Status"]}/>
                
            </table>
        </div>
    );
} 
export default Products