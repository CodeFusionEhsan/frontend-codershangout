import logo from './logo.svg';
import './App.css';
import Navbar from './components/navbar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/home';
import AddSnippet from './pages/addSnippet';
import { ClerkProvider } from '@clerk/clerk-react'
import SnippetsPage from './pages/snippet';
import PublishBlogPage from './pages/addBlog'
import BlogsPage from './pages/blogs';
import BlogPage from './pages/blog';
import Dashboard from './pages/dashboard';
import UpdateBlogPage from './pages/update_blog';
import UpdateSnippet from './pages/update_snippet';

function App() {
  return (
     <ClerkProvider publishableKey={process.env.CLERK_KEY} afterSignOutUrl='/'>
      <BrowserRouter>
        <Routes>
          <Route>
            <Route index element={<Home />} />
            <Route path="add_snippet" element={<AddSnippet />} />
            <Route path="snippets" element={<SnippetsPage />} />
            <Route path="add_blog" element={<PublishBlogPage />} />
            <Route path="blogs" element={<BlogsPage />} />
            <Route path="blogs/:id" element={<BlogPage />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="/blog/update/:id" element={<UpdateBlogPage />} />
            <Route path="/snippet/update/:id" element={<UpdateSnippet />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
