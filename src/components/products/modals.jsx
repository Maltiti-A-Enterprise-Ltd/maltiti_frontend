import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { CircularProgress } from '@mui/material';
import { useDispatch } from 'react-redux';
import { SlCloudUpload } from 'react-icons/sl';
import Input from '../input';
import Button from '../button';
import useAxiosPrivate from '../../utility/useAxiosPrivate';
import { alertClose } from '../alerts';
import { updateProducts } from '../../actions';
import { Select } from '../select';

export function AddProduct(props) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    falvor: '',
    code: '',
    category: '',
    description: '',
    weight: '',
    status: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [category, setCategory] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const imageUpload = (event) => {
    setImage(event.target.files[0]);
    setImagePreview(URL.createObjectURL(event.target.files[0]));
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    }
  };

  const axiosPrivate = useAxiosPrivate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const addProduct = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    console.log(image);
    formData.image = image;
    try {
      const response = await axiosPrivate.post(`/products/add`, JSON.stringify(formData), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      dispatch(updateProducts(JSON.parse(response?.data?.data)));
      alertClose('success', response?.data.message);
      props.setAddModal(false);
    } catch (error) {
      alertClose('success', error.response?.data?.messsage);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategory = async () => {
    setIsLoadingCategory(true);
    try {
      const response = await axiosPrivate.get('/category/get', {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      setCategory(JSON.parse(response?.data?.data));
    } catch (error) {
      /* empty */
    } finally {
      setIsLoadingCategory(false);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <Modal
      isOpen={props.isOpen}
      style={customStyles}
      contentLabel="Add Product"
      onRequestClose={() => {
        props.setAddModal((prev) => !prev);
      }}
      shouldCloseOnOverlayClick
      ariaHideApp={false}>
      <div className="flex justify-between">
        <div className="text-gray-500">Add Products</div>
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          className="text-green-100 hover:text-red-900"
          onClick={() => props.setAddModal(false)}>
          <AiOutlineCloseCircle />
        </button>
      </div>
      <form onSubmit={addProduct} className="flex flex-col">
        <div className="flex flex-row gap-x-2">
          <Input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Name"
            onChange={handleInputChange}
          />
          <Input
            type="number"
            name="price"
            value={formData.price}
            placeholder="Price"
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-row gap-x-2">
          <Input
            type="text"
            name="flavor"
            value={formData.flavor}
            placeholder="Flavor"
            onChange={handleInputChange}
          />
          <Input
            type="text"
            name="code"
            value={formData.code}
            placeholder="Code"
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-row gap-x-2">
          <Input
            type="text"
            name="description"
            value={formData.description}
            placeholder="Description"
            onChange={handleInputChange}
          />
          <Input
            type="text"
            name="weight"
            value={formData.weight}
            placeholder="Weight"
            onChange={handleInputChange}
          />
        </div>
        <div className="flex mt-5 mb-5 items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col bg-cover items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            {imagePreview ? (
              <img alt="product preview" className="h-[15rem] max-w-full" src={imagePreview} />
            ) : (
              <div className="flex flex-col text-6xl text-gray-500 items-center justify-center pt-5 pb-6">
                <SlCloudUpload />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
            )}
            <input
              onChange={imageUpload}
              id="dropzone-file"
              name="image"
              type="file"
              accept="image/*"
              className="hidden"
            />
          </label>
        </div>
        <div className="flex gap-x-2">
          <Select isLoading={isLoadingCategory} lists={category} label="Select Speciality" />
          <Select
            isLoading={false}
            lists={[
              { name: 'Available' },
              { name: 'Out of Stock' },
              { name: 'In production' },
              { name: 'Inactive' }
            ]}
            label="Select Status"
          />
        </div>
        <br />
        {isLoading ? (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          <Button type="submit" name="Add Product" />
        )}
      </form>
    </Modal>
  );
}
