import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const BlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`https://backend-codershangout.vercel.app/get/blog`, {
            method: "POST",
            body: JSON.stringify({id: id}),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) throw new Error("Failed to fetch blog");
        const data = await response.json();
        setBlog(data.result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-blue-400 text-xl">Loading blog...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-red-400 text-xl">{error}</span>
          </div>
        ) : blog ? (
          <article className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
            {blog.preview_image && (
              <img
                src={blog.preview_image}
                alt={blog.title}
                className="w-full h-64 object-cover rounded mb-6"
              />
            )}
            <h1 className="text-3xl font-bold text-blue-400 mb-4">{blog.title}</h1>
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
            <div className="flex items-center text-gray-400 text-sm mb-6">
              <span>{blog.reading_time} min read</span>
              {blog.patreon && (
                <a
                  href={blog.patreon}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 underline text-blue-400 hover:text-blue-300"
                >
                  Support on Patreon
                </a>
              )}
            </div>
            <p className="text-lg text-gray-200 mb-6">{blog.excerpt}</p>
            <div className="prose prose-invert max-w-none text-gray-100 mb-6">
              {blog.content}
            </div>
            {blog.sources && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-blue-400 mb-2">Sources</h2>
                <ul className="list-disc list-inside text-gray-300">
                  {blog.sources
                    .split("\n")
                    .filter(Boolean)
                    .map((source, idx) => (
                      <li key={idx}>{source}</li>
                    ))}
                </ul>
              </div>
            )}
          </article>
        ) : (
          <div className="text-center text-gray-400">Blog not found.</div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;
