import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';

function Button({ type, width, onClick, name }) {
  return (
    <button
      /* eslint-disable-next-line react/button-has-type */
      type={type}
      className={`w-[${width}] text-[white] bg-green-100 font-medium max-sm:font-normal rounded-lg text-base max-sm:px-1 px-10 py-3 text-center mr-3 md:mr-0 hover:bg-black`}
      onClick={onClick}>
      {name}
    </button>
  );
}

Button.propTypes = {
  type: PropTypes.string.isRequired, // Adjust the prop type according to your requirements
  width: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
};

export default Button;
