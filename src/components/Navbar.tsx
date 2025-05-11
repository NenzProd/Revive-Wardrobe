
import { useState, useEffect } from "react";
import { Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount } = useCartStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 shadow-md backdrop-blur-sm py-3 opacity-100 translate-y-0"
            : "bg-transparent py-5 opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center">
          {/* Logo and Mobile Menu */}
          <div className="flex w-full md:w-auto justify-between items-center mb-4 md:mb-0">
            <a href="/" className="flex items-center">
              <img src="/logo.png" alt="REVIVE WARDROBE" className="h-12" />
              <span className="ml-2 text-lg font-serif text-revive-black">
                REVIVE WARDROBE
              </span>
            </a>

            {/* Mobile Menu Button - Visible only on mobile */}
            <Sheet>
              <SheetTrigger className="md:hidden text-revive-gold hover:text-revive-red transition-colors">
                <Menu size={24} />
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
                        <a
                          href="/"
                          className="block py-2 text-revive-black hover:text-revive-red transition-colors font-medium"
                        >
                          Home
                        </a>
                      </li>
                      <li>
                        <a
                          href="/shop"
                          className="block py-2 text-revive-black hover:text-revive-red transition-colors font-medium"
                        >
                          Shop
                        </a>
                      </li>

                      <li>
                        <a
                          href="/blog"
                          className="block py-2 text-revive-black hover:text-revive-red transition-colors font-medium"
                        >
                          Blog
                        </a>
                      </li>
                      <li>
                        <a
                          href="/contact"
                          className="block py-2 text-revive-black hover:text-revive-red transition-colors font-medium"
                        >
                          Contact
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Mobile Icons */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex space-x-6 justify-start">
                      <button
                        aria-label="Search"
                        className="text-revive-gold hover:text-revive-red transition-colors"
                      >
                        <Search size={20} />
                      </button>
                      <button
                        aria-label="Profile"
                        className="text-revive-gold hover:text-revive-red transition-colors"
                      >
                        <User size={20} />
                      </button>
                      <button
                        aria-label="Wishlist"
                        className="text-revive-gold hover:text-revive-red transition-colors"
                      >
                        <Heart size={20} />
                      </button>
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
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Nav Links - Center - Hidden on mobile */}
          <div className="flex-grow flex justify-center md:mx-10 hidden md:flex">
            <ul className="flex flex-wrap justify-center space-x-1 md:space-x-8">
              <li>
                <a
                  href="/"
                  className="px-2 py-2 text-revive-black hover:text-revive-red transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  className="px-2 py-2 text-revive-black hover:text-revive-red transition-colors"
                >
                  Shop
                </a>
              </li>

              <li>
                <a
                  href="/blog"
                  className="px-2 py-2 text-revive-black hover:text-revive-red transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="px-2 py-2 text-revive-black hover:text-revive-red transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Icons - Right - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              aria-label="Search"
              className="text-revive-gold hover:text-revive-red transition-colors"
            >
              <Search size={20} />
            </button>
            <button
              aria-label="Profile"
              className="text-revive-gold hover:text-revive-red transition-colors"
            >
              <User size={20} />
            </button>
            <button
              aria-label="Wishlist"
              className="text-revive-gold hover:text-revive-red transition-colors"
            >
              <Heart size={20} />
            </button>
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
    </>
  );
};

export default Navbar;
