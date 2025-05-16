import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("https://backend-codershangout.vercel.app/get/blogs");
        if (!response.ok) throw new Error("Failed to fetch blogs");
        const data = await response.json();
        setBlogs(data.result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="flex justify-center mb-10">
          <button
            onClick={() => navigate("/add_blog")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-4 rounded-lg shadow-lg transition-colors"
          >
            ✍️ Write a Blog
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-blue-400 text-xl">Loading blogs...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-red-400 text-xl">{error}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-gray-800 rounded-lg shadow-md flex flex-col overflow-hidden hover:shadow-xl transition-shadow"
              >
                {blog.preview_image && (
                  <img
                    src={blog.preview_image}
                    alt={blog.title}
                    className="h-48 w-full object-cover"
                  />
                )}
                <div className="flex flex-col flex-grow p-6">
                  <h2 className="text-2xl font-bold text-blue-400 mb-2">{blog.title}</h2>
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
                      {blog.reading_time} min read
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
            ))
            }
          </div>
        )}
        {!loading && blogs.length === 0 && !error && (
          <div className="text-center text-gray-400 mt-10">No blogs found.</div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogsPage;
