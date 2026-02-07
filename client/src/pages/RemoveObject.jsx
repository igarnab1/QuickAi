import React, { useState } from 'react'
import { Scissors, Sparkles } from 'lucide-react';
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const RemoveObject = () => {

  const [input, setInput] = useState('');
  const [object, setObject] = useState('');
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)

      if (object.split(' ').length > 1) {
        return toast('Please enter only one Object')
      }

      const formData = new FormData();
      formData.append('image', input);
      formData.append('object', object);

      const { data } = await axios.post(
        '/api/ai/remove-image-object',
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        }
      )

      if (data.success) {
        setContent(data.content)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>

      {/* Left Col */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>

        <div className='flex gap-3 items-center'>
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Object Removal</h1>
        </div>

        <p className='mt-6 font-medium text-sm'>Upload Image</p>

        <input
          onChange={(e) => setInput(e.target.files[0])}
          type='file'
          accept='image/*'
          className='w-full px-3 p-2 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600'
          required
        />

        <p className='mt-6 font-medium text-sm'>Describe Object to remove</p>

        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={4}
          placeholder='e.g., Remove the person wearing a red shirt...'
          className='w-full px-3 p-2 mt-2 outline-none text-sm rounded-md border border-gray-300'
          required
        />

        <p className='mt-1 text-xs font-light text-gray-500'>Be specific about the object you want to remove</p>

        <button disabled={loading} className='w-full flex gap-3 justify-center items-center bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white px-4 py-2 rounded-lg mt-6 text-sm cursor-pointer hover:opacity-90'>
          {
            loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Scissors className='w-5' />
          }
          Remove Object
        </button>

      </form>

      {/* Right Col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3'>
          <Scissors className=' w-5 h-5 text-[#3C81F6]' />
          <h1 className='text-xl font-semibold'>Processed Image</h1>
        </div>

        {!content ? (
          <div className='flex flex-1 justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Scissors className=' w-9 h-9' />
              <p>Upload an Image and describe what to remove</p>
            </div>
          </div>
        ) : (
          <div className='mt-3 h-full'>
            <img
              src={content}
              alt="image"
              className='w-full h-full'
            />
          </div>
        )}

      </div>

    </div>
  )
}

export default RemoveObject
