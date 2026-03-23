import { useState, useEffect } from "react"
import { Eye, EyeOff, LogIn, LockKeyhole, UserRound, ArrowLeft } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

import { Link, useNavigate } from "react-router-dom"

import logo from "@/assets/logo.png"

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) navigate("/admin/dashboard")
  }, [navigate]) // ✅ FIX warning

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Email dan password wajib diisi")
      return
    }

    setLoading(true)

    setTimeout(() => {
      if (email === "admin@gmail.com" && password === "admin123") {
        localStorage.setItem("token", "dummy_token")
        navigate("/admin/dashboard")
      } else {
        setError("Email atau password salah")
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10">

      {/*  BACKGROUND FULL  */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,#eaf5e4_0%,#c5e1a5_30%,#81c784_60%,#4caf50_80%,#2e7d32_100%)]" />

      {/* Glow */}
      <div className="fixed w-[500px] h-[500px] bg-white/20 blur-3xl rounded-full top-[-120px] left-[-120px] -z-10" />
      <div className="fixed w-[400px] h-[400px] bg-green-200/30 blur-3xl rounded-full bottom-[-120px] right-[-120px] -z-10" />

      {/*  Back */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-5 left-5 text-white z-10"
      >
        <ArrowLeft size={26} />
      </button>

      {/* WRAPPER */}
      <div className="w-full flex flex-col items-center">

        {/* CARD (LEBIH KECIL) */}
        <Card className="
          w-full max-w-[340px] 
          rounded-3xl 
          bg-white/95 
          shadow-[0_20px_50px_rgba(0,0,0,0.15)]
          border-none
        ">
          <CardContent className="p-6 sm:p-7 space-y-5">

            {/* LOGO */}
            <div className="text-center space-y-2">
              <img
                src={logo}
                alt="Logo"
                className="w-14 h-14 mx-auto object-contain"
              />

              <h1 className="text-xl font-bold text-gray-800">
                Nuriman Pay
              </h1>

              <p className="text-sm text-gray-500">
                Secure access to your digital wallet
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* EMAIL */}
              <div className="space-y-1">
                <Label>Email or Username</Label>

                <div className="relative">
                  <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                  <input
                    type="text"
                    placeholder="Enter your credentials"
                    className="w-full pl-11 py-3 rounded-full bg-gray-100 outline-none text-gray-700 placeholder:text-gray-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <Label>Password</Label>

                  <Link
                    to="/forgotpassword"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 rounded-full bg-gray-100 outline-none text-gray-700"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* REMEMBER */}
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Keep me logged in
                </Label>
              </div>

              {/* ERROR */}
              {error && (
                <p className="text-red-500 text-sm text-center">
                  {error}
                </p>
              )}

              {/* BUTTON */}
              <Button
                type="submit"
                disabled={loading}
                className="
                  w-full py-3 
                  rounded-full 
                  bg-yellow-400 hover:bg-yellow-500 
                  text-black font-semibold 
                  shadow-[0_8px_20px_rgba(0,0,0,0.2)]
                "
              >
                {loading ? "Loading..." : (
                  <span className="flex items-center justify-center gap-2">
                    Login to Account <LogIn size={18} />
                  </span>
                )}
              </Button>

              <p className="text-xs text-center text-gray-400">
                Admin access only
              </p>

            </form>
          </CardContent>
        </Card>

        {/* ✅ FOOTER (JARAK AMAN) */}
        <div className="mt-10 text-white/80 text-xs flex gap-6 justify-center">
          <button>Security Center</button>
          <button>Privacy Policy</button>
          <button>Terms of Service</button>
        </div>

      </div>
    </div>
  )
}

export default Login