import React from 'react'
import Avtar from './Avtar'
import { BiUpvote } from "react-icons/bi";
import { BiDownvote } from "react-icons/bi";

function CommentCard({ comment }) {
  return (
    <div className="w-full bg-white flex flex-col rounded-xl shadow-sm p-4 mb-3 border border-gray-100">
      <div className="flex items-center gap-3 mb-1">
        <Avtar smallSize="h-[40px] w-[40px]" largeSize="h-[40px] w-[40px]" />
        <span className="font-semibold text-gray-800 text-base">{comment.author.username}</span>
      </div>
      <div className="text-gray-700 text-[15px] font-normal px-2 py-1 mb-2 leading-relaxed break-words whitespace-pre-wrap">
        {comment.content}
      </div>
      <div className="flex items-center gap-4 px-2">
        <button className="flex items-center group">
          <BiUpvote className="text-[18px] text-gray-500 group-hover:text-blue-500 transition-colors mr-1" />
          <span className="text-[15px] font-medium text-gray-700">0</span>
        </button>
        <button className="flex items-center group">
          <BiDownvote className="text-[18px] text-gray-500 group-hover:text-red-500 transition-colors" />
        </button>
      </div>
    </div>
  )
}

export default CommentCard