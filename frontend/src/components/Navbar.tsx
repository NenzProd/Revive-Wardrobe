import { ArrowLeft, Heart, Menu, Search, ShoppingCart, User, Home, Tag, Info, Phone, ChevronDown, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "../stores/useCartStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { itemCount } = useCartStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchActive, setSearchActive] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [promoVisible, setPromoVisible] = useState(true);

  // Navigation Links JSON Structure
  const navigationLinks = {
    main: [
      { name: 'Home', path: '/', icon: 'Home' },

      { name: 'Shop', path: '/shop', icon: null },
      { name: 'Collections', path: null, icon: null, dropdown: true },
      { name: 'Services', path: '/stitching-service', icon: null },
      { name: 'About', path: '/about', icon: 'Info' },
      { name: 'Blog', path: '/blog', icon: null },

      { name: 'Contact', path: '/contact', icon: 'Phone' }
    ],
    collections: [
      { name: 'Ethnic Elegance', path: '/shop' },
      { name: 'Graceful Abayas', path: '/shop' },
      { name: 'Designer Jalabiya', path: '/shop' }
    ],
    actions: [
      { name: 'Search', path: null, icon: 'Search', action: 'search' },
      { name: 'Account', path: '/account', icon: 'User' },
      { name: 'Wishlist', path: '/wishlist', icon: 'Heart' },
      { name: 'Cart', path: '/cart', icon: 'ShoppingCart', badge: true }
    ],
    mobile: {
      bottom: [
        { name: 'Home', path: '/', icon: 'Home' },
        { name: 'Shop', path: '/shop', icon: 'Tag' },
        { name: 'Wishlist', path: '/wishlist', icon: 'Heart' },
        { name: 'Account', path: '/account', icon: 'User' },
        { name: 'Cart', path: '/cart', icon: 'ShoppingCart' }
      ]
    }
  };

  const collections = navigationLinks.collections;

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchInput.trim())}`);
      setSearchActive(false);
      setSearchInput('');
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/shop?category=${category}`);
    setCollectionsOpen(false);
    setMobileMenuOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setCollectionsOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      {/* Luxury Promo Bar */}
      {promoVisible && (
        <div className="bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 text-white py-2 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          <div className="relative z-10">
            <p className="text-sm font-serif tracking-wide animate-fade-in">
              <span className="inline-block animate-bounce-subtle">✨</span>
              <span className="mx-2 font-light">Exclusive Drop</span>
              <span className="mx-2 text-amber-200">·</span>
              <span className="mx-2 font-medium">One Design, One Masterpiece</span>
              <span className="mx-2 text-amber-200">·</span>
              <span className="mx-2 font-light">Limited Edition Sales</span>
              <span className="inline-block animate-bounce-subtle">✨</span>
            </p>
          </div>
          <button
            onClick={() => setPromoVisible(false)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <nav className={`sticky ${promoVisible ? 'top-0' : 'top-0'} left-0 w-full z-40 bg-white/95 backdrop-blur-md shadow-lg border-b border-amber-100`}>
        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between px-4 py-4">
          {searchActive ? (
            <div className="flex items-center w-full gap-3">
              <button
                onClick={() => setSearchActive(false)}
                className="text-amber-700 hover:text-amber-900 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search luxury collections..."
                  className="w-full py-2 px-4 text-sm border border-amber-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent bg-white/90"
                  autoFocus
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-700 hover:text-amber-900 transition-colors"
                >
                  <Search size={18} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger className="text-amber-700 hover:text-amber-900 transition-colors">
                    <Menu size={24} />
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[280px] bg-gradient-to-b from-white to-amber-50/30 border-r border-amber-100"
                  >
                    <div className="flex flex-col h-full">
                      {/* Mobile Menu Header */}
                      <div className="flex items-center justify-between mb-8 pb-6 border-b border-amber-200">
                        <div className="flex items-center gap-3">
                          <img
                            src="/logo_pc.png"
                            alt="REVIVE WARDROBE"
                            className="h-10"
                          />

                        </div>
                      </div>

                      {/* Mobile Nav Links */}
                      <div className="flex-1 space-y-2">
                        {/* Main Navigation Links */}
                        {navigationLinks.main.filter(link => !link.dropdown).map((link) => (
                          <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-3 px-4 text-gray-800 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-all duration-300 font-medium"
                          >
                            {link.name}
                          </Link>
                        ))}

                        {/* Mobile Collections */}
                        <div className="space-y-1">
                          <div className="py-3 px-4 text-gray-800 font-medium border-b border-amber-100">
                            Collections
                          </div>
                          {navigationLinks.collections.map((collection) => (
                            <Link
                              key={collection.path}
                              to={collection.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block py-2 px-8 text-gray-700 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-all duration-300"
                            >
                              {collection.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                <Link to="/" className="flex items-center gap-2">
                  <img src="/logo_pc.png" alt="REVIVE WARDROBE" className="h-8" />

                </Link>
              </div>

              <div className="flex items-center gap-3">
                {navigationLinks.actions.filter(action => ['Search', 'Account', 'Wishlist', 'Cart'].includes(action.name)).map((action) => {
                  if (action.name === 'Search') {
                    return (
                      <button
                        key={action.name}
                        onClick={() => setSearchActive(true)}
                        className="text-amber-700 hover:text-amber-900 transition-colors p-2 hover:bg-amber-50 rounded-full"
                      >
                        <Search size={20} />
                      </button>
                    );
                  }

                  if (action.name === 'Cart') {
                    return (
                      <Link
                        key={action.name}
                        to={action.path}
                        className="text-amber-700 hover:text-amber-900 transition-colors relative p-2 hover:bg-amber-50 rounded-full"
                      >
                        <ShoppingCart size={20} />
                        {itemCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg">
                            {itemCount}
                          </span>
                        )}
                      </Link>
                    );
                  }

                  // Default action buttons
                  const IconComponent = action.icon === 'User' ? User : Heart;
                  return (
                    <Link
                      key={action.name}
                      to={action.path}
                      className="text-amber-700 hover:text-amber-900 transition-colors p-2 hover:bg-amber-50 rounded-full"
                    >
                      <IconComponent size={20} />
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex container mx-auto px-6 py-4 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo_pc.png" alt="REVIVE WARDROBE" className="h-12 transition-transform group-hover:scale-105" />
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            {navigationLinks.main.map((link) => {
              if (link.dropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setCollectionsOpen(!collectionsOpen)}
                      className="flex items-center gap-1 py-2 text-gray-800 hover:text-amber-800 transition-all duration-300 font-medium group"
                    >
                      {link.name}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${collectionsOpen ? 'rotate-180' : ''}`}
                      />
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-amber-800 group-hover:w-full transition-all duration-300"></span>
                    </button>

                    {collectionsOpen && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-amber-100 overflow-hidden z-50">
                        <div className="p-2">
                          {collections.map((collection, index) => (
                            <Link
                              key={collection.path}
                              to={collection.path}
                              onClick={() => setCollectionsOpen(false)}
                              className={`block px-4 py-3 text-gray-800 hover:text-amber-800 hover:bg-gradient-to-r hover:from-amber-50 hover:to-amber-100 rounded-lg transition-all duration-300 font-medium group ${index !== collections.length - 1 ? 'border-b border-amber-100/50' : ''
                                }`}
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <span className="block group-hover:translate-x-1 transition-transform duration-300">
                                {collection.name}
                              </span>
                              <span className="block text-xs text-amber-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Explore Collection →
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="relative py-2 text-gray-800 hover:text-amber-800 transition-all duration-300 font-medium group"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-amber-800 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                );
              }
            })}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative group">
              <input
                type="text"
                placeholder="Search luxury collections..."
                className="w-48 lg:w-64 px-4 py-2 text-sm border border-amber-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all duration-300 focus:w-72"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-700 hover:text-amber-900 transition-colors p-1 hover:bg-amber-100 rounded-full"
              >
                <Search size={16} />
              </button>
            </div>

            {/* Action Buttons */}
            {navigationLinks.actions.map((action) => {
              if (action.name === 'Search') return null; // Search is handled separately above

              const IconComponent = action.name === 'Account' ? User :
                action.name === 'Wishlist' ? Heart :
                  action.name === 'Cart' ? ShoppingCart : User;

              if (action.name === 'Cart') {
                return (
                  <Link
                    key={action.path}
                    to={action.path}
                    className="text-amber-700 hover:text-amber-900 transition-colors relative p-2 hover:bg-amber-50 rounded-full"
                  >
                    <IconComponent size={20} />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg animate-pulse">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                );
              }

              return (
                <Link
                  key={action.path}
                  to={action.path}
                  className="text-amber-700 hover:text-amber-900 transition-colors p-2 hover:bg-amber-50 rounded-full"
                >
                  <IconComponent size={20} />
                </Link>
              );
            })}

            {/* Phone Link */}
            <a
              href="tel:+971521919358"
              className="text-amber-700 hover:text-amber-900 transition-colors p-2 hover:bg-amber-50 rounded-full"
            >
              <Phone size={20} />
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Tab Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-amber-100 z-40">
        <div className="flex justify-around py-2">
          {navigationLinks.mobile.bottom.map((item) => {
            const IconComponent = item.name === 'Home' ? Home :
              item.name === 'Shop' ? Tag :
                item.name === 'Wishlist' ? Heart :
                  item.name === 'About' ? Info :
                    item.name === 'Account' ? User :
                      item.name === 'Cart' ? ShoppingCart : Home;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-2 transition-colors ${location.pathname === item.path ? "text-amber-800" : "text-amber-600"
                  }`}
              >
                <IconComponent size={20} />
                <span className="text-xs mt-1 font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navbar;
