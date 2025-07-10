import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, ListOrdered, ShoppingBag, ChevronLeft, BookText, Menu } from 'lucide-react'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true)

  // Responsive sidebar open/close
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      {/* Hamburger for mobile and desktop */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-20 bg-gray-100 rounded-full p-2 md:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>
      <div
        className={`${isOpen ? 'w-64' : 'w-16'} min-h-screen bg-white shadow-lg transition-all duration-300 fixed left-0 top-0 pt-16 z-10 md:relative flex flex-col`}
        style={{ width: isOpen ? '16rem' : '4rem' }}
      >
        {/* Hamburger for desktop (hidden on mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-0 top-4 bg-gray-100 rounded-full p-2 hidden md:block"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className='flex flex-col gap-2 px-2 py-4 flex-1'>
          <NavLink
            className={({isActive}) =>
              `flex items-center justify-center md:justify-start gap-3 px-3 py-3 rounded-lg transition-all ${isActive ? 'bg-gray-100 text-gray-900 font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`
            }
            to="/"
          >
            <LayoutDashboard className='w-5 h-5' />
            {isOpen && <span className="transition-all whitespace-nowrap">Dashboard</span>}
          </NavLink>
          <NavLink
            className={({isActive}) =>
              `flex items-center justify-center md:justify-start gap-3 px-3 py-3 rounded-lg transition-all ${isActive ? 'bg-gray-100 text-gray-900 font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`
            }
            to="/add"
          >
            <PlusCircle className='w-5 h-5' />
            {isOpen && <span className="transition-all whitespace-nowrap">Add Items</span>}
          </NavLink>
          <NavLink
            className={({isActive}) =>
              `flex items-center justify-center md:justify-start gap-3 px-3 py-3 rounded-lg transition-all ${isActive ? 'bg-gray-100 text-gray-900 font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`
            }
            to="/list"
          >
            <ListOrdered className='w-5 h-5' />
            {isOpen && <span className="transition-all whitespace-nowrap">List Items</span>}
          </NavLink>
          <NavLink
            className={({isActive}) =>
              `flex items-center justify-center md:justify-start gap-3 px-3 py-3 rounded-lg transition-all ${isActive ? 'bg-gray-100 text-gray-900 font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`
            }
            to="/orders"
          >
            <ShoppingBag className='w-5 h-5' />
            {isOpen && <span className="transition-all whitespace-nowrap">Orders</span>}
          </NavLink>
          <NavLink
            className={({isActive}) =>
              `flex items-center justify-center md:justify-start gap-3 px-3 py-3 rounded-lg transition-all ${isActive ? 'bg-gray-100 text-gray-900 font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`
            }
            to="/blog"
          >
            <BookText className='w-5 h-5' />
            {isOpen && <span className="transition-all whitespace-nowrap">Blog</span>}
          </NavLink>
        </div>
        {/* TenSketch branding at the bottom */}
        <div className="px-2 pb-4 mt-auto">
          <a
            href="https://tensketch.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 text-xs text-gray-400 hover:text-primary transition-all ${isOpen ? 'justify-start' : 'justify-center'}`}
            style={{ minHeight: '2rem' }}
          >
            <span className="font-semibold">{isOpen ? 'Product of ' : ''}</span>
            <span className="underline">TenSketch</span>
          </a>
        </div>
      </div>
    </>
  )
}

export default Sidebar
