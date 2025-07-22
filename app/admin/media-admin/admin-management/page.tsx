'use client'

import PopUpModal from '@/components/modal/PopUpModal';
import { Loader } from '@/components/ui/loader';
import { getMediaAdmins } from '@/lib/requests/v2/admin/super-admin/admin-management/requests';
import { checkHeadMediaAdminStatus, registerAdmin } from '@/lib/requests/v2/authentication/requests';
import { UserStatus } from '@/utils/V2Utils/v2requestData.enums';
import { IV2User } from '@/utils/V2Utils/v2requestData.types';
import { ChevronDown, ChevronUp, Edit, HeartPulse, Lock, Plus, Save, Search, Settings, Shield, Unlock, Users, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

type NewAdminFormData = {
    name: string;
    email: string;
    role: UserRole;
    password: string
}

enum UserRole {
    MEDIA_ADMIN = 'media-admin',
    HEAD_MEDIA_ADMIN = 'head-media-admin',
}

const AdminManagementPage = () => {
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(true);
    const [query, setQuery] = useState<string>("");
    const [filter, setFilter] = useState<string>("all-types");
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const [admins, setAdmins] = useState<IV2User[]>([]);
    const [selectedAdmin, setSelectedAdmin] = useState<IV2User | null>(null);
    const [formData, setFormData] = useState<NewAdminFormData>({
        name: '',
        email: '',
        role: UserRole.MEDIA_ADMIN,
        password: ''
    });

    // On Load //
    useEffect( () => {
        const fetchData = async () => {
        const request = await checkHeadMediaAdminStatus();
        if( request?.code === '99' ) {
            if( request.message === 'Invalid or Expired Token' || request.message === 'Login Required' ) {
            toast.error('Please Login First')
            router.push('/auth/login')
            } else if ( request.message === 'Invalid User Permissions' ) {
            toast.error('Unauthorized')
            router.push('/sports');
            } else {
            toast.error('Unknown')
            router.push('/');
            }   
        }
        
        const adminData = await getMediaAdmins()

        if( adminData && adminData.data ) {
            setAdmins( adminData.data );
        }
        
        setLoading( false );
        }

        if( loading ) fetchData();
    }, [ loading ]);
    
    if( loading ) {
        return <Loader />
    };
    // End of On Load //

    // Search Bar Handlers //
    const handleClear = () => {
        setQuery("");
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Search for:", query);
    };
    const handleFilterClick = ( role: string ) => {
        setFilter( role );
        setFilterOpen( false );
    }
    // End of Search Bar Handlers //

    // Button Clicks //
    const handleAdminCreateClick = () => {
        setSelectedAdmin(null);
        setModalOpen(true);
    }
    const handleAdminCreate = async () => {
        const { name, email, password, role } = formData;
        
        const response = await registerAdmin( name, email, password, role );
        if( response?.code === '00' ) {
            toast.success(response.message || 'Admin Registered');
            setAdmins([...admins, response.data ]);
            handleModalClose();
        } else {
            toast.error(response?.message || 'Error Creating Admin');
            handleModalClose();
        }
    }
    const handleAdminUnsuspend = ( adminId: string ) => {

    }
    const handleAdminSuspend = ( adminId: string ) => {

    }
    const handleAdminEditClick = ( admin: IV2User ) => {
        setSelectedAdmin( admin );
    }
    const handleModalClose = () => {
        setModalOpen( false );
        setSelectedAdmin(null);
        setFormData({
            ...formData,
            email: '',
            name: '',
            password: ''
        })
    } 
    // End of Button Clicks //

    // Others //
    const filteredAdmins = admins.filter( admin => {
        if( filter === 'all-types' ) {
            return true
        } else {
            return admin.role === filter
        }
    });
    const disabledButton = formData.email === '' || formData.name === '' || formData.password === '';
    // End of Others //
  return (
    <div className='space-y-6 md:space-y-4'>
        {/* Header */}
        <div className=' flex items-center justify-between md:px-4 md:py-4 md:border md:rounded-lg'>
            <div>
                <h1 className='text-2xl font-bold'>Admin Management</h1>
                <p>Craete and manage media administrators</p>
            </div>
            <button
                onClick={ handleAdminCreateClick }
                className='px-4 py-2 text-center rounded-lg bg-emerald-500 md:flex gap-2 items-center hover:bg-emerald-500/50 hidden'
            >
                <Plus className='w-5 h-5' />
                Create Admin
            </button>
        </div>
        
        {/* Info Cards */}
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div className='px-4 py-2 md:py-4 flex justify-between items-center border border-emerald-500 rounded-lg'>
                    <div>
                        <p className='text-muted-foreground'>Total Admins</p>
                        <span className='text-lg font-bold'>{ admins.length }</span>
                    </div>
                    <Shield className='w-5 h-5 text-emerald-500' />
                </div>
                <div className='px-4 py-2 md:py-4 flex justify-between items-center border border-emerald-500 rounded-lg'>
                    <div>
                        <p className='text-muted-foreground'>Active Admins</p>
                        <span className='text-lg font-bold'>{ admins.filter(admin => admin.status === UserStatus.ACTIVE).length }</span>
                    </div>
                    <HeartPulse className='w-5 h-5 text-emerald-500' />
                </div>
                <div className='px-4 py-2 md:py-4 flex justify-between items-center border border-emerald-500 rounded-lg'>
                    <div>
                        <p className='text-muted-foreground'>Media Admins</p>
                        <span className='text-lg font-bold'>{ admins.filter(admin => admin.role === UserRole.MEDIA_ADMIN).length }</span>
                    </div>
                    <Settings className='w-5 h-5 text-emerald-500' />
                </div>
            </div>
        </div>

        {/* Search bar */}
        <div className='grid grid-cols-2 md:grid-cols-12 gap-4'>
            <form
                onSubmit={handleSubmit}
                className="flex items-center w-full px-4 py-2 border shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 col-span-2 md:col-span-9 rounded-md"
            >
                <Search className="w-5 h-5 text-muted-foreground mr-2" />

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search teams..."
                    className="flex-grow outline-none text-sm placeholder-muted-foreground bg-transparent"
                />

                {query && (
                    <button
                    type="button"
                    onClick={handleClear}
                    className="text-gray-400 hover:text-gray-600"
                    >
                    <X className="w-4 h-4" />
                    </button>
                )}
            </form>
            <div
                onClick={ () => setFilterOpen(!filterOpen) } 
                className='px-4 py-2 border border-emerald-500 flex justify-between items-center rounded-lg col-span-1 md:col-span-3 cursor-pointer capitalize'
            >
                { filter.replace('-', ' ') }
                { !filterOpen && <ChevronDown className='w-4 h-4 text-green-500' /> }
                { filterOpen && <ChevronUp className='w-4 h-4 text-green-500' /> }
            </div>
            <button
                onClick={ handleAdminCreateClick }
                className='px-4 py-2 text-center rounded-lg bg-emerald-500 flex gap-2 items-center justify-center hover:bg-emerald-500/50 md:hidden col-span-1'
            >
                <Plus className='w-5 h-5' />
                Create Admin
            </button>
            {
                filterOpen && (
                    <>
                        <div className='hidden md:block md:col-span-9'></div>
                        <div className='col-span-2 md:col-span-3'>
                            {
                                ['all-types', ...Object.values( UserRole )].map( role => (
                                    <p 
                                        key={role}
                                        onClick={ () => handleFilterClick( role ) }
                                        className={`
                                            px-4 py-1 my-2 cursor-pointer hover:text-green-500 ${
                                                filter === role && 'text-green-500'
                                            }
                                        `}
                                    >
                                        { role }
                                    </p>
                                ))
                            }
                        </div>                    
                    </>
                )
            }
        </div>

        {/* Admin List */}
        { 
            filteredAdmins && filteredAdmins.length > 0 && (
                <div className='px-4 py-4 border border-muted-foreground bg-card'>
                    {/* Title */}
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-2 items-center'>
                            <Shield className='w-5 h-5' />
                            <h2 className='text-lg font-bold'>Administrators({ filteredAdmins.length })</h2>
                        </div>
                    </div>
        
                    {/* Faculty Table */}
                    <div className='overflow-x-scroll scrollbar-hide'>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                <th className="text-left py-4 px-3 text-sm font-medium text-muted-foreground">Name</th>
                                <th className="text-left py-4 px-3 text-sm font-medium text-muted-foreground">Email</th>
                                <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">Role</th>
                                <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">Status</th>
                                <th className="text-left py-4 px-3 text-sm font-medium text-muted-foreground">Created</th>
                                <th className="text-left py-4 px-3 text-sm font-medium text-muted-foreground">Last Login</th>
                                <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filteredAdmins.map(admin => (
                                        <tr 
                                            key={ admin._id } 
                                            className="border-b border-border hover:bg-accent/50 transition-colors"
                                        >
                                            <td className="text-left py-4 px-3 text-sm">{ admin.name }</td>
                                            <td className="text-left py-4 px-3 text-sm">{ admin.email }</td>
                                            <td className="text-center py-4 px-3 text-sm">{ admin.role }</td>
                                            <td className="text-center py-4 px-3 text-sm">{ admin.status }</td>
                                            <td className="text-left py-4 px-3 text-sm">{ admin.createdAt.toLocaleString() }</td>
                                            <td className="text-left py-4 px-3 text-sm">{ admin.lastLogin?.toLocaleString() || 'unknown' }</td>
                                            <td className="text-center py-4 px-3 text-sm">
                                                <div className='flex items-center justify-center gap-4'>
                                                    <button
                                                        onClick={() => handleAdminEditClick( admin )}
                                                        className='text-emerald-500'
                                                    >
                                                        <Edit className='w-5 h-5' />
                                                    </button>
                                                    <button
                                                        onClick={() => admin.status === UserStatus.SUSPENDED ? handleAdminUnsuspend( admin._id ) : handleAdminSuspend( admin._id )}
                                                        className='text-red-500'
                                                    >
                                                        {
                                                            admin.status === UserStatus.SUSPENDED ? <Unlock className='w-5 h-5' /> : <Lock className='w-5 h-5' />
                                                        }
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        }

        {/* No Admins In Admin List */}
        {
            filteredAdmins.length === 0 && (
                <div className='border border-emerald-500 rounded-lg flex justify-center items-center flex-col gap-4 py-10'>
                    {/* No Teams */}
                    <Users className='w-8 h-8' />
                    <p className='font-bold'>No Admins Found</p>
                    <span className='text-sm text-muted-foreground'>Get started by creating your first admin</span>
                    <button
                        onClick={ handleAdminCreateClick }
                        className='px-4 py-2 text-center rounded-lg bg-emerald-500 md:flex gap-2 items-center hover:bg-emerald-500/50 hidden'
                    >
                        <Plus className='w-5 h-5' />
                        Create Admin
                    </button>
                </div>
            )
        }

        {/* PopUp Modal */}
        <PopUpModal 
            open={ modalOpen } 
            onClose={ handleModalClose }
        >
            <h2 className='text-lg font-bold mb-6'>Create New Admin</h2>
            <div className='space-y-4 text-left'>
                <div>
                    <label className="block font-semibold mb-1.5">Full Name</label>
                    <input
                        type='text'
                        placeholder='e.g. James Smith'
                        value={ formData.name }
                        onChange={
                            ( e ) => setFormData({
                                ...formData,
                                name: e.target.value
                            })
                        }
                        className='w-full p-2 border rounded bg-input'
                    />
                </div>
                <div>
                    <label className="block font-semibold mb-1.5">Email Address</label>
                    <input
                        type='email'
                        placeholder='e.g. admin@fupre.edu'
                        value={ formData.email }
                        onChange={
                            ( e ) => setFormData({
                                ...formData,
                                email: e.target.value
                            })
                        }
                        className='w-full p-2 border rounded bg-input'
                    />
                </div>
                <div>
                    <label className="block font-semibold mb-1.5">Admin Role</label>
                    <select 
                        className="w-full p-2 border rounded cursor-pointer bg-input"
                        value={ formData.role }
                        onChange={ (e) => setFormData({ 
                            ...formData,
                            role: e.target.value as UserRole
                        }) }
                    >
                        {
                            Object.values( UserRole ).map( role => (
                                <option key={ role } value={ role }>{ role }</option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    <label className="block font-semibold mb-1.5">Password</label>
                    <input
                        type='text'
                        placeholder='e.g. securePassword'
                        value={ formData.password }
                        onChange={
                            ( e ) => setFormData({
                                ...formData,
                                password: e.target.value
                            })
                        }
                        className='w-full p-2 border rounded bg-input'
                    />
                </div>
                <button 
                    onClick={handleAdminCreate}
                    className='py-2 rounded-lg flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-500/50 text-white w-full disabled:opacity-50 disabled:line-through'
                    disabled={ disabledButton }
                >
                    <Save className='w-5 h-5' />
                    Create Admin
                </button>
            </div>
        </PopUpModal>
    </div>
  )
}

export default AdminManagementPage