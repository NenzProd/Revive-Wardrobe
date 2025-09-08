import { ArrowLeft, Heart, Menu, Search, ShoppingCart, User, Home, Tag, Info, Phone } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "../stores/useCartStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const { itemCount } = useCartStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchActive, setSearchActive] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchInput.trim())}`)
      setSearchActive(false)
      setSearchInput('')
    }
  }

  const handleSearchKeyDown = e => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 shadow-sm backdrop-blur-sm">
        {/* Mobile top navigation */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b">
          {searchActive ? (
            <div className="flex items-center w-full gap-2">
              <button 
                onClick={() => setSearchActive(false)} 
                className="text-revive-gold"
              >
                <ArrowLeft size={20} />
              </button>
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 py-1 px-2 text-sm focus:outline-none"
                autoFocus
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <button
                aria-label="Go"
                className="text-revive-gold hover:text-revive-red transition-colors font-bold px-2"
                onClick={handleSearch}
              >
                <Search size={20} />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Sheet>
                  <SheetTrigger className="text-revive-gold">
                    <Menu size={20} />
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[250px] sm:w-[300px] bg-white"
                  >
                    <div className="flex flex-col h-full">
                      {/* Mobile Menu Header */}
                      <div className="flex items-center justify-between mb-6 border-b pb-4">
                        <div className="flex items-center">
                          <img
                            src="/logo.png"
                            alt="REVIVE WARDROBE"
                            className="h-10"
                          />
                          <span className="ml-2 text-lg font-serif text-revive-black">
                            REVIVE WARDROBE
                          </span>
                        </div>
                      </div>

                      {/* Mobile Nav Links */}
                      <div className="flex-1">
                        <ul className="space-y-4">
                          <li>
                            <Link
                              to="/"
                              className="block py-2 text-revive-black hover:text-revive-red transition-colors font-medium"
                            >
                              Home
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/shop"
                              className="block py-2 text-revive-black hover:text-revive-red transition-colors font-medium"
                            >
                              Shop
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/stitching-service"
                              className="block py-2 text-revive-black hover:text-revive-red transition-colors font-medium"
                            >
                              Services
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/account"
                              className="block py-2 text-revive-black hover:text-revive-red transition-colors font-medium"
                            >
                              Account
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/blog"
                              className="block py-2 text-revive-black hover:text-revive-red transition-colors font-medium"
                            >
                              Blog
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/about"
                              className="block py-2 text-revive-black hover:text-revive-red transition-colors font-medium"
                            >
                              About Us
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/contact"
                              className="block py-2 text-revive-black hover:text-revive-red transition-colors font-medium"
                            >
                              Contact
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                
                <Link to="/" className="flex items-center">
                  <img src="/logo.png" alt="REVIVE WARDROBE" className="h-8" />
                </Link>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  aria-label="Search"
                  className="text-revive-gold hover:text-revive-red transition-colors"
                  onClick={() => setSearchActive(true)}
                >
                  <Search size={20} />
                </button>
                <Link
                  to="/account"
                  aria-label="Profile"
                  className="text-revive-gold hover:text-revive-red transition-colors"
                >
                  <User size={20} />
                </Link>
                <a
                  href="tel:+1234567890"
                  aria-label="Call"
                  className="text-revive-gold hover:text-revive-red transition-colors"
                >
                  <Phone size={20} />
                </a>
                <Link
                  to="/wishlist"
                  aria-label="Wishlist"
                  className="text-revive-gold hover:text-revive-red transition-colors"
                >
                  <Heart size={20} />
                </Link>
                <Link
                  to="/cart"
                  aria-label="Cart"
                  className="text-revive-gold hover:text-revive-red transition-colors relative"
                >
                  <ShoppingCart size={20} />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-revive-red text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Desktop navbar - keep original */}
        <div className="hidden md:flex container mx-auto px-4 py-4 flex-col md:flex-row items-center">
          {/* Logo */}
          <div className="flex w-full md:w-auto justify-between items-center mb-4 md:mb-0">
            <a href="/" className="flex items-center">
              <img src="/logo.png" alt="REVIVE WARDROBE" className="h-12" />
              <span className="ml-2 text-lg font-serif text-revive-black">
                REVIVE WARDROBE
              </span>
            </a>
          </div>

          {/* Nav Links - Center */}
          <div className="flex-grow flex justify-center md:mx-10">
            <ul className="flex flex-wrap justify-center space-x-1 md:space-x-8">
              <li>
                <Link
                  to="/"
                  className="px-2 py-2 text-revive-black hover:text-revive-red transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="px-2 py-2 text-revive-black hover:text-revive-red transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/stitching-service"
                  className="px-2 py-2 text-revive-black hover:text-revive-red transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="px-2 py-2 text-revive-black hover:text-revive-red transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="px-2 py-2 text-revive-black hover:text-revive-red transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="px-2 py-2 text-revive-black hover:text-revive-red transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Icons - Right */}
          <div className="flex items-center space-x-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none w-40 md:w-56"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <button
              aria-label="Go"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-revive-gold hover:text-revive-red"
              onClick={handleSearch}
            >
              <Search size={18} />
            </button>
          </div>
            <Link
              to="/account"
              aria-label="Profile"
              className="text-revive-gold hover:text-revive-red transition-colors"
            >
              <User size={20} />
            </Link>
            <a
              href="tel:+971521919358"
              aria-label="Call"
              className="text-revive-gold hover:text-revive-red transition-colors"
            >
              <Phone size={20} />
            </a>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="text-revive-gold hover:text-revive-red transition-colors"
            >
              <Heart size={20} />
            </Link>
            <Link
              to="/cart"
              aria-label="Cart"
              className="text-revive-gold hover:text-revive-red transition-colors relative"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-revive-red text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {itemCount}
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Tab Navigation - visible only on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t z-50">
        <div className="flex justify-around py-2">
          <Link
            to="/"
            className={`flex flex-col items-center p-2 ${
              location.pathname === "/" ? "text-revive-red" : "text-revive-gold"
            }`}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            to="/shop"
            className={`flex flex-col items-center p-2 ${
              location.pathname === "/shop" ? "text-revive-red" : "text-revive-gold"
            }`}
          >
            <Tag size={20} />
            <span className="text-xs mt-1">Shop</span>
          </Link>
          <Link
            to="/wishlist"
            className={`flex flex-col items-center p-2 ${
              location.pathname === "/wishlist" ? "text-revive-red" : "text-revive-gold"
            }`}
          >
            <Heart size={20} />
            <span className="text-xs mt-1">Wishlist</span>
          </Link>
          <Link
            to="/about"
            className={`flex flex-col items-center p-2 ${
              location.pathname === "/about" ? "text-revive-red" : "text-revive-gold"
            }`}
          >
            <Info size={20} />
            <span className="text-xs mt-1">About</span>
          </Link>
          <Link
            to="/account"
            className={`flex flex-col items-center p-2 ${
              location.pathname === "/account" ? "text-revive-red" : "text-revive-gold"
            }`}
          >
            <User size={20} />
            <span className="text-xs mt-1">Account</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
