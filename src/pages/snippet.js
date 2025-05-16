import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const SnippetsPage = () => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSnippet, setSelectedSnippet] = useState(null);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await fetch('https://backend-codershangout.vercel.app/get/codes');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setSnippets(data.result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );

  return (
    <>
    <Navbar />
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Code Snippets</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {snippets.map((snippet) => (
          <div
            key={snippet.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">{snippet.description}</h2>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Language:</span> {snippet.language}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Uploaded by:</span> {snippet.uploaded_by.user_email}
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-semibold">Uploaded at:</span>{' '}
                {snippet.uploaded_at}
              </p>
            </div>
            <button
              className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              onClick={() => setSelectedSnippet(snippet)}
            >
              View Code
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedSnippet && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              onClick={() => setSelectedSnippet(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">{selectedSnippet.description}</h2>
            <pre className="bg-gray-100 rounded p-4 overflow-x-auto text-sm mb-4">
              <code>{selectedSnippet.code || 'No code available.'}</code>
            </pre>
            <div className="text-gray-600 text-sm">
              <span className="font-semibold">Language:</span> {selectedSnippet.language}
              <br />
              <span className="font-semibold">Uploaded by:</span> {selectedSnippet.uploaded_by.user_email}
              <br />
              <span className="font-semibold">Uploaded at:</span>{' '}
              {selectedSnippet.uploaded_at}
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer />
    </>
  );
};

export default SnippetsPage;
