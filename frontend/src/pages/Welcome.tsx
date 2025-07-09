import { useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import axios from 'axios';

interface User {
  name: string;
  email: string;
}

interface Note {
  _id: string;
  title: string;
  content?: string;
}

const Welcome = () => {
  const [user, setUser] = useState<User>({ name: '', email: '' });
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedName = localStorage.getItem('name') || 'John Doe';
    const storedEmail = localStorage.getItem('email') || 'xxxxxx@xxxx.com';
    setUser({ name: storedName, email: storedEmail });

    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notes', {
        headers: {
          token: token || '',
        },
      });
      setNotes(res.data);
    } catch (err) {
      console.error('Error fetching notes', err);
    }
  };

  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: {
          token: token || '',
        },
      });
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      console.error('Failed to delete note', err);
    }
  };

  const handleCreateNote = async () => {
    if (!title.trim()) return;

    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:5000/api/notes',
        { title, content },
        {
          headers: {
            token: token || '',
            'Content-Type': 'application/json',
          },
        }
      );
      setNotes([res.data, ...notes]);
      setTitle('');
      setContent('');
      setShowModal(false);
    } catch (err) {
      console.error('Error creating note', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-2">
        <div className="text-xl font-bold flex items-center gap-2">
          <img src="/icon.svg" alt="icon" className="w-6 h-6" />
          HD
        </div>
        <div className="text-lg font-semibold">Dashboard</div>
        <button
          onClick={handleSignOut}
          className="text-blue-600 underline px-4 py-2 rounded transition"
        >
          Sign Out
        </button>
      </nav>

      {/* Welcome Box */}
      <div className="max-w-3xl mx-auto mt-10 bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-2xl font-semibold mb-2">Welcome, {user.name}!</h2>
        <p className="text-gray-600">Email: {user.email}</p>
      </div>

      {/* Create Note Button */}
      <div className="max-w-3xl mx-auto mt-6 text-center px-2">
        <button
          className="bg-blue-600 text-white w-full sm:w-auto px-6 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => setShowModal(true)}
        >
          Create Note
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-4 text-gray-600 hover:text-red-500 text-xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">New Note</h2>
            <input
              type="text"
              value={title}
              placeholder="Enter note title"
              className="w-full border border-gray-300 rounded-md p-3 mb-2 focus:outline-none"
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              value={content}
              placeholder="Note content (optional)"
              className="w-full border border-gray-300 rounded-md p-3 mb-2 focus:outline-none"
              rows={4}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              onClick={handleCreateNote}
              className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </div>
      )}

      {/* Notes Heading */}
      <div className="max-w-3xl mx-auto mt-10 px-2">
        <h3 className="text-xl font-semibold mb-4">Notes</h3>
      </div>

      {/* Notes Grid */}
      <div className="max-w-3xl mx-auto px-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {notes.map((note) => (
          <div
            key={note._id}
            className="relative bg-white rounded-lg shadow-md p-4"
          >
            <button
              onClick={() => handleDelete(note._id)}
              className="absolute top-2 right-2 hover:text-red-700"
              title="Delete note"
            >
              <FiTrash2 />
            </button>
            <h3 className="text-lg mb-2">{note.title}</h3>
            {note.content && (
              <p className="text-gray-700 text-sm">{note.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Welcome;
