import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import axios from 'axios'
import baseUrl from "../constant/url"
import { toast } from 'react-toastify';
import Button from '../component/button-reusable.jsx'

export default function EditArticle() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [summary, setSummary] = useState("")
  const [periodId, setPeriodId] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [currentImageUrl, setCurrentImageUrl] = useState("")
  const [periods, setPeriods] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    fetchPeriods()
    fetchArticle()
  }, [id])

  async function fetchPeriods() {
    try {
      const { data } = await axios.get(`${baseUrl}/pub/periods`)
      setPeriods(data)
    } catch (error) {
      console.error("Error fetching periods:", error)
      toast.error("Gagal memuat daftar periode.")
    }
  }

  async function fetchArticle() {
    try {
      const token = localStorage.getItem("access_token")
      const { data } = await axios.get(`${baseUrl}/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setTitle(data.title)
      setContent(data.content)
      setSummary(data.summary || "")
      setPeriodId(data.PeriodId.toString())
      setCurrentImageUrl(data.imageUrl || "")
      setFetching(false)
    } catch (error) {
      console.error("Error fetching article:", error)
      toast.error("Gagal memuat data artikel.")
      setFetching(false)
      navigate("/articles")
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!title.trim() || !content.trim() || !periodId) {
      toast.error("Judul, konten, dan periode wajib diisi!")
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem("access_token")

      console.log("Updating article:", id)
      console.log("Sending data:", {
        title,
        content,
        summary,
        PeriodId: parseInt(periodId)
      })

      // Update article first
      try {
        await axios.put(
          `${baseUrl}/articles/${id}`,
          {
            title,
            content,
            summary: summary || "",
            PeriodId: parseInt(periodId)
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        console.log("✅ Article updated successfully")
      } catch (updateError) {
        console.error("❌ Error updating article:", updateError)
        console.error("Response:", updateError.response?.data)
        throw updateError
      }

      // Upload new image if provided
      if (imageFile) {
        try {
          console.log("📤 Uploading new image for article:", id)
          const formData = new FormData()
          formData.append("file", imageFile)

          const uploadResponse = await axios.patch(
            `${baseUrl}/articles/upload/${id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          )
          console.log("✅ Image uploaded successfully:", uploadResponse.data)
        } catch (uploadError) {
          console.error("❌ Error uploading image:", uploadError)
          console.error("Response:", uploadError.response?.data)
          // Don't throw - article already updated
          toast.warning("Artikel berhasil diupdate tapi gagal upload gambar.")
        }
      }

      toast.success("Artikel berhasil diperbarui!")
      navigate("/articles")
    } catch (error) {
      console.error("❌ Full error:", error)
      console.error("Error response:", error.response)
      console.error("Error data:", error.response?.data)
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.response?.data?.errors?.map(e => e.message).join(", ") ||
                          error.message ||
                          "Gagal memperbarui artikel."
      
      toast.error(`Error: ${errorMessage}`)
      setLoading(false)
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("File harus berupa gambar!")
        e.target.value = null
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB!")
        e.target.value = null
        return
      }
      setImageFile(file)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-700 font-semibold">Memuat data artikel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => navigate("/articles")}
              className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 font-semibold mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Kembali ke Daftar Artikel
            </button>
            <h1 className="text-4xl font-extrabold text-amber-900 mb-2">Edit Artikel</h1>
            <p className="text-amber-700">Perbarui informasi artikel</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-amber-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-amber-900 font-semibold mb-2" htmlFor="title">
                  Judul Artikel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul artikel"
                  className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-amber-900 font-semibold mb-2" htmlFor="summary">
                  Ringkasan
                </label>
                <textarea
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Ringkasan singkat artikel (opsional)"
                  rows="3"
                  className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-amber-900 font-semibold mb-2" htmlFor="content">
                  Konten <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tulis konten artikel lengkap di sini..."
                  rows="12"
                  className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-amber-900 font-semibold mb-2" htmlFor="periodId">
                  Periode <span className="text-red-500">*</span>
                </label>
                <select
                  id="periodId"
                  value={periodId}
                  onChange={(e) => setPeriodId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  required
                >
                  <option value="">Pilih periode</option>
                  {periods.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.name_ofPeriod}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-amber-900 font-semibold mb-2">
                  Gambar Artikel
                </label>
                
                {currentImageUrl && (
                  <div className="mb-4">
                    <p className="text-sm text-amber-700 mb-2">Gambar saat ini:</p>
                    <img
                      src={currentImageUrl}
                      alt="Current article"
                      className="w-48 h-48 object-cover rounded-lg shadow-md border-2 border-amber-200"
                    />
                  </div>
                )}

                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200"
                />
                <p className="text-sm text-amber-600 mt-2">
                  {currentImageUrl 
                    ? "Upload gambar baru untuk mengganti gambar saat ini" 
                    : "Format: JPG, PNG, GIF. Maksimal 5MB"}
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  nameProp="Batal"
                  type="button"
                  onClick={() => navigate("/articles")}
                  variant="secondary"
                  fullWidth={true}
                />
                <Button 
                  nameProp={loading ? "Menyimpan..." : "Perbarui Artikel"}
                  type="submit"
                  disabled={loading}
                  variant="primary"
                  fullWidth={true}
                />
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="mt-auto bg-transparent py-4">
        <p className="text-center text-amber-800 text-sm">© 2025 Museum Soeharto. All rights reserved.</p>
      </footer>
    </div>
  )
}
