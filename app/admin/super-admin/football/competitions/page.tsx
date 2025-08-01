'use client'

import Link from 'next/link';
import { getAllCompetitions, createCompetition, updateCompetition, deleteCompetition } from '@/lib/requests/v2/admin/super-admin/live-management/requests';
import { checkSuperAdminStatus } from '@/lib/requests/v2/authentication/requests';
import { IV2FootballCompetition } from '@/utils/V2Utils/v2requestData.types';
import { CompetitionTypes, CompetitionStatus } from '@/utils/V2Utils/v2requestData.enums';
import { ArrowLeft, Calendar, Clock, Edit, Plus, Search, Trash2, Trophy, Users, Star, AlertCircle, CheckCircle, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Loader } from '@/components/ui/loader';

type CompetitionFormData = {
    name: string;
    shorthand: string;
    type: CompetitionTypes;
    season: string;
    startDate: string;
    endDate: string;
    registrationDeadline: string;
    description: string;
}

const initialFormData: CompetitionFormData = {
    name: '',
    shorthand: '',
    type: CompetitionTypes.LEAGUE,
    season: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    description: ''
};

const SuperAdminCompetitionsPage = () => {
    const router = useRouter();
    
    const [loading, setLoading] = useState<boolean>(true);
    const [competitions, setCompetitions] = useState<IV2FootballCompetition[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [selectedCompetition, setSelectedCompetition] = useState<IV2FootballCompetition | null>(null);
    const [formData, setFormData] = useState<CompetitionFormData>(initialFormData);

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

            // Fetch competitions data
            const competitionsData = await getAllCompetitions();

            if (competitionsData && competitionsData.data) {
                setCompetitions(competitionsData.data.competitions || competitionsData.data);
            }

            setLoading(false);
        }

        if (loading) fetchData();
    }, [loading, router]);

    if (loading) {
        return <Loader />
    };
    // End of On Load //

    // Filter competitions based on search, status, and type
    const filteredCompetitions = competitions.filter(competition => {
        const matchesSearch = 
            competition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            competition.shorthand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            competition.season.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || competition.status === statusFilter;
        const matchesType = typeFilter === 'all' || competition.type === typeFilter;
        
        return matchesSearch && matchesStatus && matchesType;
    });

    const handleCreateCompetition = async () => {
        if (!formData.name || !formData.shorthand || !formData.season || 
            !formData.startDate || !formData.endDate || !formData.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
            toast.error('End date must be after start date');
            return;
        }

        const data = await createCompetition(formData);
        if (data && data.code === '00') {
            toast.success(data.message);
            setFormData(initialFormData);
            setShowCreateModal(false);
            setLoading(true);
        } else {
            toast.error(data?.message || 'Failed to create competition');
        }
    };

    const handleUpdateCompetition = async () => {
        if (!selectedCompetition) return;

        const updateData = {
            name: formData.name || undefined,
            shorthand: formData.shorthand || undefined,
            season: formData.season || undefined,
            startDate: formData.startDate || undefined,
            endDate: formData.endDate || undefined,
            registrationDeadline: formData.registrationDeadline || undefined,
            description: formData.description || undefined
        };

        const data = await updateCompetition(selectedCompetition._id, updateData);
        if (data && data.code === '00') {
            toast.success(data.message);
            setFormData(initialFormData);
            setShowEditModal(false);
            setSelectedCompetition(null);
            setLoading(true);
        } else {
            toast.error(data?.message || 'Failed to update competition');
        }
    };

    const handleDeleteCompetition = async (competitionId: string) => {
        if (!confirm('Are you sure you want to delete this competition? This action cannot be undone.')) return;

        const data = await deleteCompetition(competitionId);
        if (data && data.code === '00') {
            toast.success(data.message);
            setLoading(true);
        } else {
            toast.error(data?.message || 'Failed to delete competition');
        }
    };

    const handleStatusUpdate = async (competitionId: string, newStatus: CompetitionStatus) => {
        const data = await updateCompetition(competitionId, { status: newStatus });
        if (data && data.code === '00') {
            toast.success(`Competition status updated to ${newStatus}`);
            setLoading(true);
        } else {
            toast.error(data?.message || 'Failed to update status');
        }
    };

    const openEditModal = (competition: IV2FootballCompetition) => {
        setSelectedCompetition(competition);
        setFormData({
            name: competition.name,
            shorthand: competition.shorthand,
            type: competition.type,
            season: competition.season,
            startDate: new Date(competition.startDate).toISOString().slice(0, 16),
            endDate: new Date(competition.endDate).toISOString().slice(0, 16),
            registrationDeadline: competition.registrationDeadline ? 
                new Date(competition.registrationDeadline).toISOString().slice(0, 16) : '',
            description: competition.description
        });
        setShowEditModal(true);
    };

    const getStatusColor = (status: CompetitionStatus) => {
        switch (status) {
            case CompetitionStatus.UPCOMING:
                return 'text-blue-600 bg-blue-100';
            case CompetitionStatus.ONGOING:
                return 'text-green-600 bg-green-100';
            case CompetitionStatus.COMPLETED:
                return 'text-gray-600 bg-gray-100';
            case CompetitionStatus.CANCELLED:
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getTypeColor = (type: CompetitionTypes) => {
        switch (type) {
            case CompetitionTypes.LEAGUE:
                return 'text-purple-600 bg-purple-100';
            case CompetitionTypes.KNOCKOUT:
                return 'text-orange-600 bg-orange-100';
            case CompetitionTypes.HYBRID:
                return 'text-indigo-600 bg-indigo-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
                        <h1 className='text-2xl font-bold'>Competition Management</h1>
                        <p className='text-muted-foreground'>Create and manage all competitions</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200'
                >
                    <Plus className='w-4 h-4' />
                    Create Competition
                </button>
            </div>

            {/* Filters */}
            <div className='flex flex-col md:flex-row gap-4'>
                <div className='relative flex-1'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                    <input
                        type='text'
                        placeholder='Search competitions...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 transition-colors duration-200'
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 hover:bg-gray-50 transition-colors duration-200 cursor-pointer min-w-[140px]'
                >
                    <option value='all' className='text-gray-900'>All Status</option>
                    <option value={CompetitionStatus.UPCOMING} className='text-gray-900'>Upcoming</option>
                    <option value={CompetitionStatus.ONGOING} className='text-gray-900'>Ongoing</option>
                    <option value={CompetitionStatus.COMPLETED} className='text-gray-900'>Completed</option>
                    <option value={CompetitionStatus.CANCELLED} className='text-gray-900'>Cancelled</option>
                </select>
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 hover:bg-gray-50 transition-colors duration-200 cursor-pointer min-w-[140px]'
                >
                    <option value='all' className='text-gray-900'>All Types</option>
                    <option value={CompetitionTypes.LEAGUE} className='text-gray-900'>League</option>
                    <option value={CompetitionTypes.KNOCKOUT} className='text-gray-900'>Knockout</option>
                    <option value={CompetitionTypes.HYBRID} className='text-gray-900'>Hybrid</option>
                </select>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <div className='p-4 border rounded-lg'>
                    <div className='flex items-center gap-2'>
                        <Trophy className='w-5 h-5 text-blue-500' />
                        <span className='text-sm text-muted-foreground'>Total Competitions</span>
                    </div>
                    <p className='text-2xl font-bold'>{competitions.length}</p>
                </div>
                <div className='p-4 border rounded-lg'>
                    <div className='flex items-center gap-2'>
                        <Play className='w-5 h-5 text-green-500' />
                        <span className='text-sm text-muted-foreground'>Ongoing</span>
                    </div>
                    <p className='text-2xl font-bold'>
                        {competitions.filter(c => c.status === CompetitionStatus.ONGOING).length}
                    </p>
                </div>
                <div className='p-4 border rounded-lg'>
                    <div className='flex items-center gap-2'>
                        <Clock className='w-5 h-5 text-yellow-500' />
                        <span className='text-sm text-muted-foreground'>Upcoming</span>
                    </div>
                    <p className='text-2xl font-bold'>
                        {competitions.filter(c => c.status === CompetitionStatus.UPCOMING).length}
                    </p>
                </div>
                <div className='p-4 border rounded-lg'>
                    <div className='flex items-center gap-2'>
                        <CheckCircle className='w-5 h-5 text-gray-500' />
                        <span className='text-sm text-muted-foreground'>Completed</span>
                    </div>
                    <p className='text-2xl font-bold'>
                        {competitions.filter(c => c.status === CompetitionStatus.COMPLETED).length}
                    </p>
                </div>
            </div>

            {/* Competitions List */}
            <div className='space-y-4'>
                {filteredCompetitions.length === 0 ? (
                    <div className='text-center py-12'>
                        <Trophy className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                        <h3 className='text-lg font-semibold text-gray-600'>No competitions found</h3>
                        <p className='text-gray-500'>Try adjusting your search or filters</p>
                    </div>
                ) : (
                    filteredCompetitions.map((competition) => (
                        <div key={competition._id} className='border rounded-lg p-4 hover:shadow-md transition-shadow'>
                            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                                <div className='flex-1'>
                                    <div className='flex items-center gap-4 mb-2'>
                                        <h3 className='text-lg font-semibold'>{competition.name}</h3>
                                        <span className='text-sm text-gray-500'>({competition.shorthand})</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(competition.status)}`}>
                                            {competition.status.toUpperCase()}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(competition.type)}`}>
                                            {competition.type.toUpperCase()}
                                        </span>
                                        {competition.isFeatured && (
                                            <span className='px-2 py-1 rounded-full text-xs font-medium text-yellow-600 bg-yellow-100'>
                                                <Star className='w-3 h-3 inline mr-1' />
                                                FEATURED
                                            </span>
                                        )}
                                    </div>

                                    <p className='text-gray-600 mb-3'>{competition.description}</p>

                                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground'>
                                        <div>
                                            <span className='font-medium'>Season:</span>
                                            <p>{competition.season}</p>
                                        </div>
                                        <div>
                                            <span className='font-medium'>Start Date:</span>
                                            <p>{formatDate(competition.startDate.toString())}</p>
                                        </div>
                                        <div>
                                            <span className='font-medium'>End Date:</span>
                                            <p>{formatDate(competition.endDate.toString())}</p>
                                        </div>
                                        <div>
                                            <span className='font-medium'>Teams:</span>
                                            <p>{competition.teams?.length || 0} teams</p>
                                        </div>
                                    </div>

                                    {competition.registrationDeadline && (
                                        <div className='mt-2 text-sm text-muted-foreground'>
                                            <span className='font-medium'>Registration Deadline:</span>
                                            <span className='ml-1'>{formatDate(competition.registrationDeadline.toString())}</span>
                                        </div>
                                    )}
                                </div>

                                <div className='flex items-center gap-2'>
                                    {competition.status === CompetitionStatus.UPCOMING && (
                                        <button
                                            onClick={() => handleStatusUpdate(competition._id, CompetitionStatus.ONGOING)}
                                            className='px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors duration-200'
                                        >
                                            Start
                                        </button>
                                    )}
                                    {competition.status === CompetitionStatus.ONGOING && (
                                        <button
                                            onClick={() => handleStatusUpdate(competition._id, CompetitionStatus.COMPLETED)}
                                            className='px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors duration-200'
                                        >
                                            Complete
                                        </button>
                                    )}
                                    <button
                                        onClick={() => openEditModal(competition)}
                                        className='p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors duration-200'
                                    >
                                        <Edit className='w-4 h-4' />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCompetition(competition._id)}
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

            {/* Create Competition Modal */}
            {showCreateModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto'>
                        {/* Modal Header */}
                        <div className='flex items-center justify-between p-6 border-b'>
                            <h2 className='text-xl font-bold text-gray-900'>Create New Competition</h2>
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
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Competition Name <span className='text-red-500'>*</span>
                                    </label>
                                    <input
                                        type='text'
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500'
                                        placeholder='Enter competition name'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Shorthand <span className='text-red-500'>*</span>
                                    </label>
                                    <input
                                        type='text'
                                        value={formData.shorthand}
                                        onChange={(e) => setFormData({...formData, shorthand: e.target.value})}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500'
                                        placeholder='e.g., EPL, UCL'
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Competition Type <span className='text-red-500'>*</span>
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value as CompetitionTypes})}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
                                    >
                                        <option value={CompetitionTypes.LEAGUE} className='text-gray-900'>League</option>
                                        <option value={CompetitionTypes.KNOCKOUT} className='text-gray-900'>Knockout</option>
                                        <option value={CompetitionTypes.HYBRID} className='text-gray-900'>Hybrid</option>
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Season <span className='text-red-500'>*</span>
                                    </label>
                                    <input
                                        type='text'
                                        value={formData.season}
                                        onChange={(e) => setFormData({...formData, season: e.target.value})}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500'
                                        placeholder='e.g., 2023/24'
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Start Date <span className='text-red-500'>*</span>
                                    </label>
                                    <input
                                        type='datetime-local'
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        End Date <span className='text-red-500'>*</span>
                                    </label>
                                    <input
                                        type='datetime-local'
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Registration Deadline</label>
                                <input
                                    type='datetime-local'
                                    value={formData.registrationDeadline}
                                    onChange={(e) => setFormData({...formData, registrationDeadline: e.target.value})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Description <span className='text-red-500'>*</span>
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white text-gray-900 placeholder-gray-500'
                                    rows={3}
                                    placeholder='Enter competition description'
                                />
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
                                onClick={handleCreateCompetition}
                                className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
                            >
                                Create Competition
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Competition Modal */}
            {showEditModal && selectedCompetition && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto'>
                        {/* Modal Header */}
                        <div className='flex items-center justify-between p-6 border-b'>
                            <h2 className='text-xl font-bold text-gray-900'>Edit Competition</h2>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedCompetition(null);
                                    setFormData(initialFormData);
                                }}
                                className='text-gray-400 hover:text-gray-600 text-2xl font-bold'
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className='p-6 space-y-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Competition Name</label>
                                    <input
                                        type='text'
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500'
                                        placeholder='Enter competition name'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Shorthand</label>
                                    <input
                                        type='text'
                                        value={formData.shorthand}
                                        onChange={(e) => setFormData({...formData, shorthand: e.target.value})}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500'
                                        placeholder='e.g., EPL, UCL'
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Season</label>
                                <input
                                    type='text'
                                    value={formData.season}
                                    onChange={(e) => setFormData({...formData, season: e.target.value})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500'
                                    placeholder='e.g., 2023/24'
                                />
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Start Date</label>
                                    <input
                                        type='datetime-local'
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>End Date</label>
                                    <input
                                        type='datetime-local'
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Registration Deadline</label>
                                <input
                                    type='datetime-local'
                                    value={formData.registrationDeadline}
                                    onChange={(e) => setFormData({...formData, registrationDeadline: e.target.value})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white text-gray-900 placeholder-gray-500'
                                    rows={3}
                                    placeholder='Enter competition description'
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className='flex gap-3 p-6 border-t bg-gray-50'>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedCompetition(null);
                                    setFormData(initialFormData);
                                }}
                                className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateCompetition}
                                className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
                            >
                                Update Competition
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminCompetitionsPage;
