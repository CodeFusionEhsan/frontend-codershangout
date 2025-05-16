import React, { useEffect, useState } from "react";
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [snippets, setSnippets] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingSnippets, setLoadingSnippets] = useState(true);
  const [errorBlogs, setErrorBlogs] = useState(null);
  const [errorSnippets, setErrorSnippets] = useState(null);

  // Modal state for viewing code
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [snippetLoading, setSnippetLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("https://backend-codershangout.vercel.app/get/blogs");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        setBlogs(data.result);
      } catch (err) {
        setErrorBlogs(err.message);
      } finally {
        setLoadingBlogs(false);
      }
    };

    const fetchSnippets = async () => {
      try {
        const res = await fetch("https://backend-codershangout.vercel.app/get/codes");
        if (!res.ok) throw new Error("Failed to fetch snippets");
        const data = await res.json();
        setSnippets(data.result);
      } catch (err) {
        setErrorSnippets(err.message);
      } finally {
        setLoadingSnippets(false);
      }
    };

    fetchBlogs();
    fetchSnippets();
  }, []);

  // Fetch full snippet details (with code) when modal is opened
  const handleViewCode = async (snippetId) => {
    setSnippetLoading(true);
    try {
      const res = await fetch('https://backend-codershangout.vercel.app/get/code', {
        method: "POST",
        body: JSON.stringify({id: snippetId}),
        headers: { "Content-Type": "application/json"}
      });
      if (!res.ok) throw new Error("Failed to fetch snippet");
      const data = await res.json();
      setSelectedSnippet(data.result);
    } catch (err) {
      setSelectedSnippet({ error: "Failed to load snippet." });
    } finally {
      setSnippetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <Navbar />

      {/* Hero Section 1 */}
      <section className="w-full bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 py-16 px-4 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
          Welcome to CodeShare!
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-blue-100 mb-8">
          Share your knowledge, discover insightful blogs, and explore handy code snippets. Join a vibrant community of developers and creators!
        </p>
        <button
          onClick={() => navigate("/add_snippet")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg text-lg transition"
        >
          Get Started
        </button>
      </section>

      {/* Hero Section 2 */}
      <section className="w-full py-12 px-4 flex flex-col md:flex-row items-center justify-center gap-10 bg-gray-800">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold text-blue-400 mb-3">Why CodeShare?</h2>
          <ul className="text-gray-200 text-lg space-y-2">
            <li>🚀 Publish your blogs and code snippets easily</li>
            <li>💬 Get feedback and connect with like-minded creators</li>
            <li>🔍 Discover, search, and learn from the community</li>
          </ul>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=500&q=80"
            alt="Community"
            className="rounded-xl shadow-lg w-72 h-48 object-cover"
          />
        </div>
      </section>

      {/* Hero Section 3 */}
      <section className="w-full py-12 px-4 bg-gradient-to-r from-indigo-900 via-indigo-700 to-indigo-900 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Invite Your Friends!</h2>
        <p className="text-lg text-indigo-100 mb-6">
          CodeShare grows with you. Invite your friends and build a stronger, smarter community together!
        </p>
        <button
          onClick={() => {
            navigator.share
              ? navigator.share({
                  title: "Join me on CodeShare!",
                  text: "Check out this awesome platform for blogs and code snippets.",
                  url: window.location.origin,
                })
              : alert("Copy this link and share: " + window.location.origin);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg text-lg transition"
        >
          Invite Friends
        </button>
      </section>

      {/* Blogs Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-blue-400">Latest Blogs</h3>
          <button
            onClick={() => navigate("/blogs")}
            className="text-blue-300 hover:text-blue-500 font-semibold"
          >
            View All Blogs &rarr;
          </button>
        </div>
        {loadingBlogs ? (
          <div className="text-center text-blue-300">Loading blogs...</div>
        ) : errorBlogs ? (
          <div className="text-center text-red-400">{errorBlogs}</div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-gray-400">No blogs found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {blogs.slice(0, 6).map((blog) => (
              <div
                key={blog.id}
                className="bg-gray-800 rounded-lg shadow-md flex flex-col overflow-hidden hover:shadow-xl transition-shadow"
              >
                {blog.preview_image && (
                  <img
                    src={blog.preview_image}
                    alt={blog.title}
                    className="h-40 w-full object-cover"
                  />
                )}
                <div className="flex flex-col flex-grow p-5">
                  <h4 className="text-xl font-bold text-blue-300 mb-2">{blog.title}</h4>
                  <p className="text-gray-300 mb-3 line-clamp-2">{blog.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags &&
                      blog.tags.split(" ").map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-700 text-white text-xs px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-gray-400 text-sm">
                      {blog.readingTime} min read
                    </span>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition-colors"
                      onClick={() => navigate(`/blogs/${blog._id}`)}
                    >
                      Read
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Code Snippets Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-indigo-400">Latest Code Snippets</h3>
          <button
            onClick={() => navigate("/snippets")}
            className="text-indigo-300 hover:text-indigo-500 font-semibold"
          >
            View All Snippets &rarr;
          </button>
        </div>
        {loadingSnippets ? (
          <div className="text-center text-indigo-300">Loading snippets...</div>
        ) : errorSnippets ? (
          <div className="text-center text-red-400">{errorSnippets}</div>
        ) : snippets.length === 0 ? (
          <div className="text-center text-gray-400">No code snippets found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {snippets.slice(0, 6).map((snippet) => (
              <div
                key={snippet.id}
                className="bg-gray-800 rounded-lg shadow-md flex flex-col overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col flex-grow p-5">
                  <h4 className="text-xl font-bold text-indigo-300 mb-2">{snippet.description}</h4>
                  <p className="text-gray-300 mb-2">
                    <span className="font-semibold">Language:</span> {snippet.language}
                  </p>
                  <p className="text-gray-400 mb-2 text-sm">
                    Uploaded by: {snippet.uploaded_by.user_email}
                  </p>
                  <p className="text-gray-400 mb-4 text-xs">
                    {snippet.uploaded_at}
                  </p>
                  <button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded transition-colors mt-auto"
                    onClick={() => handleViewCode(snippet._id)}
                  >
                    View Code
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal for Viewing Code Snippet */}
      {selectedSnippet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setSelectedSnippet(null)}
              className="absolute top-3 right-4 text-gray-400 hover:text-red-400 text-2xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
            {snippetLoading ? (
              <div className="text-center text-indigo-400">Loading code...</div>
            ) : selectedSnippet.error ? (
              <div className="text-center text-red-400">{selectedSnippet.error}</div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-indigo-300 mb-4">{selectedSnippet.description}</h2>
                <div className="mb-2 text-sm text-gray-400">
                  Language: <span className="font-semibold">{selectedSnippet.language}</span>
                  {" | "}Uploaded by: <span className="font-semibold">{selectedSnippet.uploaded_by.user_email}</span>
                  {" | "}On: {new Date(selectedSnippet.uploaded_at).toLocaleDateString()}
                </div>
                <pre className="bg-gray-800 rounded p-4 overflow-x-auto text-sm text-gray-100 mb-4">
                  <code>{selectedSnippet.code || "No code available."}</code>
                </pre>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default HomePage;
