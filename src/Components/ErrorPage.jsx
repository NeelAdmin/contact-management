import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <h2 className="text-2xl font-semibold mt-2">Page not found</h2>
      <p className="text-sm text-gray-600 mt-2">
        Oops! The page you are looking for does not exist. It might have been
        moved or deleted.
      </p>
      <button
        onClick={handleRedirect}
        className="mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
      >
        Go to Sign In
      </button>
    </div>
  );
};

export default ErrorPage;
