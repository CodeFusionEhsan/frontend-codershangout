import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useUser } from "@clerk/clerk-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useParams } from "react-router-dom";

const UpdateBlogPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    readingTime: '',
    patreon: '',
    sources: '',
    tags: [],
    file: null,
  });

  const { id } = useParams();

  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  const { isSignedIn, user, isLoaded } = useUser()

  // Handle text and number fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  // Handle tags input
  const handleTagKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput('');
    }
  };

  const handleTagRemove = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user_email = user.emailAddresses[0].emailAddress
    const user_id = user.id
    const user_image = user.imageUrl

    const form_data = new FormData()

    form_data.append("title", formData.title)
    form_data.append("excerpt", formData.excerpt)
    form_data.append("content", formData.content)
    form_data.append("reading_time", formData.readingTime)
    form_data.append("patreon", formData.patreon)
    form_data.append("sources", formData.sources)
    let s= ''
    formData.tags.map((tag) => {s += tag + " "})
    form_data.append("tags", s)
    form_data.append("user_email", user.emailAddresses[0].emailAddress)
    form_data.append("user_id", user.id)
    form_data.append("user_image", user.imageUrl)
    form_data.append("file", formData.file)
    form_data.append("id", id)

    try {
      const response = await fetch('https://backend-codershangout.vercel.app/update/blog', {
        method: 'PUT',
        body: form_data,
      });
      if (!response.ok) throw new Error('Failed to publish blog');
      console.log(response.json)
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        readingTime: '',
        patreon: '',
        sources: '',
        tags: [],
        file: null,
      });
    } catch (err) {
      alert('Failed to publish blog.');
    } finally {
      setLoading(false);
      window.location = "/dashboard"
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <Navbar />
      
      <SignedIn>
      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-center text-blue-400">Update Blog</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Preview Image */}
            <div>
              <label className="block mb-2 font-semibold text-gray-200">Preview Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-gray-200 file:bg-blue-600 file:text-white file:rounded file:px-4 file:py-2 file:border-0 file:mr-4"
                required
              />
              {formData.previewImage && (
                <img
                  src={URL.createObjectURL(formData.previewImage)}
                  alt="Preview"
                  className="mt-4 h-32 object-cover rounded shadow"
                />
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block mb-2 font-semibold text-gray-200">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block mb-2 font-semibold text-gray-200">Excerpt</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                className="w-full rounded bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block mb-2 font-semibold text-gray-200">Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full rounded bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={6}
                required
              />
            </div>

            {/* Reading Time & Patreon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-semibold text-gray-200">Reading Time (minutes)</label>
                <input
                  type="number"
                  name="readingTime"
                  value={formData.readingTime}
                  onChange={handleChange}
                  min={1}
                  className="w-full rounded bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-200">Patreon Link</label>
                <input
                  type="url"
                  name="patreon"
                  value={formData.patreon}
                  onChange={handleChange}
                  placeholder="https://patreon.com/yourpage"
                  className="w-full rounded bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Sources */}
            <div>
              <label className="block mb-2 font-semibold text-gray-200">Sources</label>
              <textarea
                name="sources"
                value={formData.sources}
                onChange={handleChange}
                className="w-full rounded bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="List your sources separated by new lines"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block mb-2 font-semibold text-gray-200">Tags</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag and press Enter"
                className="w-full rounded bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="ml-2 text-gray-200 hover:text-red-400"
                      aria-label={`Remove ${tag}`}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition-colors disabled:bg-gray-500"
            >
              {loading ? 'Publishing...' : 'Publish Blog'}
            </button>
          </form>
        </div>
      </main>
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
    </div>
  );
};

export default UpdateBlogPage;
