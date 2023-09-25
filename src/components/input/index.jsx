const Input = (props) => {
    return(
        <input 
            placeholder={props.placeholder} 
            value={props.value} 
            name={props.name} 
            onChange={props.onChange} 
            required 
            type={props.type} 
            className="text-gray-700 w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-700 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`"
        />
    );
}

export default Input;