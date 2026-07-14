import React from "react";
import RegisterForm from "../components/RegisterForm";

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-300 bg-white p-6 shadow-sm">
        <RegisterForm />
      </div>
    </div>
  );
}

export default Register;
