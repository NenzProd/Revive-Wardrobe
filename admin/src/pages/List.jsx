import { useEffect } from 'react'
import { useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import axios from 'axios'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'


const List = ({token}) => {

    const [list, setList] = useState([])
    const [editStockId, setEditStockId] = useState(null)
    const [editStockValue, setEditStockValue] = useState(0)
    const navigate = useNavigate()

    const fetchList = async () =>{
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.products) {
                setList(response.data.products)   
            }
            else{
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const removeProduct = async (id) => {
        try {
            const response = await axios.post(backendUrl + '/api/product/remove', {id}, {headers:{token}})
            if (response.data.success) {
                toast.success(response.data.message)
                await fetchList();
            }
            else{
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        fetchList()
    }, [])

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>
        {/* ----- list table title ------- */}

        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
            <b>image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Fabric</b>
            <b>Price</b>
            <b>Stock</b>
            <b className='text-center'>Action</b>
        </div>
        {/* -------------product list------------ */}
        {
            list.map((item, index)=>(
                <div className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
                    <img className='w-12' src={item.image[0]} alt='' />
                    <p>{item.name}</p>
                    <p>{item.category}</p>
                    <p>{item.fabric}</p>
                    <p>{currency}{item.price}</p>
                    <div>
                      {editStockId === item._id ? (
                        <form onSubmit={async e => {
                          e.preventDefault()
                          try {
                            const response = await axios.post(backendUrl + '/api/product/edit', {
                              id: item._id,
                              stock: editStockValue
                            }, { headers: { token } })
                            if (response.data.success) {
                              toast.success(response.data.message)
                              setEditStockId(null)
                              await fetchList()
                            } else {
                              toast.error(response.data.message)
                            }
                          } catch (error) {
                            console.log(error)
                            toast.error(error.message)
                          }
                        }} className='flex gap-1'>
                          <input
                            type='number'
                            min='0'
                            value={editStockValue}
                            onChange={e => setEditStockValue(e.target.value)}
                            className='w-16 px-1 py-0.5 border rounded'
                          />
                          <button type='submit' className='text-xs px-2 py-0.5 bg-green-500 text-white rounded'>Save</button>
                          <button type='button' onClick={() => setEditStockId(null)} className='text-xs px-2 py-0.5 bg-gray-300 rounded'>Cancel</button>
                        </form>
                      ) : (
                        <div className='flex items-center gap-2'>
                          <span>{item.stock}</span>
                          <button onClick={() => { setEditStockId(item._id); setEditStockValue(item.stock) }} className='text-xs px-2 py-0.5 bg-blue-500 text-white rounded'>Edit</button>
                        </div>
                      )}
                    </div>
                    <p onClick={()=>removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-lg'>X</p>
                    <div className='flex gap-2'>
                      <button onClick={() => navigate(`/edit/${item._id}`)} className='text-xs px-2 py-0.5 bg-yellow-500 text-white rounded'>Edit</button>
                    </div>
                </div>   
            ))
        }
        
      </div>
    </>
  )
}

List.propTypes = {
  token: PropTypes.string.isRequired
}

export default List
