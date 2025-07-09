import { useState, useEffect } from 'react';
import axios from 'axios';

const AuthForm = () => {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [form, setForm] = useState({
    name: '',
    email: '',
    dob: '',
    otp: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/welcome';
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleGetOtp = async () => {
    setError('');
    try {
      if (!form.email) {
        setError('Email is required.');
        return;
      }

      if (mode === 'signup') {
        if (!form.name || !form.dob) {
          setError('Please fill all fields to sign up.');
          return;
        }

        await axios.post('https://highway-delite-assignment-fn44.onrender.com/api/auth/send-otp', {
          name: form.name,
          email: form.email,
          dob: form.dob,
        });
      } else {
        await axios.post('https://highway-delite-assignment-fn44.onrender.com/api/auth/verify-otp', {
          email: form.email,
        });
      }

      setOtpSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
      setOtpSent(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post('https://highway-delite-assignment-fn44.onrender.com/api/auth/verify-otp', {
        email: form.email,
        otp: form.otp,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.name);
      localStorage.setItem('email', res.data.email);

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      window.location.href = '/welcome';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  const handleResendOtp = async () => {
  setError('');
  try {
    if (!form.email) {
      setError('Email is required to resend OTP.');
      return;
    }

    await axios.post('https://highway-delite-assignment-fn44.onrender.com/api/auth/resend-otp', {
      email: form.email,
    });

    setError('A new OTP has been sent to your email.');
  } catch (err: any) {
    setError(err.response?.data?.message || 'Failed to resend OTP');
  }
};


  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-white relative">
        <div className="absolute top-4 left-4 md:left-8 md:top-6 text-2xl font-bold">
          <span className="flex items-center gap-2">
            <img src="/icon.svg" alt="icon" className="w-6 h-6" /> HD
          </span>
        </div>

        <div className="w-full max-w-md mt-16 md:mt-0">
          <h1 className="text-3xl font-bold mb-2 text-center md:text-left">
            {mode === 'signup' ? 'Sign up' : 'Sign in'}
          </h1>
          <p className="text-gray-600 mb-6 text-center md:text-left">
            {mode === 'signup'
              ? 'Sign up to enjoy features in HD'
              : 'Please login to continue to your account'}
          </p>

          <div className="flex flex-col gap-4 relative">
            {mode === 'signup' && (
              <>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    placeholder=" "
                    className="peer w-full border border-gray-300 rounded-md p-3 pt-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                  <label htmlFor="name" className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600 transition-all">
                    Name
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="date"
                    id="dob"
                    placeholder=" "
                    className="peer w-full border border-gray-300 rounded-md p-3 pt-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                  />
                  <label htmlFor="dob" className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600 transition-all">
                    Date of Birth
                  </label>
                </div>
              </>
            )}

            {/* Email input */}
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder=" "
                className="peer w-full border border-gray-300 rounded-md p-3 pt-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              <label htmlFor="email" className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600 transition-all">
                Email
              </label>
            </div>

            {/* OTP input - shown in signin or after sending */}
            {(mode === 'signin' || otpSent) && (
              <div className="relative">
                <input
                  type="text"
                  id="otp"
                  placeholder=" "
                  className="peer w-full border border-gray-300 rounded-md p-3 pt-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleInputChange('otp', e.target.value)}
                />
                <label htmlFor="otp" className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600 transition-all">
                  OTP
                </label>
              </div>
            )}

            {/* Remember Me and Resend OTP */}
            {(mode === 'signin' || otpSent) && (
              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="form-checkbox border-gray-300"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Resend OTP
                </button>
              </div>
            )}

            {/* Action Button */}
            {!otpSent && mode === 'signup' && (
              <button
                onClick={handleGetOtp}
                className="bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
              >
                Get OTP
              </button>
            )}

            {(mode === 'signin' || otpSent) && (
              <button
                onClick={handleVerifyOtp}
                className="bg-blue-600 text-white py-3 mt-4 rounded-md hover:bg-blue-700 transition"
              >
                {mode === 'signup' ? 'Sign Up' : 'Sign In'}
              </button>
            )}

            {/* Switch Mode */}
            <p className="text-gray-600 text-sm text-center">
              {mode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <span onClick={() => { setMode('signin'); setOtpSent(false); setError(''); }} className="text-blue-600 underline cursor-pointer">
                    Sign in
                  </span>
                </>
              ) : (
                <>
                  Need an account?{' '}
                  <span onClick={() => { setMode('signup'); setOtpSent(false); setError(''); }} className="text-blue-600 underline cursor-pointer">
                    Sign up
                  </span>
                </>
              )}
            </p>
          </div>

          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        </div>
      </div>

      {/* Right Section with Image */}
      <div className="hidden md:block w-full md:w-1/2 h-64 md:h-auto">
        <img src="/bg.jpg" alt="Signup Illustration" className="w-full h-full object-cover rounded-3xl p-3" />
      </div>
    </div>
  );
};

export default AuthForm;
