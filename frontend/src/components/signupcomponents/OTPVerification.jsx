import React, { useState, useRef, useEffect } from 'react';
import { axiosInstance } from '../../lib/axios.js';
import { FiMail, FiLock, FiCheckCircle, FiAlertCircle, FiRepeat } from 'react-icons/fi';

const OTPVerification = ({ email, onVerify, onBack, loading, error, onError }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (onError) onError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleVerify = () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      if (onError) onError('Please enter a 6-digit OTP');
      return;
    }
    onVerify(otpValue);
  };

  const handleResend = async () => {
    setResendLoading(true);
    if (onError) onError('');
    try {
      await axiosInstance.post(`/user/${email}/generate-email-verification-otp`);
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      console.error('OTP resend error:', err);
      if (onError) onError(err.response?.data?.message || 'Failed to resend OTP. Try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
          <FiMail className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
        <p className="text-gray-500 text-sm">
          We've sent a 6-digit verification code to
          <br />
          <span className="font-semibold text-indigo-600">{email}</span>
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-red-50 border border-red-200">
          <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
          Enter Verification Code
        </label>
        <div className="flex justify-center gap-3 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              style={{
                borderColor: digit ? '#8B5CF6' : '#E5E7EB',
                backgroundColor: digit ? '#F3F4F6' : 'white'
              }}
              disabled={loading}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <div className="text-center">
          {resendTimer > 0 ? (
            <p className="text-sm text-gray-500">
              Resend code in <span className="font-semibold text-indigo-600">{resendTimer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
              disabled={loading || resendLoading}
            >
              <FiRepeat className="w-4 h-4" />
              {resendLoading ? 'Sending...' : 'Resend Verification Code'}
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleVerify}
          disabled={loading}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verifying...
            </div>
          ) : (
            'Verify & Continue'
          )}
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">
          Didn't receive the code? Check your spam folder or try resending.
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;