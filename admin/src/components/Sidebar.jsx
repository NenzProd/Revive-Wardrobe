import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, ListOrdered, ShoppingBag, ChevronLeft } from 'lucide-react'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Check if screen is mobile and auto-collapse sidebar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    }
    
    // Initial check
    checkMobile()
    
    // Add event listener
    window.addEventListener('resize', checkMobile)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div 
      className={`${isOpen ? 'w-64' : 'w-16'} min-h-screen bg-white shadow-lg transition-all duration-300 fixed left-0 top-0 pt-16 z-10 md:relative`}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute right-0 top-4 bg-gray-100 rounded-full p-1 transform translate-x-1/2 hidden md:block"
      >
        <ChevronLeft className={`h-5 w-5 transition-all ${isOpen ? 'rotate-0' : 'rotate-180'}`} />
      </button>
      
      <div className='flex flex-col gap-2 px-2 py-4'>
        <NavLink 
          className={({isActive}) => 
            `flex items-center justify-center md:justify-start gap-3 px-3 py-3 rounded-lg transition-all ${isActive ? 'bg-gray-100 text-gray-900 font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`
          } 
          to="/"
        >
          <LayoutDashboard className='w-5 h-5' />
          <span className={`hidden md:block ${isOpen ? 'block' : 'hidden'} transition-all whitespace-nowrap`}>Dashboard</span>
        </NavLink>

        <NavLink 
          className={({isActive}) => 
            `flex items-center justify-center md:justify-start gap-3 px-3 py-3 rounded-lg transition-all ${isActive ? 'bg-gray-100 text-gray-900 font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`
          } 
          to="/add"
        >
          <PlusCircle className='w-5 h-5' />
          <span className={`hidden md:block ${isOpen ? 'block' : 'hidden'} transition-all whitespace-nowrap`}>Add Items</span>
        </NavLink>

        <NavLink 
          className={({isActive}) => 
            `flex items-center justify-center md:justify-start gap-3 px-3 py-3 rounded-lg transition-all ${isActive ? 'bg-gray-100 text-gray-900 font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`
          } 
          to="/list"
        >
          <ListOrdered className='w-5 h-5' />
          <span className={`hidden md:block ${isOpen ? 'block' : 'hidden'} transition-all whitespace-nowrap`}>List Items</span>
        </NavLink>

        <NavLink 
          className={({isActive}) => 
            `flex items-center justify-center md:justify-start gap-3 px-3 py-3 rounded-lg transition-all ${isActive ? 'bg-gray-100 text-gray-900 font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`
          } 
          to="/orders"
        >
          <ShoppingBag className='w-5 h-5' />
          <span className={`hidden md:block ${isOpen ? 'block' : 'hidden'} transition-all whitespace-nowrap`}>Orders</span>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
