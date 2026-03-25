import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"
import { Eye, EyeOff, LockKeyhole, Mail, ArrowLeft } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import logo from "@/assets/logo.png"

function ForgotPassword() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleReset = (e) => {
    e.preventDefault()

    setError("")
    setSuccess("")

    if (!email || !password || !confirm) {
      setError("Semua field wajib diisi")
      return
    }

    if (password !== confirm) {
      setError("Password tidak cocok")
      return
    }

    setSuccess("Password berhasil direset, silakan login")

    setTimeout(() => {
      navigate("/login")
    }, 1500)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10">

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,#eaf5e4_0%,#c5e1a5_30%,#81c784_60%,#4caf50_80%,#2e7d32_100%)]" />

      {/* Glow */}
      <div className="fixed w-[500px] h-[500px] bg-white/20 blur-3xl rounded-full top-[-120px] left-[-120px] -z-10" />
      <div className="fixed w-[400px] h-[400px] bg-green-200/30 blur-3xl rounded-full bottom-[-120px] right-[-120px] -z-10" />

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-5 left-5 text-white z-10"
      >
        <ArrowLeft size={26} />
      </button>

      {/* WRAPPER */}
      <div className="w-full flex flex-col items-center">

        {/* CARD */}
        <Card className="w-full max-w-[340px] rounded-3xl bg-white/95 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-none">
          <CardContent className="p-6 sm:p-7 space-y-5">

            {/* HEADER */}
            <div className="text-center space-y-2">
              <img
                src={logo}
                className="w-14 h-14 mx-auto object-contain"
              />

              <h1 className="text-xl font-bold text-gray-800">
                Forgot Password
              </h1>

              <p className="text-sm text-gray-500">
                Reset your password securely
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleReset} className="space-y-4">

              {/* EMAIL */}
              <div className="space-y-1">
                <Label>Email Address</Label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-11 py-3 rounded-full bg-gray-100 outline-none text-gray-700 placeholder:text-gray-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-1">
                <Label>New Password</Label>

                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-11 pr-11 py-3 rounded-full bg-gray-100 outline-none text-gray-700"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
              </div>

              {/* CONFIRM */}
              <div className="space-y-1">
                <Label>Confirm Password</Label>

                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                  <input
                    type={showConfirm ? "text" : "password"}
                    className="w-full pl-11 pr-11 py-3 rounded-full bg-gray-100 outline-none text-gray-700"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>

                {confirm && (
                  password === confirm ? (
                    <p className="text-green-500 text-xs mt-1 text-center">
                      Password cocok
                    </p>
                  ) : (
                    <p className="text-red-500 text-xs mt-1 text-center">
                      Password tidak cocok
                    </p>
                  )
                )}
              </div>

              {/* ERROR */}
              {error && (
                <p className="text-red-500 text-sm text-center">
                  {error}
                </p>
              )}

              {/* SUCCESS */}
              {success && (
                <p className="text-green-500 text-sm text-center">
                  {success}
                </p>
              )}

              {/* BUTTON */}
              <Button
                type="submit"
                className="w-full py-3 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.2)]"
              >
                Reset Password
              </Button>

              <p className="text-xs text-center text-gray-400">
                Back to{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Login
                </Link>
              </p>

            </form>
          </CardContent>
        </Card>

        {/* FOOTER (SAMA LOGIN) */}
        <div className="mt-10 text-white/80 text-xs flex gap-6 justify-center">
          <button>Security Center</button>
          <button>Privacy Policy</button>
          <button>Terms of Service</button>
        </div>

      </div>
    </div>
  )
}

export default ForgotPassword