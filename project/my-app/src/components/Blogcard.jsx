import React, { useState, useEffect } from "react";
import ImageCarousel from "./ImageCarousel";
import { BiUpvote } from "react-icons/bi";
import { BiDownvote } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa6";
import { FaShare } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { BiSolidUpvote } from "react-icons/bi";
import Avtar from "./Avtar";

function Blogcard({ blog }) {
  const API = import.meta.env.VITE_API_URL;
  const [isDraft, setIsDraft] = useState(blog.draft);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [likes, setLikes] = useState(blog.likes)
  const [liked, setLiked] = useState(false);
  let userId = null;

  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.id;
  }

  useEffect(() => {
    if (blog && blog.likes && userId) {
      setLiked(blog.likes.includes(userId));
      setLikes(blog.likes)
    }
  }, [blog]);

  const handleLike = async () => {
    const newLikedState = !liked;  // flip the like
    setLiked(newLikedState);
    if (token == null) {
      navigate('/login')
      return;
    }
    try {
      const response = await axios.patch(`${API}/blog/like/${blog._id}`, { liked },
        {
          headers:
          {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      setLikes(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleToggleStatus = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.patch(
        `${API}/blog/toggle-status/${blog._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsDraft(response.data.draft); // update local state
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const openFull = () => {
    navigate(`/blog/${blog._id}`)
  }

  return (
    <div className="w-[400px] sm:w-[500px] md:w-[650px] lg:w-[700px] bg-white flex-col flex 
                    items-center justify-start rounded-2xl overflow-hidden lg:mb-4 
                    border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg 
                    transition-all duration-300 ease-out hover:-translate-y-1 
                    backdrop-blur-sm bg-white/95">

      {/* Header with Author Info */}
      <div className="w-full p-4 pb-2">
        <div className="flex items-center justify-between w-full">
          <Link to={`/profile/${blog.author.username}`}>
            <div className="flex items-center group">
              <div className="relative">
                <Avtar smallSize="h-[44px] w-[44px]" largeSize="h-[44px] w-[44px]" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400/20 to-purple-400/20 
                               opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 
                            transition-colors duration-200">
                  {blog.author.username}
                </p>
                <div className="flex items-center mt-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                  <span className="text-xs text-gray-500">Just now</span>
                </div>
              </div>
            </div>
          </Link>
          
          {/* Published/Draft Status Button - Now on the right */}
          {userId === blog.author._id && (
            <button
              onClick={handleToggleStatus}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${isDraft
                  ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
            >
              {isDraft ? "Draft" : "Published"}
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="w-full px-4 pb-3">
        <h4 className="font-bold text-lg lg:text-xl text-gray-900 leading-tight 
                      cursor-pointer hover:text-blue-700 transition-colors duration-200 
                      line-clamp-2"
          onClick={openFull}>
          {blog.title}
        </h4>
      </div>

      {/* Content */}
      <div className="w-full px-4 pb-4">
        <p className="text-gray-700 text-sm leading-relaxed">
          {blog.content}
        </p>
      </div>

      {/* Images */}
      <div className="w-full px-4 pb-4">
        <div className="rounded-xl overflow-hidden shadow-sm">
          <ImageCarousel images={blog.images} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full px-4 pb-4">
        <div className="flex items-center justify-start space-x-1">

          {/* Like Button */}
          <button
            className="flex items-center space-x-2 px-3 py-2 rounded-full 
                      hover:bg-blue-50 transition-all duration-200 group min-w-0"
            onClick={handleLike}>
            {!liked ? (
              <BiUpvote className="text-lg text-gray-600 group-hover:text-blue-600 
                                transition-colors duration-200" />
            ) : (
              <BiSolidUpvote className="text-lg text-blue-600" />
            )}
            <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">
              {likes.length}
            </span>
          </button>

          {/* Downvote Button */}
          <button
            className="flex items-center justify-center p-2 rounded-full 
                      hover:bg-red-50 transition-all duration-200 group">
            <BiDownvote className="text-lg text-gray-600 group-hover:text-red-600 
                                 transition-colors duration-200" />
          </button>

          {/* Comment Button */}
          <button
            className="flex items-center space-x-2 px-3 py-2 rounded-full 
                      hover:bg-gray-100 transition-all duration-200 group min-w-0"
            onClick={openFull}>
            <FaRegComment className="text-base text-gray-600 group-hover:text-gray-800 
                                   transition-colors duration-200" />
            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-800">
              {blog.comments.length}
            </span>
          </button>

          {/* Share Button */}
          <button
            className="flex items-center justify-center p-2 rounded-full 
                      hover:bg-green-50 transition-all duration-200 group">
            <FaShare className="text-base text-gray-600 group-hover:text-green-600 
                              transition-colors duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Blogcard;