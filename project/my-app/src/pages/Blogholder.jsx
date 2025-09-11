import React, { useEffect, useState } from 'react';
import Blogcard from '../components/Blogcard';
import axios from 'axios';
import useStore from '../store/useStore';
import Loader from '../components/Loader';

function Blogholder() {
  const { isOpen } = useStore();
  const [blogarray, setBlogarray] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ new state

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/blog?draft=false");
        setBlogarray(response.data);
      } catch (error) {
        console.log('error fetching the blogs', error);
        alert("something went wrong");
      } finally {
        setLoading(false); // ✅ stop loading no matter what
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (blogarray.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p>No blogs available</p>
      </div>
    );
  }

  return (
    <div className={`h-full ml-2 w-full ${isOpen ? 'xl:w-[77%]' : 'xl:w-[72%]'} flex justify-end items-center transition-all duration-300 ease-in-out`}>
      <div className="h-full w-[700px] xl:w-[900px] flex-col flex items-center justify-start pt-24 pl-10 pr-5">
        {blogarray.map((blog, index) => (
          <Blogcard key={blog._id || index} blog={blog} />
        ))}
      </div>
    </div>
  );
}

export default Blogholder;
