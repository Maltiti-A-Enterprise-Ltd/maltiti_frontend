const Button = (props) => {
    return(
        <button 
            type={props.type}
            className={`w-[${props.width}] text-[white] bg-green-100 font-medium max-sm:font-normal rounded-lg text-base max-sm:px-1 px-10 py-3 text-center mr-3 md:mr-0 hover:bg-black`} 
            onClick={props.onClick}
        >
            {props.name}
        </button>
    );
}

export default Button;