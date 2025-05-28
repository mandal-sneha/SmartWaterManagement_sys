import React, { useState } from "react"
import { axiosInstance } from "../lib/axios.js"
import { useNavigate } from "react-router-dom"

const FloatingLabelInput = ({ label, type = "text", name, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false)
  return (
    <div className="relative mb-3">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full h-14 border border-gray-300 rounded-lg px-4 focus:outline-none focus:border-blue-500"
        placeholder=" "
      />
      <label
        className={`pointer-events-none absolute cursor-text text-gray-500 duration-200 transform z-10 bg-white px-1 left-4 ${
          value ? "top-0 scale-75 -translate-y-1/2" : isFocused ? "top-0 scale-75 -translate-y-1/2" : "top-1/2 -translate-y-1/2"
        }`}
      >
        {label}
      </label>
    </div>
  )
}

const PasswordInput = ({ label, name, value, onChange, showPassword, setShowPassword }) => {
  const [isFocused, setIsFocused] = useState(false)
  return (
    <div className="relative mb-3">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full h-14 border border-gray-300 rounded-lg px-4 focus:outline-none focus:border-blue-500"
        placeholder=" "
      />
      <label
        className={`pointer-events-none absolute cursor-text text-gray-500 duration-200 transform z-10 bg-white px-1 left-4 ${
          value ? "top-0 scale-75 -translate-y-1/2" : isFocused ? "top-0 scale-75 -translate-y-1/2" : "top-1/2 -translate-y-1/2"
        }`}
      >
        {label}
      </label>
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 text-sm"
      >
        {showPassword ? "HIDE" : "SHOW"}
      </button>
    </div>
  )
}

const SignUpPage = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    userId: "",
    password: "",
    confirmPassword: "",
    houseNo: "",
    address: "",
    pinCode: "",
    wardNumber: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setError("")
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      setIsLoading(true)
      const { confirmPassword, ...submitData } = formData
      const response = await axiosInstance.post("/user/signup", submitData)
      if (response.data.success) {
        localStorage.setItem("token", response.data.token)
        navigate(`/u/${formData.userId}`)
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-blue-700">
      <div className="bg-white rounded-2xl shadow-lg flex w-3/5 min-h-[600px] overflow-hidden">
        <div className="w-1/2 bg-gradient-to-r from-blue-600 to-blue-800 text-white flex flex-col justify-center items-center p-10">
          <h1 className="text-3xl font-bold">WELCOME</h1>
          <p className="text-sm text-center mt-4">Your headline name goes here. Some welcoming text about the system.</p>
        </div>
        <div className="w-1/2 p-10 flex flex-col justify-between">
          <div>
            {step === 1 && <h2 className="text-2xl font-semibold mb-6">Sign up</h2>}
            {step === 2 && <h2 className="text-2xl font-semibold mb-6">Address Details</h2>}
            {step === 1 && (
              <form className="space-y-3">
                <FloatingLabelInput label="Username" name="username" value={formData.username} onChange={handleChange} />
                <FloatingLabelInput label="User ID" name="userId" value={formData.userId} onChange={handleChange} />
                <PasswordInput label="Password" name="password" value={formData.password} onChange={handleChange} showPassword={showPassword} setShowPassword={setShowPassword} />
                <PasswordInput label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} showPassword={showConfirmPassword} setShowPassword={setShowConfirmPassword} />
                {error && <p className="text-red-500 text-sm -mt-2">{error}</p>}
              </form>
            )}
            {step === 2 && (
              <form className="space-y-3">
                <FloatingLabelInput label="House No." name="houseNo" value={formData.houseNo} onChange={handleChange} />
                <FloatingLabelInput label="Address" name="address" value={formData.address} onChange={handleChange} />
                <FloatingLabelInput label="Pin Code" name="pinCode" value={formData.pinCode} onChange={handleChange} />
                <FloatingLabelInput label="Ward Number" name="wardNumber" value={formData.wardNumber} onChange={handleChange} />
              </form>
            )}
          </div>
          <div className={`flex ${step === 1 ? "justify-end" : "justify-between"} mt-8`}>
            {step === 2 && (
              <button onClick={handleBack} className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-400 transition">
                Back
              </button>
            )}
            {step === 1 && (
              <button onClick={handleNext} disabled={isLoading} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                Next
              </button>
            )}
            {step === 2 && (
              <button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                {isLoading ? "Processing..." : "Sign Up"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage;