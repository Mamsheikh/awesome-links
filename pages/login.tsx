import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';
import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';

const LoginMutation = gql`
  mutation Login($email: String!, $image: String!) {
    login(email: $email, image: $image) {
      name
      email
      image
    }
  }
`;

const Login = () => {
  const [imageSrc, setImageSrc] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [login, { data, loading, error }] = useMutation(LoginMutation, {
    onCompleted: (data) => {
      Router.push('/');
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const onSubmit = async (data) => {
    // const { title, url, category, description, image } = data;
    console.log(data);
    // const variables = { title, url, category, description, imageUrl };
    try {
      toast.promise(
        login({
          variables: {
            email: data.email,
            image: data.email,
          },
        }),
        {
          loading: 'Creating new user..',
          success: 'User successfully created!🎉',
          error: `Something went wrong 😥 Please try again -  ${error}`,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  //   async function handleOnSubmit(event) {
  //     const data = await fetch('/api/upload-image', {
  //       method: 'POST',
  //       body: JSON.stringify({
  //         image: imageSrc,
  //       }),
  //     }).then((r) => r.json());

  //     // setUploadData(data);
  //   }

  return (
    <div className='container mx-auto max-w-md py-12'>
      <Toaster />
      <h1 className='text-3xl font-medium my-5'>Create a new link</h1>
      <form
        className='grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg'
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className='block'>
          <span className='text-gray-700'>Email</span>
          <input
            placeholder='Email'
            name='email'
            type='text'
            {...register('email', { required: true })}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
          />
        </label>
        <label className='block'>
          <span className='text-gray-700'>Image</span>
          <input
            placeholder='Image'
            {...register('image', { required: true })}
            name='image'
            type='text'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
          />
        </label>

        <button
          //   disabled={loading}
          type='submit'
          className='my-4 capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600'
        >
          {/* {loading ? (
            <span className='flex items-center justify-center'>
              <svg
                className='w-6 h-6 animate-spin mr-1'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z' />
              </svg>
              Creating...
            </span>
          ) : (
            <span>Create Link</span>
          )} */}
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
