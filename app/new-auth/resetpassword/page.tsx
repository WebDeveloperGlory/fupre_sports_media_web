'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { generateOtp, resetPassword, validateOtp } from '@/lib/requests/v2/authentication/requests';
import { toast } from 'react-toastify';

export default function ResetPasswordPage() {
        const router = useRouter();
        const [formData, setFormData] = useState({
            email: '',
            password: '',
            confirmPassword: '',
        });
        const [isLoading, setIsLoading] = useState(false);
        const [otp, setOtp] = useState<string[]>(['', '', '', '']);
        const [isOTPStep, setIsOTPStep] = useState<boolean>( false );
        const [showPassword, setShowPassword] = useState<boolean>(false);
        const [emailError, setEmailError] = useState<string>('');
        const [passwordError, setPasswordError] = useState<string>('');

        const validateEmail = (email: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setEmailError('Please enter a valid email address');
                return false;
            }
            setEmailError('');
            return true;
        };
        const validatePassword = () => {
            if (formData.password.length < 6) {
                setPasswordError('Password must be at least 6 characters');
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                setPasswordError('Passwords do not match');
                return false;
            }
            setPasswordError('');
            return true;
        };
        const handleEmailSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (!validateEmail(formData.email) || !validatePassword()) return;

            try {
                const result = await generateOtp( formData.email );
                if( result?.code === '00' ) {
                    toast.success( result.message );
                    setIsOTPStep( true );
                } else {
                    toast.error( result?.message || 'Login failed' );
                    setFormData({ ...formData });
                }
            } catch (error) {
                console.error('Login failed:', error);
            } finally {
                setIsLoading(false);
            }
        };
        const handleOTPSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

            setIsLoading(true);
            try {
                const result = await validateOtp( formData.email, otp.join('') );
                if( result?.code === '00' ) {
                    const resetResult = await resetPassword( formData.email, formData.password, formData.confirmPassword );
                    if( resetResult?.code === '00' ) {
                        toast.success( result.message );
                        toast.success( resetResult.message );
                        router.push('/auth/login');
                    } else {
                        toast.error( result?.message || 'Reset failed' )
                    }
                } else {
                    toast.error( result?.message || 'Reset failed' );
                    setFormData({ ...formData });
                }
            } catch (error) {
                console.error('Reset Failed:', error);
            } finally {
                setIsLoading(false);
            }
        };
        const handleOTPChange = ( index: number, value: string ) => {
            if( value.length > 1 ) {
                value = value.slice( 0, 1 );
            }

            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp( newOtp );

            if( value && index < 3 ) {
                const nextInput = document.getElementById(`otp-${index + 1}`)
                if( nextInput ) {
                    nextInput.focus();
                }
            }
        }
    return (
        <div className='flex justify-center items-center min-h-[calc(100vh-150px)]'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-lg w-full max-w-md border-neutral-700 bg-neutral-900 text-white">
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-2xl font-bold text-white">Reset Password</CardTitle>
                        <CardDescription className="text-neutral-400">
                            {
                                !isOTPStep ?
                                    "Create new password and enter your email to recieve a verification code"
                                :
                                    "Enter the verification code sent to your email"
                            }
                            
                        </CardDescription>
                    </CardHeader>
                    { 
                        !isOTPStep ? (
                            <form onSubmit={handleEmailSubmit}>
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
                                        {
                                            emailError && (
                                                <p className="text-sm text-red-500">{emailError}</p>
                                            )
                                        }
                                    </div>
                                    <div className="space-y-1">
                                        <label htmlFor="password" className="text-sm font-medium">
                                        Password
                                        </label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Create a password"
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
                                    <div className="space-y-1">
                                        <label htmlFor="confirmPassword" className="text-sm font-medium">
                                        Confirm Password
                                        </label>
                                        <Input
                                        id="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                        className={`bg-background border-input focus:border-emerald-500 focus:ring-emerald-500/20 ${
                                            passwordError ? 'border-red-500' : ''
                                        }`}
                                        />
                                        {passwordError && (
                                        <p className="text-sm text-red-500">{passwordError}</p>
                                        )}
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Sending...' : 'Send Reset Code'}
                                    </Button>
                                </CardContent>
                                <CardFooter className="flex flex-col space-y-4 border-t border-neutral-700 py-4 px-6">
                                    <div className="text-center w-full">
                                        <p className="text-neutral-400 text-sm">
                                            Remember your password?{" "}
                                            <Link href="/auth/login" className="text-green-500 hover:text-green-400 hover:underline hover:underline-offset-4 font-medium">
                                                Sign in
                                            </Link>
                                        </p>
                                    </div>
                                </CardFooter>
                            </form>
                        ) : (
                            <form onSubmit={handleOTPSubmit}>
                                <CardContent className="space-y-5">
                                    <div className="text-center mb-6">
                                        <h3 className="text-lg font-medium text-white">
                                            Verify your email
                                        </h3>
                                        <p className="text-sm text-natural-400">We've sent a 4-digit verification code to <span className='text-emerald-500'>{ formData.email }</span></p>
                                    </div>
                                    <div className="flex justify-center gap-2">
                                        {
                                            otp.map(( digit, index ) => (
                                                <Input
                                                    key={ index }
                                                    id={`otp-${ index }`}
                                                    type='text'
                                                    inputMode='numeric'
                                                    pattern='[0-9]'
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOTPChange( index, e.target.value )}
                                                    className='w-12 h-12 text-center text-lg bg-neutral-900 border-neutral-800 text-white'
                                                    aria-label={`Digit ${ index + 1 } of verification codde`}
                                                />
                                            ))
                                        }
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                                        disabled={isLoading || otp.some((digit) => !digit)}
                                    >
                                        {isLoading ? 'Verifying...' : 'Verify Code'}
                                    </Button>
                                    <div className='text-center mt-4'>
                                        <Button
                                            variant='link'
                                            className='text-neutral-400 hover:text-white p-0 h-auto'
                                            onClick={() => setIsOTPStep(false)}
                                            disabled={isLoading}
                                        >
                                            <ArrowLeft className='h-4 w-4 mr-2' />
                                            Back to email
                                        </Button>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col space-y-4 border-t border-neutral-700 py-4 px-6">
                                    <div className="text-center w-full">
                                        <p className="text-neutral-400 text-sm">
                                            Remember your password?{" "}
                                            <Link href="/auth/login" className="text-green-500 hover:text-green-400 hover:underline hover:underline-offset-4 font-medium">
                                                Sign in
                                            </Link>
                                        </p>
                                    </div>
                                </CardFooter>
                            </form>
                        )
                    }
                </Card>
            </motion.div>
        </div>
    )
}