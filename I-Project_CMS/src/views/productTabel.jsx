import { useEffect, useState } from "react"
import {useNavigate} from 'react-router'

import axios from 'axios'
import baseUrl from "../constant/url"
import { toast } from 'react-toastify';



export default function ProductList() {

  const defaultIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  )
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const pages = generatePages();
  const navigate = useNavigate();

  
function goToEditProduct(id){
  navigate(`/editProduct/${id}`);
}

function goToCreateProduct(){
  navigate('/addProduct');
}

async function goToDeleteProduct(id){
  try {

    const token = localStorage.getItem("access_token");
    await axios.delete(`${baseUrl}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Product deleted successfully!");
    fetchProducts(); // Refresh the product list
  } catch (error) {
    console.error("Error deleting product:", error);
    toast.error(error.response?.data?.message || "Failed to delete product.");
  }
}

  async function fetchProducts() {
  try {
    const token = localStorage.getItem("access_token");
    const {data} = await axios.get(`${baseUrl}/products?search=${search}&pages=${currentPage}&limits=10`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = data.data;

    setProducts(result.data);
    setCurrentPage(result.currentPage);
    setTotalPage(result.totalPage);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load product list.");
    }
  }

  function handleSearch(event) {
    event.preventDefault()
    if (currentPage === 1) {
      fetchProducts()
    } else {
      setCurrentPage(1)
    }
  }

    function generatePages() {
        const array = []
        for (let i = 1; i <= totalPage; i++) {
            array.push(i)
        }

        return array
    }

  function handlePage(page){
    setCurrentPage(page)
  }

  function handlePrevious(){
    if(currentPage > 1){
      setCurrentPage(currentPage - 1)
    }
  }

  function handleNext(){
    if(currentPage < totalPage){
      setCurrentPage(currentPage + 1)
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  // useEffect(() => {
  // console.log(products);
  // })


    

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f8f8]">

      <main className="flex-grow container mx-auto px-4 py-10">


      <form className='max-w-md mx-auto border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]' onSubmit={handleSearch}>
        <div className="relative flex items-center w-full h-12 rounded-lg bg-white overflow-hidden">
          <div className="grid place-items-center h-full w-12 text-gray-300">
            {defaultIcon}
          </div>
          <input
            className= 'peer h-full w-full outline-none text-sm text-gray-800 pr-2'
            type="text"
            id= "search"
            placeholder= 'search products...'
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </form>


        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-[#232f24]">Products</h1>
          <a
            onClick={goToCreateProduct}
            className="inline-block px-5 py-3 rounded-full border border-[#232f24] text-[#232f24] font-semibold hover:bg-[#232f24] hover:text-white transition"
          >
            + Create New Product
          </a>
        </div>


        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-black">ID</th>
                <th className="px-6 py-4 text-left font-bold text-black">Name</th>
                <th className="px-6 py-4 text-left font-bold text-black">Price</th>
                <th className="px-6 py-4 text-left font-bold text-black">Stock</th>
                <th className="px-6 py-4 text-left font-bold text-black">Category</th>
                <th className="px-6 py-4 text-left font-bold text-black">Image</th>
                <th className="px-6 py-4 text-right font-bold text-black w-48">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-[#232f24]">{p.id}</td>
                  <td className="px-6 py-4 text-[#232f24] font-semibold">{p.name}</td>
                  <td className="px-6 py-4 text-[#232f24]">
                    Rp {p.price?.toLocaleString('id-ID') || '0'}
                  </td>
                  <td className="px-6 py-4 text-[#232f24]">{p.stock}</td>
                  <td className="px-6 py-4 text-[#232f24]">{p.Category?.name}</td>
                  <div className="md:w-1/2 flex justify-center items-center">
                    <img
                      src={p.imageUrl}
                      alt="Jeep Wrangler"
                      className="rounded-2xl shadow-lg w-full max-w-md"
                    />
                  </div>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">

                      <a
                        onClick={() => goToEditProduct(p.id)}
                        className="inline-block px-3 py-2 rounded-full border border-[#232f24] text-[#232f24] text-sm font-semibold hover:bg-[#232f24] hover:text-white transition"
                      >
                        Edit
                      </a>
                      <button
                        type="button"
                        onClick={() => goToDeleteProduct(p.id)}
                        className="inline-block px-3 py-2 rounded-full border border-gray-400 text-gray-700 text-sm font-semibold hover:bg-gray-800 hover:text-white transition"
                      >
                        Delete
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <div className="flex justify-center mb-10">


            <nav className="flex items-center justify-center gap-x-1">
                <button
                    type="button"
                    className="min-h-[38px] min-w-[38px] flex justify-center items-center rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-purple-400 hover:border-2 hover:border-black hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] py-2 px-3 text-sm disabled:bg-purple-400"
                    onClick={handlePrevious}
                    disabled={currentPage <= 1 ? true : false}
                >
                    <svg
                        className="shrink-0 size-3.5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="{2}"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    <span>Prev</span>
                </button>

                <div className="flex items-center gap-x-1">
                    {pages.map((page) => {
                        return (
                            <div key={page}>
                                <button
                                    type="button"
                                    className={page === currentPage ? "min-h-[38px] min-w-[38px] flex justify-center items-center bg-purple-400 py-2 px-3 text-sm border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]" : "min-h-[38px] min-w-[38px] flex justify-center items-center rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-purple-400 hover:border-2 hover:border-black hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] py-2 px-3 text-sm"}
                                    onClick={() => handlePage(page)}
                                >
                                    {page}
                                </button>
                            </div>
                        )
                    })}
                </div>

                <button
                    type="button"
                    className="min-h-[38px] min-w-[38px] flex justify-center items-center rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-purple-400 hover:border-2 hover:border-black hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] py-2 px-3 text-sm disabled:bg-purple-400"
                    onClick={handleNext}
                    disabled={currentPage >= totalPage ? true : false}
                >
                    <span>Next</span>
                    <svg
                        className="shrink-0 size-3.5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="{2}"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </button>
            </nav>
</div>

    </div>
  );
}
