import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import { useState } from 'react'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react'
import Edit from './pages/Edit'
import Dashboard from './pages/Dashboard'


export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = 'AED '

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'): '');
  
  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      { token === "" ? <Login setToken={setToken} />: 
      <>
      <Navbar setToken={setToken} />
      <div className='flex w-full'>
        <Sidebar />
        <div className='flex-1 px-4 md:px-6 py-8 ml-16 md:ml-0 transition-all duration-300'>
          <Routes>
            <Route path='/' element={<Dashboard token={token} />} />
            <Route path='/add' element={<Add token={token} />} />
            <Route path='/list' element={<List token={token} />} />
            <Route path='/orders' element={<Orders token={token} />} />
            <Route path='/edit/:id' element={<Edit token={token} />} />
          </Routes>
        </div>
      </div>
      </>
      }
      
    </div>
  )
}

export default App
