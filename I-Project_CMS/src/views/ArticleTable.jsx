import { useEffect, useState } from "react"
import {useNavigate} from 'react-router'
import axios from 'axios'
import baseUrl from "../constant/url"
import { toast } from 'react-toastify';
import Button from '../component/button-reusable.jsx'

export default function ArticleTable() {

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
  
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pages = generatePages();
  const navigate = useNavigate();

  
  function goToEditArticle(id){
    navigate(`/editArticle/${id}`);
  }

  function goToDetailArticle(id){
    navigate(`/articleDetail/${id}`);
  }

  function goToCreateArticle(){
    navigate('/addArticle');
  }

  async function goToDeleteArticle(id){
    if (!window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`${baseUrl}/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Artikel berhasil dihapus!");
      fetchArticles();
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus artikel.");
    }
  }

  async function fetchArticles() {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const {data} = await axios.get(`${baseUrl}/articles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setArticles(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Gagal memuat daftar artikel.");
      setLoading(false);
      
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/");
      }
    }
  }

  function handleSearch(event) {
    event.preventDefault()
    // Filter articles locally based on search
    // API doesn't have search parameter, so we'll filter on frontend
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
    fetchArticles();
  }, []);

  // Filter articles based on search
  const filteredArticles = articles.filter(article => 
    article.title?.toLowerCase().includes(search.toLowerCase()) ||
    article.summary?.toLowerCase().includes(search.toLowerCase()) ||
    article.Period?.name_ofPeriod?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">

      <main className="flex-grow container mx-auto px-4 py-10">

        <form className='max-w-md mx-auto border-2 border-amber-300 rounded-lg shadow-lg mb-8' onSubmit={handleSearch}>
          <div className="relative flex items-center w-full h-12 rounded-lg bg-white overflow-hidden">
            <div className="grid place-items-center h-full w-12 text-amber-600">
              {defaultIcon}
            </div>
            <input
              className='peer h-full w-full outline-none text-sm text-gray-800 pr-2'
              type="text"
              id="search"
              placeholder='Cari artikel...'
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
          </div>
        </form>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-amber-900 mb-2">Artikel</h1>
            <p className="text-amber-700">Kelola artikel sejarah museum</p>
          </div>
          <button
            onClick={goToCreateArticle}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-700 text-white font-bold hover:bg-gray-800 border-2 border-gray-800 transition-all shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Tambah Artikel
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-amber-700">Memuat data...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-200">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-amber-100 to-yellow-100">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-amber-900">ID</th>
                  <th className="px-6 py-4 text-left font-bold text-amber-900">Judul</th>
                  <th className="px-6 py-4 text-left font-bold text-amber-900">Ringkasan</th>
                  <th className="px-6 py-4 text-left font-bold text-amber-900">Periode</th>
                  <th className="px-6 py-4 text-left font-bold text-amber-900">Penulis</th>
                  <th className="px-6 py-4 text-left font-bold text-amber-900">Gambar</th>
                  <th className="px-6 py-4 text-right font-bold text-amber-900 w-64">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-amber-100">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-amber-50 transition-colors">
                      <td className="px-6 py-4 text-amber-900 font-semibold">{article.id}</td>
                      <td className="px-6 py-4 text-amber-900 font-bold max-w-xs">
                        {article.title}
                      </td>
                      <td className="px-6 py-4 text-amber-800 max-w-md">
                        <div className="line-clamp-2">
                          {article.summary || "Tidak ada ringkasan"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-amber-900">
                        <span className="inline-block px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-sm font-semibold">
                          {article.Period?.name_ofPeriod || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-amber-800">
                        {article.User?.fullName || article.User?.email || "Admin"}
                      </td>
                      <td className="px-6 py-4">
                        {article.imageUrl ? (
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-20 h-20 object-cover rounded-lg shadow-md border-2 border-amber-200"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-amber-100 rounded-lg flex items-center justify-center border-2 border-amber-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => goToDetailArticle(article.id)}
                            className="inline-flex items-center gap-1 px-4 py-2 rounded-full border-2 border-blue-400 text-blue-600 text-sm font-semibold hover:bg-blue-500 hover:text-white transition-all"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            Detail
                          </button>
                          <button
                            onClick={() => goToEditArticle(article.id)}
                            className="inline-flex items-center gap-1 px-4 py-2 rounded-full border-2 border-amber-500 text-amber-700 text-sm font-semibold hover:bg-amber-500 hover:text-white transition-all"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => goToDeleteArticle(article.id)}
                            className="inline-flex items-center gap-1 px-4 py-2 rounded-full border-2 border-red-400 text-red-600 text-sm font-semibold hover:bg-red-500 hover:text-white transition-all"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-amber-700">
                      {search ? "Tidak ada artikel yang sesuai dengan pencarian" : "Belum ada artikel"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="mt-auto bg-transparent py-4">
        <p className="text-center text-amber-800 text-sm">© 2025 Museum Soeharto. All rights reserved.</p>
      </footer>
    </div>
  );
}
