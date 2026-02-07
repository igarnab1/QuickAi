import { Hash, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast'
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const BlogTitles = () => {

  const blogCategories = ['General', 'Technology', 'Health', 'Business', 'Travel', 'Lifestyle', 'Education', 'Food'];

  const [selectedCategory, setSelectedCategory] = useState('General');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const prompt = `Generate 5 catchy blog titles.
      Keyword: "${input.trim()}"
      Category: "${selectedCategory}"`

      const { data } = await axios.post(
        '/api/ai/generate-blog-title',
        {
          keyword: input.trim(),
          category: selectedCategory
        },
        {
          headers: { Authorization: `Bearer ${await getToken()}` }
        })

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
          <Sparkles className='w-6 text-[#8E37EB]' />
          <h1 className='text-xl font-semibold'>AI Title Generator</h1>
        </div>
        <p className='mt-6 font-medium text-sm'>Keyword</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type='text'
          placeholder='The main keyword for your blog titles (e.g., productivity)'
          className='w-full px-3 p-2 mt-2 outline-none text-sm rounded-md border border-gray-300'
          required
        />

        <p className='mt-4 font-medium text-sm'>Category</p>

        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {
            blogCategories.map((item) => (
              <span onClick={() => setSelectedCategory(item)}
                className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedCategory === item ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 border-gray-300 text-gray-500'}`} key={item}>
                {item}
              </span>
            ))}
        </div>
        <br />

        <button disabled={loading} className='w-full flex gap-3 justify-center items-center bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 rounded-lg mt-6 text-sm cursor-pointer hover:opacity-90'>
          {
            loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Hash className='w-5' />
          }
          Generate Title
        </button>

      </form>

      {/* Right Col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3'>
          <Hash className=' w-5 h-5 text-[#8E37EB]' />
          <h1 className='text-xl font-semibold'>Generated Titles</h1>
        </div>

        {
          !content ? (
            <div className='flex flex-1 justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <Hash className=' w-9 h-9' />
                <p>Enter keywords and click "Generate Title" to get started</p>
              </div>
            </div>
          ) : (
            <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-600'>
              <div className='reset-tw'>
                <Markdown>{content}</Markdown>
              </div>
            </div>
          )}

      </div>

    </div>
  )
}

export default BlogTitles
