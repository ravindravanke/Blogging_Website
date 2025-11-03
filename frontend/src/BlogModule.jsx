import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { useRef } from 'react';

const API_URL = `${process.env.REACT_APP_BACKEND_URI}/api/posts`;

function BlogModule() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const fileInputRef = useRef(null);
  const [Image, setImage] = useState(null);

  useEffect(()=>{
    if(!token){
      navigate('/auth')
    }
  },[token, navigate]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
    console.log('Fetched posts:', posts);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('content', content);
      if (Image) {
        formData.append('image', Image);
      }
    const url = editingPostId ? `${API_URL}/${editingPostId}` : API_URL;
    const method = editingPostId ? 'PUT' : 'POST';
    try {
      const response = await fetch(url, {
        method:method,
        body: formData,
      });

      if (response.ok) {
        setTitle('');
        setAuthor('');
        setContent('');
        setEditingPostId(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
        fetchPosts();
        alert(editingPostId ? 'Post updated successfully!' : 'Post created successfully!');
      } else {
        console.error('Failed to submit post');
      }
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`${API_URL}/${postId}`, { method: 'DELETE' });
      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setAuthor(post.author);
    setContent(post.content);
    setEditingPostId(post._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = ()=>{
   localStorage.removeItem('token')
   navigate('/auth')
  }

  return (
    <div className="App-container">
       <h1 style={{textAlign:'center'}}>Blog Module</h1>
      <div className="form-section">
        <h2>{editingPostId ? 'Edit Post' : 'Create a New Post'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Author Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          /><br />
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          /><br />
          <textarea
            placeholder="Post Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea><br />
          <label>Upload Image: </label>
          <input type="file" ref={fileInputRef} onChange={(e)=>setImage(e.target.files[0])} accept='image/png, image/jpg, image/jpeg' /><br />
          <button type="submit">{editingPostId ? 'Update Post' : 'Create Post'}</button>
        </form>
      </div>

      <div className="posts-section">
        <h2>Latest Posts</h2>
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            <div className='post-content'>
            <div>
            <h3>{post.title}</h3>
            <p className="post-author">by {post.author}</p>
            <p>{post.content}</p>
            </div>

            {post?.imageUrl && (
              <img src={`${post.imageUrl}`} alt={post.title} className="post-image" width={'40px'} height={'40px'}/>
            )}
            </div>

            <div className="post-actions">
              <button onClick={() => handleEdit(post)}>Edit</button>
              <button onClick={() => handleDelete(post._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
<button onClick={handleLogout} style={{float:"right", padding:"10px", margin:"10px"}}>logout</button>
    </div>
  );
}

export default BlogModule;
