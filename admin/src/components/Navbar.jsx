import { useState } from 'react'
import { Menu } from 'lucide-react'
import logo from '/logo.png'

const Navbar = ({setToken}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  return (
    <div className='sticky top-0 z-50 bg-white shadow-md py-3 px-4 md:px-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
          <p className="font-display text-xl md:text-2xl font-semibold text-primary">
            Revive Wardrobe Admin
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={()=>setToken('')} 
            className='bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-1.5 md:px-6 md:py-2 rounded-md text-sm transition-all hover:shadow-lg'
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar
