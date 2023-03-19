import { FiSearch } from "react-icons/fi";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchInput } from "../../actions";

// component to search by input
const SearchInput = (props) => {

    const dispatch = useDispatch()

    const search = useSelector(state => state.search)

    return(
            <div className="mr-6 w-72">
                <div className='max-w-md mx-auto border rounded-lg border-gray_300'>
                    <div className="relative flex items-center w-full h-10 rounded-lg overflow-hidden">
                        <div className="grid place-items-center h-full w-12 text-gray-300">
                            <FiSearch color="#667085"/>
                        </div>
                        <input
                            className="h-full w-full outline-none text-sm text-gray-700 pr-2"
                            type="text"
                            id="search"
                            placeholder={props.placeholder}
                            value={search}
                            onChange={(event)=> dispatch(searchInput(event.target.value)) }
                        /> 
                    </div>
                </div>
            </div>
    );
}

export default SearchInput;