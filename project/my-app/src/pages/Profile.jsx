import React, { useEffect, useState } from "react";
import axios from "axios";
import Avtar from "../components/Avtar";
import { useParams } from "react-router-dom";
import useStore from "../store/useStore";
import Blogcard from "../components/Blogcard";
import useAlertStore from "../store/alertStore";

function Profile() {
  const API = import.meta.env.VITE_API_URL;
  const { message, showAlert, hideAlert } = useAlertStore();
  const { isOpen } = useStore();

  const [post, setPost] = useState(true); // true = Published, false = Drafts
  const [user, setUser] = useState({ id: "", username: "", bio: "" });
  const [publishedBlogs, setPublishedBlogs] = useState([]);
  const [draftBlogs, setDraftBlogs] = useState([]);

  const { username } = useParams();

  const togglePost = () => setPost(!post);

  // ✅ Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userFound = await axios.get(
          `${API}/user/${username}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser({
          id: userFound.data._id,
          username: userFound.data.username,
          bio: userFound.data.bio,
        });
      } catch (error) {
        console.log("Can't fetch user data", error);
      }
    };
    fetchUser();
  }, [username]);

  // ✅ Fetch blogs for this user and split into published/drafts
  useEffect(() => {
    const fetchBlogs = async () => {
      if (!user.id) return; // only fetch when user is set
      try {
        const blogsfound = await axios.get(
          `${API}/blog/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const published = blogsfound.data.filter((blog) => !blog.draft);
        const drafts = blogsfound.data.filter((blog) => blog.draft);

        setPublishedBlogs(published);
        setDraftBlogs(drafts);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchBlogs();
  }, [user.id]);

  // ✅ Custom alert trigger
  function handleNotify() {
    showAlert();
    setTimeout(() => {
      hideAlert();
    }, 3000);
  }

  return (
    <div
      className={`h-full ml-2 w-full ${
        isOpen ? "xl:w-[77%]" : "xl:w-[72%]"
      } flex justify-end items-center transition-all duration-300 ease-in-out`}
    >
      <div className="h-full w-full max-w-4xl flex-col flex items-center justify-start pt-16 px-4 sm:px-6 lg:px-8">
        {/* Profile header */}
        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36">
                    <Avtar
                      smallSize="w-24 h-24 sm:w-32 sm:h-32"
                      largeSize="lg:w-36 lg:h-36"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                {/* Username and Buttons Row */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
                  <h1 className="text-xl sm:text-2xl font-light text-gray-900 truncate">
                    {user.username}
                  </h1>
                  <div className="flex gap-2 justify-center sm:justify-start">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                      onClick={handleNotify}
                    >
                      Edit profile
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 border border-gray-200">
                      View Drafts
                    </button>
                  </div>
                </div>

                {/* Stats Row - Hidden on mobile */}
                {/* Stats Row - Hidden on mobile */}
                <div className="hidden sm:flex gap-8 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-900">
                      {publishedBlogs.length + draftBlogs.length}
                    </span>
                    <span className="text-gray-600 text-sm">posts</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-900">0</span>
                    <span className="text-gray-600 text-sm">followers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-900">0</span>
                    <span className="text-gray-600 text-sm">following</span>
                  </div>
                </div>

                {/* Bio */}
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p className="whitespace-pre-wrap max-w-md">
                    {user.bio ||
                      "No bio available yet. Add a bio to tell people more about yourself."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Stats */}
        {/* Mobile Stats */}
        <div className="sm:hidden w-full max-w-3xl mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-4">
            <div className="flex justify-around">
              <div className="text-center">
                <div className="font-semibold text-lg text-gray-900">
                  {publishedBlogs.length + draftBlogs.length}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  posts
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg text-gray-900">0</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  followers
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg text-gray-900">0</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  following
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="w-full max-w-3xl mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex">
              <button
                className={`flex-1 py-4 text-sm font-medium tracking-wide transition-all duration-200 relative
                          ${
                            post
                              ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
                              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                          }`}
                onClick={() => setPost(true)}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Published</span>
                </div>
              </button>

              <button
                className={`flex-1 py-4 text-sm font-medium tracking-wide transition-all duration-200 relative
                          ${
                            !post
                              ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
                              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                          }`}
                onClick={() => setPost(false)}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Drafts</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full max-w-3xl min-h-96">
          {post ? (
            <>
              {publishedBlogs.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                  <h3 className="text-center text-gray-500">
                    No Published Posts Yet
                  </h3>
                </div>
              ) : (
                <div className="space-y-6">
                  {publishedBlogs.map((blog, index) => (
                    <div key={index}>
                      <Blogcard blog={blog} />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {draftBlogs.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                  <h3 className="text-center text-gray-500">No Drafts Yet</h3>
                </div>
              ) : (
                <div className="space-y-6">
                  {draftBlogs.map((blog, index) => (
                    <div key={index}>
                      <Blogcard blog={blog} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
