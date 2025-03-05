import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiSearch, FiUser } from 'react-icons/fi';
import SearchBar from './SearchBar';
import ProfileDropdown from './ProfileDropdown';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/blog" className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-green-600">Wellness Blog</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <SearchBar />
            <Link to="/blog/create" className="text-gray-600 hover:text-green-600">
              Create Post
            </Link>
            <ProfileDropdown />
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <SearchBar />
              <Link
                to="/blog/create"
                className="block px-3 py-2 text-gray-600 hover:text-green-600"
              >
                Create Post
              </Link>
              <Link
                to="/blog/profile"
                className="block px-3 py-2 text-gray-600 hover:text-green-600"
              >
                Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;