'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/v2/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { loginUser } from '@/lib/requests/v2/authentication/requests';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setIsLoggedIn } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [redirectPath, setRedirectPath] = useState('/');

  useEffect(() => {
    // Get the redirect path from URL parameters
    const redirect = searchParams.get('redirect');
    if (redirect) {
      setRedirectPath(redirect);
    }
  }, [searchParams]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) return;

    setIsLoading(true);
    try {
      const result = await loginUser( formData.email, formData.password );
      if( result?.code === '00' ) {
        toast.success( result.message || 'Login Successful' );
        setIsLoggedIn( true );
        setUser({ 
          ...result.data.user,
          _id: result.data.user.id.toString(),
        });
        router.push(redirectPath);
      } else {
        toast.error( result?.message || 'Login failed' );
        setFormData({ ...formData, password: '' });
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-background min-h-[calc(100vh-150px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg w-full max-w-md border-neutral-700 bg-neutral-900 text-white">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground md:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-2xl font-bold text-white">Sign in</CardTitle>
            </div>
            <CardDescription className="text-neutral-400">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    validateEmail(e.target.value);
                  }}
                  required
                  className={`bg-background border-input focus:border-emerald-500 focus:ring-emerald-500/20 ${
                    emailError ? 'border-red-500' : ''
                  }`}
                />
                {emailError && (
                  <p className="text-sm text-red-500">{emailError}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className='flex justify-between items-center'>
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Link href="/auth/resetpassword" className='text-green-500 hover:text-green-400 hover:underline hover:underline-offset-4 text-sm font-medium'>
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="bg-background border-input focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t border-neutral-700 py-4 px-6">
              <div className="text-center w-full">
                <p className="text-neutral-400 text-sm">
                  Don't have an account?{" "}
                  <Link href="/auth/signup" className="text-green-500 hover:text-green-400 hover:underline hover:underline-offset-4 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}