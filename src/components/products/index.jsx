import React, { useEffect, useState } from "react";
import Button from "../button";
import SearchInput from "../search";
import { TableData, TableHead } from "../table/table";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, setProducts } from "../../actions";
import useAxiosPrivate from "../../utility/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { AddProduct } from "./modals";
import { FaEdit } from "react-icons/fa";
import DeleteAlert from "../delete";

const Products = (props) => {
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchField, setSearchField] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // const deleteProduct = async (id) => {
  //     try{
  //         await axiosPrivate.delete(`/products/delete/${id}`)
  //         return true
  //     }
  //     catch (error){
  //         return error
  //     }
  // }

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axiosPrivate.get(`/products/getProducts/`, {
          signal: AbortSignal.timeout(10000),
        });
        isMounted && dispatch(setProducts(JSON.parse(response.data.data)));
      } catch (err) {
        navigate("/login", { state: { from: location }, replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    getProducts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  //function to to get filtered doctors
  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchField.toLowerCase()) ||
      String(product.price).toLowerCase().includes(searchField.toLowerCase()) ||
      product.category.toLowerCase().includes(searchField.toLowerCase()) ||
      product.description.toLowerCase().includes(searchField.toLowerCase()) ||
      product.weight.toLowerCase().includes(searchField.toLowerCase()) ||
      product.status.toLowerCase().includes(searchField.toLowerCase())
    );
  });

  return (
    <main className="flex-1 max-h-full p-5 overflow-hidden overflow-y-scroll">
      {addModalIsOpen ? (
        <AddProduct isOpen={addModalIsOpen} setAddModal={setAddModalIsOpen} />
      ) : (
        <></>
      )}
      <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between mr-8 mt-8 ml-12">
        <SearchInput
          placeholder="Search products"
          value={searchField}
          type="search"
          onChange={(event) => setSearchField(event.target.value)}
        />
        <div className="flex flex-wrap gap-4 items-end justify-end -mb-3">
          <Button
            name="Add product"
            onClick={() => setAddModalIsOpen(!addModalIsOpen)}
          />
        </div>
      </div>
      <div className="flex flex-col mt-6">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 rounded-md shadow-md">
              <table className="mt-8 min-w-full overflow-x-scroll divide-y divide-gray-200">
                <TableHead
                  heads={[
                    "Name",
                    "Price (GHS)",
                    "Category",
                    "Description",
                    "Weight",
                    "Status",
                  ]}
                />
                <tbody className="bg-white divide-y divide-gray-200 flex-">
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="grid text-center py-4">
                        <CircularProgress />
                      </td>
                    </tr>
                  ) : filteredProducts?.length ? (
                    filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="transition-all hover:bg-gray-100 hover:shadow-lg"
                      >
                        <TableData name={product.name} />
                        <TableData name={product.price} />
                        <TableData name={product.category} />
                        <TableData name={product.description} />
                        <TableData name={product.weight} />
                        <TableData name={product.status} />
                        <td className="space-x-2 text-green-400 text-lg">
                          <button className="hover:text-gray-900">
                            <FaEdit />
                          </button>
                          <DeleteAlert
                            id={product.id}
                            reduxAction={deleteProduct}
                            endpoint="/products/delete/"
                          />
                          {/* <button onClick={() => DeleteAlert(deleteProduct(), product.id)} className="hover:text-red-900"><AiFillDelete/></button> */}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No products to display
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Products;
