import React, { useEffect, useState } from 'react'
import ImageCarousel from '../components/ImageCarousel'
import Blogcard from '../components/Blogcard'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import CommentCard from '../components/CommentCard';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../components/CustomAlert';
import Loader from '../components/Loader';

function FullBlog() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const [content, setContent] = useState("");
  const [show, setShow] = useState(false);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const onSubmit = async () => {
    try {
      await axios.post(`${API}/blog/comment/${id}`, { content }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setShow(true);
      setContent("");
      fetchMyBlog();
    } catch (error) {
      console.log("error:", error)
    }
  };

  const fetchMyBlog = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBlog(response.data);
    } catch (error) {
      console.log(error)
    }
    setLoading(false);
  };

  useEffect(() => {
    if (localStorage.getItem('token') == null) {
      navigate('/login', { replace: true })
      return;
    }
    fetchMyBlog();
    // eslint-disable-next-line
  }, []);

  if (loading || !blog) {
    return <div className='h-screen w-full flex items-center justify-center'><Loader /></div>;
  }

  return (
    <div className='h-full w-full flex justify-center items-center'>
      {show && (
        <CustomAlert
          message="Your comment was posted!"
          type="success"
          onClose={() => {setShow(false)
            navigate('/')
          }}
        />
      )}
      <div className='h-full w-[700px] xl:w-[900px] flex-col flex items-center justify-start pt-12 lg:pt-24 pl-10 pr-5'>
        <div className="w-[400px] sm:w-[500px] md:w-[650px] lg:w-[700px] xl:w-[750px] flex-col flex items-center justify-start p-4 overflow-hidden mb-4 border-b-2 border-gray-200 transition-all duration-300 ease-in-out">
          <Blogcard blog={blog} />
          <div className="w-full p-2">
            <h4 className="font-semibold lg:font-semibold lg:text-2xl">Comments</h4>
          </div>
          <div className="h-full w-[400px] sm:w-[500px] md:w-[650px] lg:w-[700px] xl:w-[750px] flex-col flex items-center justify-start p-4 overflow-hidden mb-4 border-b-2 border-gray-200 transition-all duration-300 ease-in-out">
            <div className='flex w-full h-9 mb-4'>
              <textarea
                className='w-[88%] h-full focus:outline-none focus:ring-0 rounded-2xl border border-gray-300 p-2 text-sm'
                placeholder='Write comment....'
                value={content}
                onChange={handleChange}
              />
              <button
                type='button'
                className='rounded-2xl font-semibold text-sm text-white bg-sky-500 flex-1 h-full ml-2'
                onClick={onSubmit}
                disabled={!content.trim()}
              >
                Post
              </button>
            </div>
            {blog.comments.map((comment, index) => (
              <CommentCard key={index} comment={comment} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FullBlog