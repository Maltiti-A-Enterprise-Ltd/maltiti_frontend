import { FiSearch } from "react-icons/fi";
import React from "react";

// component to search by input
const SearchInput = (props) => {

    return(
            <div className="mr-6 w-72">
                <div className='max-w-md mx-auto border focus-within:border-green-100 rounded-lg border-gray-300'>
                    <div className="relative flex items-center w-full h-10 rounded-lg overflow-hidden">
                        <div className="grid place-items-center h-full w-12 text-gray-300">
                            <FiSearch color="#667085"/>
                        </div>
                        <input
                            className="h-full w-full outline-none text-sm text-gray-700 pr-2"
                            type="text"
                            id="search"
                            placeholder={props.placeholder}
                            value={props.value}
                            onChange={props.onChange }
                        /> 
                    </div>
                </div>
            </div>
    );
}

export default SearchInput;