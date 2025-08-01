'use client'

import Link from 'next/link';
import { getAllPlayers, getUnverifiedPlayers, createPlayer, updatePlayer, deletePlayer, verifyPlayerRegistration } from '@/lib/requests/v2/admin/super-admin/player-management/requests';
import { getAllTeams, getAllDepartments } from '@/lib/requests/v2/admin/super-admin/team/requests';
import { checkSuperAdminStatus } from '@/lib/requests/v2/authentication/requests';
import { TeamPlayerDetails, IV2FootballTeam } from '@/utils/V2Utils/v2requestData.types';
import { PlayerCreateFormDetails, PlayerUpdateDetails, PlayerVerificationDetails } from '@/utils/V2Utils/formData';
import { FavoriteFoot, PlayerRole } from '@/utils/V2Utils/v2requestData.enums';
import { ArrowLeft, CheckCircle, Clock, Edit, Eye, Plus, Search, Shield, Trash2, UserCheck, UserPlus, Users, X, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Loader } from '@/components/ui/loader';

type PlayerFormData = {
    name: string;
    department: string;
    admissionYear: string;
    preferredFoot: FavoriteFoot;
    height: string;
    weight: string;
}

type Department = {
    _id: string;
    name: string;
    faculty: string;
}

const initialFormData: PlayerFormData = {
    name: '',
    department: '',
    admissionYear: '',
    preferredFoot: FavoriteFoot.RIGHT,
    height: '',
    weight: ''
};

