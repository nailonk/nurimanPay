import { useState, useEffect } from "react"
import { Eye, EyeOff, LogIn, LockKeyhole, UserRound, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import api from "@/api/axios" 
import logo from "@/assets/logo.png"

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const { login: authLogin, admin } = useAuth()

  useEffect(() => {
    if (admin) navigate("/admin/dashboard", { replace: true })
  }, [admin, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Email dan password wajib diisi")
      return
    }

    setLoading(true)

    try {
      const response = await api.post("/auth/login", { email, password });
      const result = response.data;

      const userData = result.data?.user || result.user;
      const tokenData = result.data?.token || result.token;

      if (!userData || !tokenData) {
        throw new Error("Invalid server response: Missing user data or token");
      }

      if (userData.role !== 'admin') {
        throw new Error("Unauthorized: Akun anda tidak memiliki hak akses admin");
      }

      authLogin(userData, tokenData);
      navigate("/admin/dashboard", { replace: true });
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(errorMessage);
      console.error("[Auth] Login exception:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,#eaf5e4_0%,#c5e1a5_30%,#81c784_60%,#4caf50_80%,#2e7d32_100%)]" />

      <button onClick={() => navigate(-1)} className="absolute top-5 left-5 text-white z-10">
        <ArrowLeft size={26} />
      </button>

      <div className="w-full flex flex-col items-center">
        <Card className="w-full max-w-[340px] rounded-3xl bg-white/95 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-none ring-0 outline-none">
          <CardContent className="p-6 sm:p-7 space-y-5">
            <div className="text-center space-y-2">
              <img src={logo} alt="Logo" className="w-20 h-20 mx-auto object-contain" />
              <h1 className="text-2xl font-bold text-gray-800">Nuriman Pay</h1>
              <p className="text-sm text-gray-500">Admin Portal Only</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Email or Username</Label>
                <div className="relative">
                  <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    placeholder="Enter your credential"
                    className="w-full h-12 pl-11 py-3 rounded-3xl bg-gray-100 outline-none text-gray-700 border-b"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full h-12 pl-11 pr-11 py-3 rounded-3xl bg-gray-100 outline-none text-gray-700 border-b"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Checkbox */}
              <div className="flex items-center space-x-2.5 ml-4">
                <input type="checkbox" id="keep" className="w-4 h-4 rounded-full border-[#cbd5e1] text-[#ffcc1d] focus:ring-0 cursor-pointer" />
                <label htmlFor="keep" className="text-[#94a3b8] text-[12px] font-medium cursor-pointer">Keep me logged in</label>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                   <p className="text-red-500 text-xs text-center font-medium">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-2xl bg-[#ffcc1d] hover:bg-[#fbbf24] text-[#0f172a] text-sm font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? "Verifying..." : (
                  <>
                    Login to Account <LogIn size={16} />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 flex space-x-5 text-[#fefefe] text-[11px] font-semibold tracking-wide opacity-80">
          <a href="#" className="hover:opacity-100 transition-opacity">Security Center</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a>
        </div>
      </div>
    </div>
  )
}

export default Login