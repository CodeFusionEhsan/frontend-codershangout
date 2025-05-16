import React from "react";

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 py-6">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-center md:text-left">
        <span className="font-semibold text-indigo-400">CodersHangout</span> &copy; {new Date().getFullYear()}.
        <span className="ml-1">All rights reserved.</span>
      </div>
      <div className="text-center md:text-right">
        Developed by{" "}
        <a
          href="https://github.com/CodeFusionEhsan"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:underline font-semibold transition"
        >
          Ehsan Saleem
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
