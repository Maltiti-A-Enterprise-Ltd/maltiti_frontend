import React from 'react';

export function Select(props) {
  return (
    <select
      onChange={props.onChange}
      value={props.value}
      className="w-full px-8 py-4 text-gray-700 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-700 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5">
      {props.isLoading ? (
        <option value="" disabled defaultValue selected>
          Loading... Please Wait
        </option>
      ) : (
        <>
          <option className="text-green-100" value="" defaultValue selected disabled>
            {props.label}
          </option>
          {props.lists.map((option) => (
            <option key={option.id} value={option.name}>
              {option.name}
            </option>
          ))}
        </>
      )}
    </select>
  );
}
