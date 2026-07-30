import React from "react";
import RegisterForm from "../components/RegisterForm";

function Register() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-[#05050a] p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-200 dark:from-[#0a0a12] dark:via-[#0d0817] dark:to-[#050508]" />

      <div className="absolute -top-32 -left-32 w-[26rem] h-[26rem] bg-fuchsia-400/50 dark:bg-fuchsia-500/60 rounded-full blur-[110px] animate-pulse" />
      <div className="absolute top-1/4 -right-36 w-[30rem] h-[30rem] bg-cyan-400/50 dark:bg-cyan-400/60 rounded-full blur-[130px] animate-pulse [animation-delay:1.2s]" />
      <div className="absolute -bottom-36 left-1/5 w-[24rem] h-[24rem] bg-violet-400/50 dark:bg-violet-500/60 rounded-full blur-[120px] animate-pulse [animation-delay:0.6s]" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald-300/45 dark:bg-emerald-400/50 rounded-full blur-[100px] animate-pulse [animation-delay:2s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20rem] h-[20rem] bg-pink-400/40 dark:bg-pink-500/50 rounded-full blur-[110px]" />
      <div className="absolute top-10 right-1/3 w-56 h-56 bg-yellow-300/40 dark:bg-amber-400/40 rounded-full blur-[90px] animate-pulse [animation-delay:1.8s]" />
      <div className="absolute bottom-1/4 left-10 w-60 h-60 bg-blue-400/40 dark:bg-blue-500/50 rounded-full blur-[100px]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(241,245,249,0.6)_90%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,#05050a_90%)]" />

      <div className="relative z-10">
        <RegisterForm />
      </div>
    </div>
  );
}

export default Register;
