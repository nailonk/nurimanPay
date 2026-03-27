import { useState, useEffect } from "react"
import { Eye, EyeOff, LogIn, LockKeyhole, UserRound, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
        <Card className="w-full max-w-[340px] rounded-3xl bg-white/95 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-none">
          <CardContent className="p-6 sm:p-7 space-y-5">
            <div className="text-center space-y-2">
              <img src={logo} alt="Logo" className="w-14 h-14 mx-auto object-contain" />
              <h1 className="text-xl font-bold text-gray-800">Nuriman Pay</h1>
              <p className="text-sm text-gray-500">Admin Portal Only</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label>Email Address</Label>
                <div className="relative">
                  <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    placeholder="Enter admin email"
                    className="w-full pl-11 py-3 rounded-full bg-gray-100 outline-none text-gray-700"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Password</Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 rounded-full bg-gray-100 outline-none text-gray-700"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                   <p className="text-red-500 text-xs text-center font-medium">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold shadow-lg transition-all"
              >
                {loading ? "Verifying..." : "Enter Dashboard"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login