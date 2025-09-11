import React, { useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { HiOutlineDocument } from "react-icons/hi2";
import { HiOutlinePhoto } from "react-icons/hi2";
import { HiOutlineLink } from "react-icons/hi2";
import ImageCarousel from "../components/ImageCarousel";
import axios from "axios";
import useStore from "../store/useStore";
import CustomAlert from '../components/CustomAlert';
import { useNavigate } from "react-router-dom";
function Createpost() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [errorModal, setErrorModal] = useState(false);
  const { isOpen } = useStore();
  const [show, setShow] = useState(false);
  const [content, setContent] = useState(true);
  const [images, setImages] = useState(false);
  const [link, setLink] = useState(false);
  const [fileArray, setFileArray] = useState([]);
  const [errors, setErrors] = useState({
    titleError: "",
    contentError: "",
  });
  const [freez, setFreez] = useState(true);
  const [text, setText] = useState({
    title: "",
    content: "",
    link: "",
  });
  const [fileLinkArray, setFileLinkArray] = useState([]);

  const handleChange = (e) => {
    console.log(text);
    setText((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const toggleContent = () => {
    setContent(true);
    setImages(false);
    setLink(false);
  };

  const toggleImages = () => {
    setContent(false);
    setImages(true);
    setLink(false);
  };

  const toggleLinks = () => {
    setContent(false);
    setImages(false);
    setLink(true);
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    const newFiles = Array.from(files);
    setFileArray((prev) => {
      return [...prev, ...newFiles];
    });
    const fileArray = Array.from(files);
    fileArray.forEach((file) => {
      setFileLinkArray((prev) => {
        return [...prev, URL.createObjectURL(file)];
      });
    });
    console.log(files);
  };

  const handleSubmit = async (isDraft) => {
  const token = localStorage.getItem('token');
  setErrors({ titleError: "", contentError: "" });

  let hasError = false;
  if (text.title.trim() === "") {
    setErrors((prev) => ({ ...prev, titleError: "Title can't be empty" }));
    hasError = true;
  }
  if (text.content.trim() === "") {
    setErrors((prev) => ({ ...prev, contentError: "Content can't be empty" }));
    hasError = true;
  }

  if (hasError) {
    setFreez(true);
    return;
  }

  try {
    const formData = new FormData();
    formData.append("title", text.title);
    formData.append("link", text.link);
    formData.append("content", text.content);
    formData.append("draft", isDraft);  // ✅ send draft flag

    fileArray.forEach((file) => {
      formData.append("images", file);
    });

    const response = await axios.post(`${API}/blog`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    setShow(true);
    console.log("Form posted successfully", response.data);
  } catch (error) {
    setErrorModal(true);
    console.log("Something went wrong", error);
  }
};


  useEffect(() => {
    if (text.content.trim() !== '' && text.title.trim() !== '') {
      setFreez(false);
    }
    if (text.content.trim() === '' || text.title.trim() === '') {
      setFreez(true);
    }
  }, [text])


  return (
    <div className={`h-full ml-2 w-full ${isOpen ? 'xl:w-[77%]' : 'xl:w-[72%]'} flex justify-end iems-center transition-all duration-300 ease-in-out`}>
      {show && (
        <CustomAlert
          message="Your blog was posted!"
          type="success"
          onClose={() => {
            setShow(false)
            navigate('/')
          }}
        />
      )}
      {errorModal && (
        <CustomAlert
          message="Image Not in Proper Format!"
          type="error"
          onClose={() => {
            setErrorModal(false)
            navigate('/')
          }}
        />
      )}
      <div className="h-full w-[700px] xl:w-[900px] flex-col flex items-center justify-start pt-24 pl-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Post</h1>
          <p className="text-gray-600">Share your thoughts with the community</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-gray-50/50">
            <div className="flex">
              <button
                className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-all duration-200
                          ${content
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                onClick={toggleContent}
              >
                <HiOutlineDocument className="text-lg" />
                <span>Text</span>
              </button>

              <button
                className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-all duration-200
                          ${images
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                onClick={toggleImages}
              >
                <HiOutlinePhoto className="text-lg" />
                <span>Images & Video</span>
              </button>

              <button
                className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-all duration-200
                          ${link
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                onClick={toggleLinks}
              >
                <HiOutlineLink className="text-lg" />
                <span>Link</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 space-y-6">

            {/* Title Input */}
            <div>
              <input
                name="title"
                type="text"
                value={text.title}
                placeholder="Title"
                className="w-full px-4 py-3 text-lg font-medium border border-gray-300 rounded-lg
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          placeholder-gray-500 transition-all duration-200"
                onChange={handleChange}
              />
              {errors.titleError && (
                <div className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                  {errors.titleError}
                </div>
              )}
            </div>

            {/* Content Tab */}
            {content && (
              <div>
                <textarea
                  name="content"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            placeholder-gray-500 transition-all duration-200"
                  value={text.content}
                  placeholder="What are you thinking about?"
                  onChange={handleChange}
                />
                {errors.contentError && (
                  <div className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {errors.contentError}
                  </div>
                )}
              </div>
            )}

            {/* Images Tab */}
            {images && (
              <div className="space-y-4">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center
                               hover:border-gray-400 transition-colors duration-200">
                  <input
                    type="file"
                    id="upload"
                    multiple
                    hidden
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="upload" className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center
                                     hover:bg-gray-200 transition-colors duration-200">
                        <IoCloudUploadOutline className="text-2xl text-gray-600" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">Upload media</p>
                        <p className="text-sm text-gray-600">Drag and drop or click to browse</p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Image Preview - Fixed container */}
                {fileLinkArray.length > 0 && (
                  <div className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden w-full">
                    <div className="p-4 w-full">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Preview ({fileLinkArray.length} image{fileLinkArray.length > 1 ? 's' : ''})
                      </h4>
                      <div className="w-full h-80 overflow-hidden rounded-lg relative bg-gray-100 min-w-0">
                        <div className="absolute inset-0 w-full h-full">
                          <ImageCarousel images={fileLinkArray} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Link Tab */}
            {link && (
              <div className="w-full flex-shrink-0">
                <input
                  name="link"
                  type="url"
                  value={text.link}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            placeholder-gray-500 transition-all duration-200 min-w-0"
                  onChange={handleChange}
                />
                <p className="mt-2 text-sm text-gray-600">
                  Share a link to an article, website, or video
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50/80 to-slate-50/80 border-t border-gray-100 flex justify-between items-center backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {!freez && (
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-green-600 font-semibold">Ready to post!</span>
                  </div>
                )}
                {freez && (
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    <span className="text-amber-600 font-medium">
                      Complete title and content to continue
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Save Draft */}
              <button
                className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white/80 border-2 border-gray-200
                rounded-xl hover:bg-white hover:border-gray-300 hover:shadow-md 
                transition-all duration-300 backdrop-blur-sm"
                type="button"
                onClick={() => handleSubmit(true)}   // pass true for draft
              >
                Save Draft
              </button>

              {/* Publish Post */}
              <button
                className={`px-8 py-3 text-sm font-bold rounded-xl transition-all duration-300 transform
                ${freez
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-inner'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:scale-105 active:scale-95 shadow-lg'
                  }`}
                onClick={() => handleSubmit(false)}   // pass false for draft
                disabled={freez}
              >
                {freez ? 'Complete Form' : 'Publish Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Createpost;