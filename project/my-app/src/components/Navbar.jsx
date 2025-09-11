import React, { useEffect, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import img from "../assets/test-design-china-name.png";
import { HiMenu } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Avtar from "./Avtar";
import useStore from '../store/useStore';
import useAuthStore from "../store/useAuthStore";

function Navbar() {
  const API = import.meta.env.VITE_API_URL;
  const { toggleModal } = useStore();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const { isLoggedIn } = useAuthStore();
  const { isOpen, toggleIsOpen } = useStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token); // set true if token exists
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API}/user/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUser();
  }, [])

  return (
    <div className="fixed w-full h-16 bg-white/95 backdrop-blur-md flex justify-between items-center 
                   border-b border-gray-200 top-0 z-20 shadow-sm px-4 lg:px-6">
      
      {/* Left Section - Menu & Logo */}
      <div className="flex items-center space-x-4 min-w-0">
        <button
          className={`${isOpen ? 'hidden' : 'flex'} items-center justify-center w-10 h-10 
                     rounded-full hover:bg-gray-100 transition-all duration-200 group`}
          onClick={toggleIsOpen}
        >
          <HiMenu className="text-2xl text-gray-700 group-hover:text-gray-900" />
        </button>
        
        <div className="flex items-center">
          <h1 className="text-xl font-extrabold text-orange-400 mr-2">BubbleBlog</h1>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-lg mx-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IoSearch className="text-gray-400 text-lg" />
          </div>
          <input
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full
                      placeholder-gray-500 text-sm focus:outline-none focus:ring-2 
                      focus:ring-blue-500 focus:border-transparent hover:bg-gray-100
                      transition-all duration-200"
            placeholder="Search posts, users, topics..."
            type="text"
          />
        </div>
      </div>

      {/* Right Section - User Actions */}
      <div className="flex items-center justify-end min-w-0">
        {isLoggedIn ? (
          <div 
            className="flex items-center space-x-3 px-3 py-2 rounded-full cursor-pointer
                      hover:bg-gray-50 transition-all duration-200 group border border-transparent
                      hover:border-gray-200 hover:shadow-sm"
            onClick={toggleModal}
          >
            <div className="relative">
              <Avtar smallSize="h-[36px] w-[36px]" largeSize="h-[36px] w-[36px]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white 
                             rounded-full opacity-80" />
            </div>
            
            <div className="hidden sm:flex items-center space-x-1 min-w-0">
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 
                             truncate max-w-[100px]">
                {user.username}
              </span>
              <FaAngleDown className="text-gray-500 text-xs group-hover:text-gray-700 
                                   transition-transform duration-200 group-hover:rotate-180" />
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 
                      text-white rounded-full font-medium text-sm transition-all duration-200
                      shadow-sm hover:shadow-md hover:scale-105 border border-blue-600"
          >
            <span>Sign In</span>
            <FaAngleDown className="text-xs transition-transform duration-200 group-hover:rotate-180" />
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;