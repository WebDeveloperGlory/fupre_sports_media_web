"use client";

import React from "react";
import { ToastContainer } from "react-toastify";

const ToastProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      { children }
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}


export default ToastProvider