import { useEffect, useState } from "react"
import { useNavigate } from 'react-router'
import axios from 'axios'
import baseUrl from "../constant/url"
import { toast } from 'react-toastify';
import Button from '../component/button-reusable.jsx'

export default function PeriodTable() {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [periodName, setPeriodName] = useState("");
  const navigate = useNavigate();

  async function fetchPeriods() {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const { data } = await axios.get(`${baseUrl}/periods`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPeriods(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching periods:", error);
      toast.error("Gagal memuat daftar periode.");
      setLoading(false);

      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/");
      }
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!periodName.trim()) {
      toast.error("Nama periode tidak boleh kosong!");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");

      if (editingPeriod) {
        // Update existing period
        await axios.put(
          `${baseUrl}/periods/${editingPeriod.id}`,
          { name_ofPeriod: periodName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Periode berhasil diperbarui!");
      } else {
        // Create new period
        await axios.post(
          `${baseUrl}/periods`,
          { name_ofPeriod: periodName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Periode berhasil ditambahkan!");
      }

      setShowModal(false);
      setPeriodName("");
      setEditingPeriod(null);
      fetchPeriods();
    } catch (error) {
      console.error("Error saving period:", error);
      toast.error(error.response?.data?.message || "Gagal menyimpan periode.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Apakah Anda yakin ingin menghapus periode ini?")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`${baseUrl}/periods/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Periode berhasil dihapus!");
      fetchPeriods();
    } catch (error) {
      console.error("Error deleting period:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus periode.");
    }
  }

  function openCreateModal() {
    setEditingPeriod(null);
    setPeriodName("");
    setShowModal(true);
  }

  function openEditModal(period) {
    setEditingPeriod(period);
    setPeriodName(period.name_ofPeriod);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setPeriodName("");
    setEditingPeriod(null);
  }

  useEffect(() => {
    fetchPeriods();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-amber-900 mb-2">Periode Sejarah</h1>
            <p className="text-amber-700">Kelola periode waktu dalam sejarah</p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-700 text-white font-bold hover:bg-gray-800 border-2 border-gray-800 transition-all shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Tambah Periode
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
                  <th className="px-6 py-4 text-left font-bold text-amber-900">Nama Periode</th>
                  <th className="px-6 py-4 text-left font-bold text-amber-900">Dibuat</th>
                  <th className="px-6 py-4 text-right font-bold text-amber-900 w-48">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-amber-100">
                {periods.length > 0 ? (
                  periods.map((period) => (
                    <tr key={period.id} className="hover:bg-amber-50 transition-colors">
                      <td className="px-6 py-4 text-amber-900 font-semibold">{period.id}</td>
                      <td className="px-6 py-4 text-amber-900 font-bold text-lg">
                        {period.name_ofPeriod}
                      </td>
                      <td className="px-6 py-4 text-amber-800">
                        {new Date(period.createdAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(period)}
                            className="inline-flex items-center gap-1 px-4 py-2 rounded-full border-2 border-amber-500 text-amber-700 text-sm font-semibold hover:bg-amber-500 hover:text-white transition-all"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(period.id)}
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
                    <td colSpan="4" className="px-6 py-8 text-center text-amber-700">
                      Belum ada periode
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border-2 border-amber-200">
            <h2 className="text-2xl font-bold text-amber-900 mb-6">
              {editingPeriod ? "Edit Periode" : "Tambah Periode Baru"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-amber-900 font-semibold mb-2" htmlFor="periodName">
                  Nama Periode
                </label>
                <input
                  type="text"
                  id="periodName"
                  value={periodName}
                  onChange={(e) => setPeriodName(e.target.value)}
                  placeholder="Contoh: Masa Pemerintahan Soeharto"
                  className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  nameProp="Batal"
                  type="button"
                  onClick={closeModal}
                  variant="secondary"
                  fullWidth={true}
                />
                <Button 
                  nameProp={editingPeriod ? "Perbarui" : "Simpan"}
                  type="submit"
                  variant="primary"
                  fullWidth={true}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="mt-auto bg-transparent py-4">
        <p className="text-center text-amber-800 text-sm">© 2025 Museum Soeharto. All rights reserved.</p>
      </footer>
    </div>
  );
}
