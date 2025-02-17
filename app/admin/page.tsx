'use client'
// import { loginUser } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import useAuthStore from '@/stores/authStore';
import { loginUser } from '@/lib/requests/auth/requests';

const AdminPage = () => {
  const router = useRouter();
  const { setJwt } = useAuthStore();

  const [ email, setEmail ] = useState( '' );
  const [ password, setPassword ] = useState( '' );

  const handleSubmit = async ( e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault();

    const data = await loginUser( email, password );
    if( data ) {
      if( data.code === '00' ) {
        toast.success( data.message );
        setJwt( data.data );
        setTimeout(() => router.push( '/admin/dashboard' ), 1000)
      } else {
        toast.error( data.message );        
      }
    }
  };

  return (
    <div className='p-4 w-full flex justify-center items-center mt-4 md:mt-0'>
      <div className="max-w-md w-full space-y-8 bg-card p-10 rounded-2xl shadow-2xl border border-gray-100 dark:border-black">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-primary">
            Admin Dashboard
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your administrative account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={ handleSubmit }>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="text"
                required
                value={ email }
                onChange={ ( e ) => setEmail( e.target.value ) }
                className="appearance-none rounded-t-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-1"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={ ( e ) => setPassword( e.target.value ) }
                className="appearance-none rounded-b-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-1"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Sign In
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <a href="#" className="font-medium text-orange-600 hover:text-orange-500">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  )
}

export default AdminPage