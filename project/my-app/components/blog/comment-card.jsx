"use client";

import Link from "next/link";
import { useState } from "react";
import { HiOutlineArrowUturnLeft, HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

import Avatar from "@/components/ui/avatar";

export default function CommentCard({
  comment,
  childrenComments = [],
  depth = 0,
  onReply
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = async () => {
    if (!replyText.trim()) {
      return;
    }

    await onReply(comment._id, replyText);
    setReplyText("");
    setIsReplying(false);
  };

  return (
    <div className={`${depth > 0 ? "border-l border-slate-200 pl-4 sm:pl-5" : ""}`}>
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <Link href={`/profile/${comment.author?.username || "unknown"}`}>
            <Avatar
              src={comment.author?.avatar}
              alt={comment.author?.username || "Comment author"}
              label={comment.author?.username || "User"}
              size="h-9 w-9"
            />
          </Link>

          <div className="min-w-0 flex-1">
            <Link
              href={`/profile/${comment.author?.username || "unknown"}`}
              className="text-sm font-semibold text-slate-900 hover:text-blue-700"
            >
              {comment.author?.username || "Unknown"}
            </Link>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
              {comment.content}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsReplying((current) => !current)}
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                <HiOutlineChatBubbleLeftRight className="text-sm" />
                Reply
              </button>
            </div>

            {isReplying ? (
              <div className="mt-3 rounded-xl bg-slate-50 p-3">
                <textarea
                  value={replyText}
                  onChange={(event) => setReplyText(event.target.value)}
                  rows={3}
                  placeholder="Write a reply..."
                  className="input-shell min-h-24 resize-none bg-white"
                />
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReplying(false)}
                    className="secondary-button px-4 py-2 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleReplySubmit}
                    className="primary-button px-4 py-2 text-xs"
                  >
                    Reply
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {childrenComments.length ? (
        <div className="mt-3 flex flex-col gap-3">
          {childrenComments.map((child) => (
            <div key={child._id}>
              <div className="mb-3 flex items-center gap-2 pl-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                <HiOutlineArrowUturnLeft className="text-sm" />
                Reply thread
              </div>
              <CommentCard
                comment={child}
                childrenComments={child.children}
                depth={depth + 1}
                onReply={onReply}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
