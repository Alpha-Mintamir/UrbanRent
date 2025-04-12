import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { useAuth } from '../../hooks';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const auth = useAuth();
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Debug log
    console.log('Form data being submitted:', { 
      name, 
      email, 
      password: password ? '********' : undefined,
      passwordValid,
      passwordCriteria,
      passwordsMatch: password === confirmPassword
    });

    if (!passwordValid) {
      toast.error('Password does not meet all requirements');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const response = await auth.register({ name, email, password });
    if (response.success) {
      toast.success(response.message);
      setRedirect(true);
    } else {
      toast.error(response.message);
    }
  };

  const handleGoogleLogin = async (credential) => {
    const response = await auth.googleLogin(credential);
    if (response.success) {
      toast.success(response.message);
      setRedirect(true);
    } else {
      toast.error(response.message);
    }
  };

  const validatePassword = (password) => {
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordCriteria(criteria);
    setPasswordValid(Object.values(criteria).every(Boolean));
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mt-4 flex grow items-center justify-around p-4 md:p-0">
      <div className="mb-40">
        <h1 className="mb-4 text-center text-4xl">Register</h1>
        <form className="mx-auto max-w-md" onSubmit={handleRegister}>
          <div className="flex flex-col">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative flex flex-col">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              required
            />
            <span
              className="absolute right-3 top-10 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="relative flex flex-col">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-10 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <p>Password must meet the following criteria:</p>
            <ul className="list-inside list-disc">
              <li
                className={
                  passwordCriteria.length ? 'text-green-500' : 'text-red-500'
                }
              >
                At least 8 characters
              </li>
              <li
                className={
                  passwordCriteria.uppercase ? 'text-green-500' : 'text-red-500'
                }
              >
                At least one uppercase letter
              </li>
              <li
                className={
                  passwordCriteria.lowercase ? 'text-green-500' : 'text-red-500'
                }
              >
                At least one lowercase letter
              </li>
              <li
                className={
                  passwordCriteria.number ? 'text-green-500' : 'text-red-500'
                }
              >
                At least one number
              </li>
              <li
                className={
                  passwordCriteria.specialChar
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                At least one special character
              </li>
            </ul>
          </div>
          <Button
            type="submit"
            className="primary my-2"
            disabled={!passwordValid || password !== confirmPassword}
          >
            Register
          </Button>
        </form>

        <div className="mb-4 flex w-full items-center gap-4">
          <div className="h-0 w-1/2 border-[1px]"></div>
          <p className="small -mt-1">or</p>
          <div className="h-0 w-1/2 border-[1px]"></div>
        </div>

        {/* Google login button */}
        <div className="flex h-[50px] justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleGoogleLogin(credentialResponse.credential);
            }}
            onError={() => {
              console.log('Login Failed');
            }}
            text="continue_with"
            width="350"
          />
        </div>

        <div className="py-2 text-center text-gray-500">
          Already a member?
          <Link className="text-black underline" to={'/login'}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
