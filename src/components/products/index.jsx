import { useEffect, useState } from "react";
import Button from "../button";
import SearchInput from "../search";
import { TableData, TableHead } from "../table/table";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../actions";
import useAxiosPrivate from "../../utility/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const Products = () => {

    const products = useSelector(state => state.products)
    const dispatch = useDispatch();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getProducts = async () => {
            setIsLoading(true)
            try {
                const response = await axiosPrivate.get(`/products/getProducts/`, {
                    signal: AbortSignal.timeout(10000)
                });
                isMounted && dispatch(setProducts(JSON.parse(response.data.data)))
            } catch (err) {
                navigate('/login', { state: { from: location }, replace: true });
            }
            finally{
                setIsLoading(false)
            }
        }

        getProducts();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    return(
        <main class="flex-1 max-h-full p-5 overflow-hidden overflow-y-scroll">
            <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between mr-8 mt-8 ml-12">
                <SearchInput placeholder="Search products"/>
                <div className="flex flex-wrap gap-4 items-end justify-end -mb-3">
                    <Button name="Add product"/>
                </div>
                    
            </div>
        <div class="flex flex-col mt-6">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div class="overflow-hidden border-b border-gray-200 rounded-md shadow-md">
            <table className="mt-8 min-w-full overflow-x-scroll divide-y divide-gray-200">
                <TableHead heads={["Name", "Price (GHS)", "Category", "Description", "Weight", "Status"]}/>
                <tbody className="bg-white divide-y divide-gray-200">
                    { isLoading ? 
                        <tr>
                            <td colSpan="6" className="text-center py-4"><CircularProgress /></td>
                        </tr>
                        :
                        products?.length ? 
                            (products.map((product) => (
                                <tr key={product.id} className="transition-all hover:bg-gray-100 hover:shadow-lg">
                                    <TableData name={product.name}/>
                                    <TableData name={product.price}/>
                                    <TableData name={product.category}/>
                                    <TableData name={product.description}/>
                                    <TableData name={product.weight}/>
                                    <TableData name={product.status}/>
                                </tr>
                            ))) 
                            : 
                            <tr>
                                <td colSpan="6" className="text-center py-4">No products to display</td>
                            </tr>
                    } 
                </tbody>  
            </table>   
        </div>
        </div>
        </div>
        </div>
        </main>
    );
} 

export default Products