const SuperAdminPlayersPage = () => {
    const router = useRouter();
    
    const [loading, setLoading] = useState<boolean>(true);
    const [players, setPlayers] = useState<TeamPlayerDetails[]>([]);
    const [unverifiedPlayers, setUnverifiedPlayers] = useState<TeamPlayerDetails[]>([]);
    const [teams, setTeams] = useState<IV2FootballTeam[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [activeTab, setActiveTab] = useState<'verified' | 'unverified'>('verified');
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
    const [selectedPlayer, setSelectedPlayer] = useState<TeamPlayerDetails | null>(null);
    const [formData, setFormData] = useState<PlayerFormData>(initialFormData);
    const [verificationData, setVerificationData] = useState<PlayerVerificationDetails>({ status: 'verified', reason: '' });

    // On Load //
    useEffect(() => {
        const fetchData = async () => {
            const request = await checkSuperAdminStatus();
            if (request?.code === '99') {
                if (request.message === 'Invalid or Expired Token' || request.message === 'Login Required') {
                    toast.error('Please Login First')
                    router.push('/auth/login')
                } else if (request.message === 'Invalid User Permissions') {
                    toast.error('Unauthorized')
                    router.push('/sports');
                } else {
                    toast.error('Unknown')
                    router.push('/');
                }
            }

            // Fetch all data
            const [playersData, unverifiedData, teamsData, departmentsData] = await Promise.all([
                getAllPlayers(),
                getUnverifiedPlayers(),
                getAllTeams(),
                getAllDepartments()
            ]);

            if (playersData && playersData.data) {
                setPlayers(playersData.data.players || playersData.data);
            }
            if (unverifiedData && unverifiedData.data) {
                setUnverifiedPlayers(unverifiedData.data.players || unverifiedData.data);
            }
            if (teamsData && teamsData.data) {
                setTeams(teamsData.data.teams || teamsData.data);
            }
            if (departmentsData && departmentsData.data) {
                setDepartments(departmentsData.data.departments || departmentsData.data);
            }

            setLoading(false);
        }

        if (loading) fetchData();
    }, [loading, router]);

    if (loading) {
        return <Loader />
    };
    // End of On Load //

    // Get current players list based on active tab
    const currentPlayers = activeTab === 'verified' ? players : unverifiedPlayers;

    // Filter players based on search and status
    const filteredPlayers = currentPlayers.filter(player => {
        const matchesSearch = 
            player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            player.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            player.admissionYear.includes(searchTerm);
        
        const matchesStatus = statusFilter === 'all' || player.verificationStatus === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const handleCreatePlayer = async () => {
        if (!formData.name || !formData.department || !formData.admissionYear) {
            toast.error('Please fill in all required fields');
            return;
        }

        const playerData: PlayerCreateFormDetails = {
            name: formData.name,
            department: formData.department,
            admissionYear: formData.admissionYear,
            preferredFoot: formData.preferredFoot,
            height: formData.height || undefined,
            weight: formData.weight || undefined
        };

        const data = await createPlayer(playerData);
        if (data && data.code === '00') {
            toast.success(data.message);
            setFormData(initialFormData);
            setShowCreateModal(false);
            setLoading(true);
        } else {
            toast.error(data?.message || 'Failed to create player');
        }
    };

    const handleUpdatePlayer = async () => {
        if (!selectedPlayer) return;

        const updateData: PlayerUpdateDetails = {
            name: formData.name || undefined,
            admissionYear: formData.admissionYear || undefined,
            preferredFoot: formData.preferredFoot,
            height: formData.height || undefined,
            weight: formData.weight || undefined
        };

        const data = await updatePlayer(selectedPlayer._id, updateData);
        if (data && data.code === '00') {
            toast.success(data.message);
            setFormData(initialFormData);
            setShowEditModal(false);
            setSelectedPlayer(null);
            setLoading(true);
        } else {
            toast.error(data?.message || 'Failed to update player');
        }
    };

    const handleDeletePlayer = async (playerId: string) => {
        if (!confirm('Are you sure you want to delete this player?')) return;

        const data = await deletePlayer(playerId);
        if (data && data.code === '00') {
            toast.success(data.message);
            setLoading(true);
        } else {
            toast.error(data?.message || 'Failed to delete player');
        }
    };

    const handleVerifyPlayer = async () => {
        if (!selectedPlayer) return;

        if (verificationData.status === 'rejected' && !verificationData.reason) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        const data = await verifyPlayerRegistration(selectedPlayer._id, verificationData);
        if (data && data.code === '00') {
            toast.success(data.message);
            setVerificationData({ status: 'verified', reason: '' });
            setShowVerifyModal(false);
            setSelectedPlayer(null);
            setLoading(true);
        } else {
            toast.error(data?.message || 'Failed to verify player');
        }
    };

    const openEditModal = (player: TeamPlayerDetails) => {
        setSelectedPlayer(player);
        setFormData({
            name: player.name,
            department: player.department,
            admissionYear: player.admissionYear,
            preferredFoot: player.preferredFoot as FavoriteFoot,
            height: player.height || '',
            weight: player.weight || ''
        });
        setShowEditModal(true);
    };

    const openVerifyModal = (player: TeamPlayerDetails) => {
        setSelectedPlayer(player);
        setShowVerifyModal(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified':
                return 'text-green-600 bg-green-100';
            case 'pending':
                return 'text-yellow-600 bg-yellow-100';
            case 'rejected':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'captain':
                return 'text-blue-600 bg-blue-100';
            case 'vice-captain':
                return 'text-purple-600 bg-purple-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <Link 
                        href='/admin/super-admin/football/dashboard' 
                        className='p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-600 hover:text-gray-900'
                    >
                        <ArrowLeft className='w-5 h-5' />
                    </Link>
                    <div>
                        <h1 className='text-2xl font-bold'>Player Management</h1>
                        <p className='text-muted-foreground'>Verify and manage all players</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200'
                >
                    <Plus className='w-4 h-4' />
                    Create Player
                </button>
            </div>

            {/* Tabs */}
            <div className='flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit'>
                <button
                    onClick={() => setActiveTab('verified')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        activeTab === 'verified'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <div className='flex items-center gap-2'>
                        <UserCheck className='w-4 h-4' />
                        Verified Players ({players.length})
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('unverified')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        activeTab === 'unverified'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <div className='flex items-center gap-2'>
                        <Clock className='w-4 h-4' />
                        Pending Verification ({unverifiedPlayers.length})
                    </div>
                </button>
            </div>

            {/* Filters */}
            <div className='flex flex-col md:flex-row gap-4'>
                <div className='relative flex-1'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                    <input
                        type='text'
                        placeholder='Search players...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 transition-colors duration-200'
                    />
                </div>
                {activeTab === 'unverified' && (
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 hover:bg-gray-50 transition-colors duration-200 cursor-pointer min-w-[140px]'
                    >
                        <option value='all' className='text-gray-900'>All Status</option>
                        <option value='pending' className='text-gray-900'>Pending</option>
                        <option value='verified' className='text-gray-900'>Verified</option>
                        <option value='rejected' className='text-gray-900'>Rejected</option>
                    </select>
                )}
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <div className='p-4 border rounded-lg'>
                    <div className='flex items-center gap-2'>
                        <Users className='w-5 h-5 text-blue-500' />
                        <span className='text-sm text-muted-foreground'>Total Players</span>
                    </div>
                    <p className='text-2xl font-bold'>{players.length}</p>
                </div>
                <div className='p-4 border rounded-lg'>
                    <div className='flex items-center gap-2'>
                        <Clock className='w-5 h-5 text-yellow-500' />
                        <span className='text-sm text-muted-foreground'>Pending Verification</span>
                    </div>
                    <p className='text-2xl font-bold'>{unverifiedPlayers.length}</p>
                </div>
                <div className='p-4 border rounded-lg'>
                    <div className='flex items-center gap-2'>
                        <CheckCircle className='w-5 h-5 text-green-500' />
                        <span className='text-sm text-muted-foreground'>Verified</span>
                    </div>
                    <p className='text-2xl font-bold'>
                        {players.filter(p => p.verificationStatus === 'verified').length}
                    </p>
                </div>
                <div className='p-4 border rounded-lg'>
                    <div className='flex items-center gap-2'>
                        <Shield className='w-5 h-5 text-purple-500' />
                        <span className='text-sm text-muted-foreground'>Captains</span>
                    </div>
                    <p className='text-2xl font-bold'>
                        {players.filter(p => p.role === 'captain' || p.role === 'vice-captain').length}
                    </p>
                </div>
            </div>

            {/* Players List */}
            <div className='space-y-4'>
                {filteredPlayers.length === 0 ? (
                    <div className='text-center py-12'>
                        <Users className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                        <h3 className='text-lg font-semibold text-gray-600'>No players found</h3>
                        <p className='text-gray-500'>Try adjusting your search or filters</p>
                    </div>
                ) : (
                    filteredPlayers.map((player) => (
                        <div key={player._id} className='border rounded-lg p-4 hover:shadow-md transition-shadow'>
                            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                                <div className='flex-1'>
                                    <div className='flex items-center gap-4 mb-2'>
                                        <h3 className='text-lg font-semibold'>{player.name}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(player.verificationStatus)}`}>
                                            {player.verificationStatus.toUpperCase()}
                                        </span>
                                        {player.role !== 'player' && (
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(player.role)}`}>
                                                {player.role.replace('_', ' ').toUpperCase()}
                                            </span>
                                        )}
                                    </div>

                                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground'>
                                        <div>
                                            <span className='font-medium'>Department:</span>
                                            <p>{player.department}</p>
                                        </div>
                                        <div>
                                            <span className='font-medium'>Admission Year:</span>
                                            <p>{player.admissionYear}</p>
                                        </div>
                                        <div>
                                            <span className='font-medium'>Position:</span>
                                            <p>{player.position || 'Not assigned'}</p>
                                        </div>
                                        <div>
                                            <span className='font-medium'>Jersey Number:</span>
                                            <p>{player.jerseyNumber || 'Not assigned'}</p>
                                        </div>
                                    </div>

                                    {player.height && player.weight && (
                                        <div className='flex gap-4 mt-2 text-sm text-muted-foreground'>
                                            <span>Height: {player.height}</span>
                                            <span>Weight: {player.weight}</span>
                                            <span>Preferred Foot: {player.preferredFoot}</span>
                                        </div>
                                    )}
                                </div>

                                <div className='flex items-center gap-2'>
                                    {activeTab === 'unverified' && player.verificationStatus === 'pending' && (
                                        <button
                                            onClick={() => openVerifyModal(player)}
                                            className='px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors duration-200'
                                        >
                                            Verify
                                        </button>
                                    )}
                                    <button
                                        onClick={() => openEditModal(player)}
                                        className='p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors duration-200'
                                    >
                                        <Edit className='w-4 h-4' />
                                    </button>
                                    <button
                                        onClick={() => handleDeletePlayer(player._id)}
                                        className='p-2 text-red-600 hover:bg-red-100 rounded transition-colors duration-200'
                                    >
                                        <Trash2 className='w-4 h-4' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Player Modal */}
            {showCreateModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto'>
                        {/* Modal Header */}
                        <div className='flex items-center justify-between p-6 border-b'>
                            <h2 className='text-xl font-bold text-gray-900'>Create New Player</h2>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setFormData(initialFormData);
                                }}
                                className='text-gray-400 hover:text-gray-600 text-2xl font-bold'
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className='p-6 space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Player Name <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500'
                                    placeholder='Enter player name'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Department <span className='text-red-500'>*</span>
                                </label>
                                <select
                                    value={formData.department}
                                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
                                >
                                    <option value='' className='text-gray-500'>Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept._id} value={dept.name} className='text-gray-900'>{dept.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Admission Year <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    value={formData.admissionYear}
                                    onChange={(e) => setFormData({...formData, admissionYear: e.target.value})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500'
                                    placeholder='e.g., 2023'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Preferred Foot</label>
                                <select
                                    value={formData.preferredFoot}
                                    onChange={(e) => setFormData({...formData, preferredFoot: e.target.value as FavoriteFoot})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
                                >
                                    <option value={FavoriteFoot.RIGHT} className='text-gray-900'>Right</option>
                                    <option value={FavoriteFoot.LEFT} className='text-gray-900'>Left</option>
                                    <option value={FavoriteFoot.BOTH} className='text-gray-900'>Both</option>
                                </select>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Height</label>
                                    <input
                                        type='text'
                                        value={formData.height}
                                        onChange={(e) => setFormData({...formData, height: e.target.value})}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500'
                                        placeholder='e.g., 180cm'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Weight</label>
                                    <input
                                        type='text'
                                        value={formData.weight}
                                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500'
                                        placeholder='e.g., 75kg'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className='flex gap-3 p-6 border-t bg-gray-50'>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setFormData(initialFormData);
                                }}
                                className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreatePlayer}
                                className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
                            >
                                Create Player
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Player Modal */}
            {showEditModal && selectedPlayer && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto'>
                        {/* Modal Header */}
                        <div className='flex items-center justify-between p-6 border-b'>
                            <h2 className='text-xl font-bold text-gray-900'>Edit Player</h2>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedPlayer(null);
                                    setFormData(initialFormData);
                                }}
                                className='text-gray-400 hover:text-gray-600 text-2xl font-bold'
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className='p-6 space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Player Name</label>
                                <input
                                    type='text'
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500'
                                    placeholder='Enter player name'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Admission Year</label>
                                <input
                                    type='text'
                                    value={formData.admissionYear}
                                    onChange={(e) => setFormData({...formData, admissionYear: e.target.value})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500'
                                    placeholder='e.g., 2023'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Preferred Foot</label>
                                <select
                                    value={formData.preferredFoot}
                                    onChange={(e) => setFormData({...formData, preferredFoot: e.target.value as FavoriteFoot})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
                                >
                                    <option value={FavoriteFoot.RIGHT} className='text-gray-900'>Right</option>
                                    <option value={FavoriteFoot.LEFT} className='text-gray-900'>Left</option>
                                    <option value={FavoriteFoot.BOTH} className='text-gray-900'>Both</option>
                                </select>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Height</label>
                                    <input
                                        type='text'
                                        value={formData.height}
                                        onChange={(e) => setFormData({...formData, height: e.target.value})}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500'
                                        placeholder='e.g., 180cm'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Weight</label>
                                    <input
                                        type='text'
                                        value={formData.weight}
                                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500'
                                        placeholder='e.g., 75kg'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className='flex gap-3 p-6 border-t bg-gray-50'>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedPlayer(null);
                                    setFormData(initialFormData);
                                }}
                                className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdatePlayer}
                                className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
                            >
                                Update Player
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Verify Player Modal */}
            {showVerifyModal && selectedPlayer && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-lg shadow-xl w-full max-w-md'>
                        {/* Modal Header */}
                        <div className='flex items-center justify-between p-6 border-b'>
                            <div>
                                <h2 className='text-xl font-bold text-gray-900'>Verify Player</h2>
                                <p className='text-sm text-gray-600 mt-1'>{selectedPlayer.name}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowVerifyModal(false);
                                    setSelectedPlayer(null);
                                    setVerificationData({ status: 'verified', reason: '' });
                                }}
                                className='text-gray-400 hover:text-gray-600 text-2xl font-bold'
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className='p-6 space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Verification Status</label>
                                <div className='space-y-2'>
                                    <label className='flex items-center'>
                                        <input
                                            type='radio'
                                            name='status'
                                            value='verified'
                                            checked={verificationData.status === 'verified'}
                                            onChange={(e) => setVerificationData({...verificationData, status: e.target.value as 'verified' | 'rejected'})}
                                            className='mr-2'
                                        />
                                        <CheckCircle className='w-4 h-4 text-green-500 mr-2' />
                                        Approve Player
                                    </label>
                                    <label className='flex items-center'>
                                        <input
                                            type='radio'
                                            name='status'
                                            value='rejected'
                                            checked={verificationData.status === 'rejected'}
                                            onChange={(e) => setVerificationData({...verificationData, status: e.target.value as 'verified' | 'rejected'})}
                                            className='mr-2'
                                        />
                                        <XCircle className='w-4 h-4 text-red-500 mr-2' />
                                        Reject Player
                                    </label>
                                </div>
                            </div>

                            {verificationData.status === 'rejected' && (
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Reason for Rejection <span className='text-red-500'>*</span>
                                    </label>
                                    <textarea
                                        value={verificationData.reason || ''}
                                        onChange={(e) => setVerificationData({...verificationData, reason: e.target.value})}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none bg-white text-gray-900 placeholder-gray-500'
                                        rows={3}
                                        placeholder='Please provide a reason for rejection'
                                    />
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className='flex gap-3 p-6 border-t bg-gray-50'>
                            <button
                                onClick={() => {
                                    setShowVerifyModal(false);
                                    setSelectedPlayer(null);
                                    setVerificationData({ status: 'verified', reason: '' });
                                }}
                                className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleVerifyPlayer}
                                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors font-medium ${
                                    verificationData.status === 'verified'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                {verificationData.status === 'verified' ? 'Approve' : 'Reject'} Player
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminPlayersPage;
