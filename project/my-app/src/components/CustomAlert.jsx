import React from "react";

function CustomAlert({ message, type = "info", onClose }) {
  // type: "info" | "success" | "error" | "warning"
  const typeStyles = {
    info: "bg-blue-50 border-blue-400 text-blue-800",
    success: "bg-green-50 border-green-400 text-green-800",
    error: "bg-red-50 border-red-400 text-red-800",
    warning: "bg-yellow-50 border-yellow-400 text-yellow-800",
  };

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 min-w-[250px] max-w-[90vw] px-5 py-3 rounded-xl border shadow-lg flex items-center gap-3 transition-all duration-300 ${typeStyles[type]}`}
      role="alert"
    >
      <span className="flex-1 font-medium text-base">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-lg font-bold px-2 rounded hover:bg-gray-200/60 transition"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}

export default CustomAlert;