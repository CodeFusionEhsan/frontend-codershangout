import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const Dashboard = () => {
  const { user } = useUser();
  const [blogs, setBlogs] = useState([]);
  const [snippets, setSnippets] = useState([]);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetch('https://backend-codershangout.vercel.app/get/user/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id })
      })
        .then(res => res.json())
        .then(data => setBlogs(data.result));

      fetch('https://backend-codershangout.vercel.app/get/user/snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id })
      })
        .then(res => res.json())
        .then(data => setSnippets(data.result));
    }
  }, [user]);

  const openModal = (snippet) => {
    setSelectedSnippet(snippet);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSnippet(null);
    setIsModalOpen(false);
  };

  const handleReadBlog = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  async function deletesnippet(id) {
      if (id) {
        const response = await fetch('https://backend-codershangout.vercel.app/snippet/delete', {
          method: "POST",
          body: JSON.stringify({id: id}),
          headers: { "Content-Type": "application/json"}
        })
         const res = await response.json()
  
         if (res.success == true) {
            window.location.reload()
         } else {
          console.log(res.message)
         }
      } else {
        console.log("No ID Received")
      }
    }

     async function deleteblog(id) {
        if (id) {
          const response = await fetch('https://backend-codershangout.vercel.app/blog/delete', {
            method: "POST",
            body: JSON.stringify({id: id}),
            headers: { "Content-Type": "application/json"}
          })
           const res = await response.json()
    
           if (res.success == true) {
              window.location.reload()
           } else {
            console.log(res.message)
           }
        } else {
          console.log("No ID Received")
        }
      }
    

  return (
    <>
    <Navbar />

    <SignedIn>
    <div className="min-h-screen bg-gray-50 text-gray-800 px-2 sm:px-4 md:px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Dashboard</h1>

        {/* User Details Card */}
        {user && (
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">User Profile</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">Name</p>
                <p className="font-semibold break-words">{user.fullName}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">Email</p>
                <p className="font-semibold break-words">{user.emailAddresses[0].emailAddress}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">User ID</p>
                <p className="font-mono text-xs sm:text-sm text-gray-600 break-all">{user.id}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Blogs Section */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Your Blogs</h2>
            {blogs.map(blog => (
              <div
                key={blog._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 mb-4 sm:mb-6 border border-gray-200"
              >
                <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
                  {blog.preview_image && (
                    <img
                      src={blog.preview_image}
                      alt={blog.title}
                      className="w-full sm:w-32 h-40 sm:h-32 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold mb-1">{blog.title}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-3">{blog.excerpt.slice(0, 100) + "..."}</p>
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <button
                        onClick={() => handleReadBlog(blog._id)}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-xs sm:text-sm font-medium flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        Read Blog
                      </button>
                      <button onClick={() => {window.location = `/blog/update/${blog._id}`}} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-xs sm:text-sm font-medium flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6" />
                        </svg>
                        Edit
                      </button>
                      <button onClick={() => {deleteblog(blog._id)}} className="px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-xs sm:text-sm font-medium flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Snippets Section */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Code Snippets</h2>
            {snippets.map(snippet => (
              <div
                key={snippet._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 mb-4 sm:mb-6 border border-gray-200"
              >
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-1">{snippet.description}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-3">{snippet.language}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <button
                      onClick={() => openModal(snippet)}
                      className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition-colors text-xs sm:text-sm font-medium"
                    >
                      View Code
                    </button>
                    <button onClick={() => {window.location = `/snippet/update/${snippet._id}`}} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-xs sm:text-sm font-medium flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6" />
                      </svg>
                      Edit
                    </button>
                    <button onClick={() => {deletesnippet(snippet._id)}} className="px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-xs sm:text-sm font-medium flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Code Modal */}
      {isModalOpen && selectedSnippet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-base sm:text-lg font-semibold">{selectedSnippet.description}</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-xl"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <pre className="p-4 sm:p-6 bg-gray-50 overflow-auto max-h-[60vh] text-xs sm:text-sm font-mono whitespace-pre-wrap">
              {selectedSnippet.code}
            </pre>
          </div>
        </div>
      )}
    </div>
    </SignedIn>
    <SignedOut>
        <section className="bg-gradient-to-br from-blue-50 via-white to-blue-100 py-16 sm:py-24">
    <div className="container mx-auto px-4 flex flex-col items-center text-center">
      <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4">
        Welcome to <span className="text-blue-600">CodersHangout</span>
      </h1>
      <h2 className="text-lg sm:text-2xl font-semibold text-blue-700 mb-2">
        Effortlessly Manage Your Blogs & Code Snippets
      </h2>
      <p className="text-gray-600 max-w-xl mb-8 text-base sm:text-lg">
        Organize your blogs, showcase your code, and boost your productivity with our modern, intuitive dashboard. Join now and start your journey!
      </p>
      <SignInButton
        className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold text-base sm:text-lg shadow-md hover:bg-blue-700 transition-colors"
      />
    </div>
  </section>
    </SignedOut>
    <Footer />
    </>
  );
};

export default Dashboard;
