import React from 'react'
import { CgProfile } from "react-icons/cg";
import { IoLogOutOutline } from "react-icons/io5";
import { FaUserEdit } from "react-icons/fa";
import useStore from '../store/useStore';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

function ProfileModal() {
    const navigate = useNavigate();
    const { modal } = useStore();
    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/');
        window.location.reload();
    };

    return (
        <div
            className={`
                ${modal ? 'flex' : 'hidden'}
                flex-col items-start
                w-[90vw] max-w-[320px] sm:w-[180px] lg:w-[250px]
                h-auto py-2
                fixed top-16 right-2 sm:right-[40px]
                bg-white p-4 rounded-b-2xl shadow-xl border border-gray-200 z-20
                transition-all duration-300
            `}
        >
            <div className="w-full flex flex-col gap-2">
                <button
                    className="flex items-center w-full px-2 py-2 rounded hover:bg-gray-100 transition"
                    onClick={() => navigate('/profile/me')}
                >
                    <CgProfile className="text-[18px] sm:text-[20px] lg:text-[25px] mr-2" />
                    <span className="text-[15px] sm:text-sm text-gray-800 font-medium">View Profile</span>
                </button>
                <button
                    className="flex items-center w-full px-2 py-2 rounded hover:bg-gray-100 transition"
                    onClick={() => navigate('/profile/edit')}
                >
                    <FaUserEdit className="text-[18px] sm:text-[20px] lg:text-[25px] mr-2" />
                    <span className="text-[15px] sm:text-sm text-gray-800 font-medium">Edit Profile</span>
                </button>
                <button
                    className="flex items-center w-full px-2 py-2 rounded hover:bg-red-50 transition"
                    onClick={handleLogout}
                >
                    <IoLogOutOutline className="text-[18px] sm:text-[20px] lg:text-[25px] mr-2" />
                    <span className="text-[15px] sm:text-sm text-red-500 font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}

export default ProfileModal