'use client'

import Link from 'next/link';
import { getAllFixtures, getAllCompetitions, updateFixture, deleteFixture, rescheduleFixture } from '@/lib/requests/v2/admin/super-admin/live-management/requests';
import { getAllTeams } from '@/lib/requests/v2/admin/super-admin/team/requests';
import { checkSuperAdminStatus } from '@/lib/requests/v2/authentication/requests';
import { PopIV2FootballFixture, IV2FootballCompetition, IV2FootballTeam } from '@/utils/V2Utils/v2requestData.types';
import { CompetitionTypes, FixtureStatus } from '@/utils/V2Utils/v2requestData.enums';
import { ArrowLeft, Calendar, Clock, Edit, MapPin, Plus, Search, Trash2, Users, Trophy, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Loader } from '@/components/ui/loader';
import { createCompetitionFixture } from '@/lib/requests/v2/admin/super-admin/competition/requests';

type FixtureFormData = {
    competition: string;
    homeTeam: string;
    awayTeam: string;
    matchType: string;
    stadium: string;
    groupId?: string;
    knockoutId?: string;
    scheduledDate: string;
    referee: string;
}
type CompetitionTables = IV2FootballCompetition['groupStage']
type CompetitionKnockouts = IV2FootballCompetition['knockoutRounds']

const initialFormData: FixtureFormData = {
    competition: '',
    homeTeam: '',
    awayTeam: '',
    matchType: 'league',
    groupId: '',
    knockoutId: '',
    stadium: '',
    scheduledDate: '',
    referee: ''
};

const SuperAdminFixturesPage = () => {
    const router = useRouter();
    
    const [loading, setLoading] = useState<boolean>(true);
    const [fixtures, setFixtures] = useState<PopIV2FootballFixture[]>([]);
    const [competitions, setCompetitions] = useState<IV2FootballCompetition[]>([]);
    const [competitionTables, setCompetitionTables] = useState<CompetitionTables>([]);
    const [competitionKnockouts, setCompetitionKnockouts] = useState<CompetitionKnockouts>([]);
    const [teams, setTeams] = useState<IV2FootballTeam[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showRescheduleModal, setShowRescheduleModal] = useState<boolean>(false);
    const [selectedFixture, setSelectedFixture] = useState<PopIV2FootballFixture | null>(null);
    const [formData, setFormData] = useState<FixtureFormData>(initialFormData);
    const [rescheduleData, setRescheduleData] = useState({ postponedReason: '', rescheduledDate: '' });

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
            const [fixturesData, competitionsData, teamsData] = await Promise.all([
                getAllFixtures(),
                getAllCompetitions(),
                getAllTeams()
            ]);

            if (fixturesData && fixturesData.data) {
                setFixtures(fixturesData.data.fixtures || fixturesData.data);
            }
            if (competitionsData && competitionsData.data) {
                setCompetitions(competitionsData.data.competitions || competitionsData.data);
            }
            if (teamsData && teamsData.data) {
                setTeams(teamsData.data.teams || teamsData.data);
            }

            setLoading(false);
        }

        if (loading) fetchData();
    }, [loading, router]);

    if (loading) {
        return <Loader />
    };
    // End of On Load //

    // Filter fixtures based on search and status
    const filteredFixtures = fixtures.filter(fixture => {
        const matchesSearch = 
            fixture.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fixture.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fixture.competition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fixture.stadium.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || fixture.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const handleCreateFixture = async () => {
        if (!formData.competition || !formData.homeTeam || !formData.awayTeam || 
            !formData.stadium || !formData.scheduledDate || !formData.referee) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (formData.homeTeam === formData.awayTeam) {
            toast.error('Home team and away team cannot be the same');
            return;
        }

        if(formData.matchType === 'group' && (!formData.groupId || formData.groupId === '')) {
            toast.error('Select A Group')
        }

        if(formData.matchType === 'knockout' && (!formData.knockoutId || formData.knockoutId === '')) {
            toast.error('Select A Knockout Round')
        }

        const finalForm = {
            homeTeam: formData.homeTeam,
            awayTeam: formData.awayTeam,
            stadium: formData.stadium,
            scheduledDate: new Date(formData.scheduledDate).toISOString(),
            referee: formData.referee,
            isDerby: false,
            isKnockoutRound: formData.matchType === 'knockout',
            isGroupFixture: formData.matchType === 'group',
            knockoutId: formData.knockoutId,
            groupId: formData.groupId,
        }

        const data = await createCompetitionFixture(finalForm, formData.competition);
        if (data && data.code === '00') {
            toast.success(data.message);
            setFormData(initialFormData);
            setShowCreateModal(false);
            setLoading(true);
        } else {
            toast.error(data?.message || 'Failed to create fixture');
        }
    };

    const handleUpdateFixture = async () => {
        if (!selectedFixture) return;

        const data = await updateFixture(selectedFixture._id, formData);
        if (data && data.code === '00') {
            toast.success(data.message);
            setFormData(initialFormData);
            setShowEditModal(false);
            setSelectedFixture(null);
            setLoading(true);
        } else {
            toast.error(data?.message || 'Failed to update fixture');
        }
    };

    const handleDeleteFixture = async (fixtureId: string) => {
        if (!confirm('Are you sure you want to delete this fixture?')) return;

        const data = await deleteFixture(fixtureId);
        if (data && data.code === '00') {
            toast.success(data.message);
            setLoading(true);
        } else {
            toast.error(data?.message || 'Failed to delete fixture');
        }
    };

    const handleRescheduleFixture = async () => {
        if (!selectedFixture || !rescheduleData.postponedReason || !rescheduleData.rescheduledDate) {
            toast.error('Please fill in all required fields');
            return;
        }

        const data = await rescheduleFixture(selectedFixture._id, rescheduleData.postponedReason, rescheduleData.rescheduledDate);
        if (data && data.code === '00') {
            toast.success(data.message);
            setRescheduleData({ postponedReason: '', rescheduledDate: '' });
            setShowRescheduleModal(false);
            setSelectedFixture(null);
            setLoading(true);
        } else {
            toast.error(data?.message || 'Failed to reschedule fixture');
        }
    };

    const openEditModal = (fixture: PopIV2FootballFixture) => {
        setSelectedFixture(fixture);
        setFormData({
            competition: fixture.competition._id,
            homeTeam: fixture.homeTeam._id,
            awayTeam: fixture.awayTeam._id,
            matchType: fixture.matchType,
            stadium: fixture.stadium,
            scheduledDate: new Date(fixture.scheduledDate).toISOString().slice(0, 16),
            referee: fixture.referee
        });
        setShowEditModal(true);
    };

    const openRescheduleModal = (fixture: PopIV2FootballFixture) => {
        setSelectedFixture(fixture);
        setShowRescheduleModal(true);
    };

    const getStatusColor = (status: FixtureStatus) => {
        switch (status) {
            case FixtureStatus.SCHEDULED:
                return 'text-blue-600 bg-blue-100';
            case FixtureStatus.LIVE:
                return 'text-red-600 bg-red-100';
            case FixtureStatus.COMPLETED:
                return 'text-green-600 bg-green-100';
            case FixtureStatus.POSTPONED:
                return 'text-yellow-600 bg-yellow-100';
            case FixtureStatus.CANCELED:
                return 'text-gray-600 bg-gray-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex md:items-center md:justify-between gap-4 flex-col md:flex-row'>
                <div className='flex items-center gap-4'>
                    <Link
                        href='/admin/super-admin/football/dashboard'
                        className='p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-600 hover:text-gray-900'
                    >
                        <ArrowLeft className='w-5 h-5' />
                    </Link>
                    <div>
                        <h1 className='text-2xl font-bold'>Fixture Management</h1>
                        <p className='text-muted-foreground'>Schedule and manage all fixtures</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                >
                    <Plus className='w-4 h-4' />
                    Create Fixture
                </button>
            </div>

            {/* Filters */}
            <div className='flex flex-col md:flex-row gap-4'>
                <div className='relative flex-1'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                    <input
                        type='text'
                        placeholder='Search fixtures...'
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
                    <option value={FixtureStatus.SCHEDULED} className='text-gray-900'>Scheduled</option>
                    <option value={FixtureStatus.LIVE} className='text-gray-900'>Live</option>
                    <option value={FixtureStatus.COMPLETED} className='text-gray-900'>Completed</option>
                    <option value={FixtureStatus.POSTPONED} className='text-gray-900'>Postponed</option>
                    <option value={FixtureStatus.CANCELED} className='text-gray-900'>Canceled</option>
                </select>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <div className='p-4 border rounded-lg'>
                    <div className='flex items-center gap-2'>
                        <Calendar className='w-5 h-5 text-blue-500' />
                        <span className='text-sm text-muted-foreground'>Total Fixtures</span>
                    </div>
                    <p className='text-2xl font-bold'>{fixtures.length}</p>
                </div>
                <div className='p-4 border rounded-lg'>
                    <div className='flex items-center gap-2'>
                        <Clock className='w-5 h-5 text-yellow-500' />
                        <span className='text-sm text-muted-foreground'>Scheduled</span>
                    </div>
                    <p className='text-2xl font-bold'>
                        {fixtures.filter(f => f.status === FixtureStatus.SCHEDULED).length}
                    </p>
                </div>
                <div className='p-4 border rounded-lg'>
                    <div className='flex items-center gap-2'>
                        <CheckCircle className='w-5 h-5 text-green-500' />
                        <span className='text-sm text-muted-foreground'>Completed</span>
                    </div>
                    <p className='text-2xl font-bold'>
                        {fixtures.filter(f => f.status === FixtureStatus.COMPLETED).length}
                    </p>
                </div>
                <div className='p-4 border rounded-lg'>
                    <div className='flex items-center gap-2'>
                        <AlertCircle className='w-5 h-5 text-red-500' />
                        <span className='text-sm text-muted-foreground'>Live</span>
                    </div>
                    <p className='text-2xl font-bold'>
                        {fixtures.filter(f => f.status === FixtureStatus.LIVE).length}
                    </p>
                </div>
            </div>

            {/* Fixtures List */}
            <div className='space-y-4'>
                {filteredFixtures.length === 0 ? (
                    <div className='text-center py-12'>
                        <Calendar className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                        <h3 className='text-lg font-semibold text-gray-600'>No fixtures found</h3>
                        <p className='text-gray-500'>Try adjusting your search or filters</p>
                    </div>
                ) : (
                    filteredFixtures.map((fixture) => (
                        <div key={fixture._id} className='border rounded-lg p-4 hover:shadow-md transition-shadow'>
                            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                                <div className='flex-1'>
                                    <div className='flex items-center gap-4 mb-2'>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(fixture.status)}`}>
                                            {fixture.status.toUpperCase()}
                                        </span>
                                        <span className='text-sm text-muted-foreground flex items-center gap-1'>
                                            <Trophy className='w-4 h-4' />
                                            {fixture.competition.name}
                                        </span>
                                    </div>

                                    <div className='flex items-center justify-between mb-2'>
                                        <div className='flex items-center gap-4'>
                                            <div className='text-right'>
                                                <p className='font-semibold'>{fixture.homeTeam.name}</p>
                                                <p className='text-sm text-muted-foreground'>{fixture.homeTeam.shorthand}</p>
                                            </div>
                                            <div className='text-center px-4'>
                                                <div className='text-lg font-bold'>
                                                    {fixture.result ?
                                                        `${fixture.result.homeScore} - ${fixture.result.awayScore}` :
                                                        'vs'
                                                    }
                                                </div>
                                            </div>
                                            <div className='text-left'>
                                                <p className='font-semibold'>{fixture.awayTeam.name}</p>
                                                <p className='text-sm text-muted-foreground'>{fixture.awayTeam.shorthand}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
                                        <span className='flex items-center gap-1'>
                                            <Calendar className='w-4 h-4' />
                                            {formatDate(fixture.scheduledDate.toString())}
                                        </span>
                                        <span className='flex items-center gap-1'>
                                            <MapPin className='w-4 h-4' />
                                            {fixture.stadium}
                                        </span>
                                        <span className='flex items-center gap-1'>
                                            <Users className='w-4 h-4' />
                                            {fixture.referee}
                                        </span>
                                    </div>
                                </div>

                                <div className='flex items-center gap-2'>
                                    {fixture.status === FixtureStatus.SCHEDULED && (
                                        <button
                                            onClick={() => openRescheduleModal(fixture)}
                                            className='px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200'
                                        >
                                            Reschedule
                                        </button>
                                    )}
                                    <button
                                        onClick={() => openEditModal(fixture)}
                                        className='p-2 text-blue-600 hover:bg-blue-100 rounded'
                                    >
                                        <Edit className='w-4 h-4' />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteFixture(fixture._id)}
                                        className='p-2 text-red-600 hover:bg-red-100 rounded'
                                    >
                                        <Trash2 className='w-4 h-4' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Fixture Modal */}
            {showCreateModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto'>
                        {/* Modal Header */}
                        <div className='flex items-center justify-between p-6 border-b'>
                            <h2 className='text-xl font-bold text-gray-900'>Create New Fixture</h2>
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
                                    Competition <span className='text-red-500'>*</span>
                                </label>
                                <select
                                    value={formData.competition}
                                    onChange={
                                        (e) => {
                                            setFormData({...formData, competition: e.target.value, groupId: '', knockoutId: ''});
                                            const comp = competitions.find(comp => comp._id === e.target.value);

                                            if(comp && comp.type === CompetitionTypes.HYBRID){
                                                setCompetitionKnockouts(comp?.knockoutRounds ?? []);
                                                setCompetitionTables(comp?.groupStage ?? []);
                                            }
                                            if(comp && comp.type === CompetitionTypes.KNOCKOUT){
                                                setCompetitionKnockouts(comp?.knockoutRounds ?? []);
                                            }
                                        }
                                    }
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
                                >
                                    <option value='' className='text-gray-500'>Select Competition</option>
                                    {competitions.map(comp => (
                                        <option key={comp._id} value={comp._id} className='text-gray-900'>{comp.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Home Team <span className='text-red-500'>*</span>
                                    </label>
                                    <select
                                        value={formData.homeTeam}
                                        onChange={(e) => setFormData({...formData, homeTeam: e.target.value})}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
                                    >
                                        <option value='' className='text-gray-500'>Select Home Team</option>
                                        {teams.map(team => (
                                            <option key={team._id} value={team._id} className='text-gray-900'>{team.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Away Team <span className='text-red-500'>*</span>
                                    </label>
                                    <select
                                        value={formData.awayTeam}
                                        onChange={(e) => setFormData({...formData, awayTeam: e.target.value})}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
                                    >
                                        <option value='' className='text-gray-500'>Select Away Team</option>
                                        {teams.filter(team => team._id !== formData.homeTeam).map(team => (
                                            <option key={team._id} value={team._id} className='text-gray-900'>{team.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Match Type</label>
                                <select
                                    value={formData.matchType}
                                    onChange={(e) => setFormData({...formData, matchType: e.target.value})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
                                >
                                    <option value='' className='text-gray-900'>Select Type</option>
                                    {competitionTables.length > 0 && <option value='group' className='text-gray-900'>Group</option>}
                                    {competitionKnockouts.length > 0 && <option value='knockout' className='text-gray-900'>Knockout</option>}
                                    <option value='friendly' className='text-gray-900'>Friendly</option>
                                </select>
                            </div>

                            {formData.matchType === 'group' && competitionTables.length > 0 && (
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Group <span className='text-red-500'>*</span>
                                    </label>
                                    <select
                                        value={formData.groupId}
                                        onChange={(e) => setFormData({...formData, groupId: e.target.value})}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
                                    >
                                        <option value='' className='text-gray-500'>Select Group</option>
                                        {competitionTables.map(table => (
                                            <option key={table._id} value={table._id} className='text-gray-900'>{table.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {formData.matchType === 'knockout' && competitionKnockouts.length > 0 && (
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Knockout <span className='text-red-500'>*</span>
                                    </label>
                                    <select
                                        value={formData.knockoutId}
                                        onChange={(e) => setFormData({...formData, knockoutId: e.target.value})}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
                                    >
                                        <option value='' className='text-gray-500'>Select Knockout Round</option>
                                        {competitionKnockouts.map(round => (
                                            <option key={round._id} value={round._id} className='text-gray-900'>{round.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Stadium <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    value={formData.stadium}
                                    onChange={(e) => setFormData({...formData, stadium: e.target.value})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500'
                                    placeholder='Enter stadium name'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Scheduled Date & Time <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='datetime-local'
                                    value={formData.scheduledDate}
                                    onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Referee <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    value={formData.referee}
                                    onChange={(e) => setFormData({...formData, referee: e.target.value})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500'
                                    placeholder='Enter referee name'
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
                                onClick={handleCreateFixture}
                                className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
                            >
                                Create Fixture
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Fixture Modal */}
            {showEditModal && selectedFixture && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto'>
                        {/* Modal Header */}
                        <div className='flex items-center justify-between p-6 border-b'>
                            <h2 className='text-xl font-bold text-gray-900'>Edit Fixture</h2>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedFixture(null);
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
                                    Competition <span className='text-red-500'>*</span>
                                </label>
                                <select
                                    value={formData.competition}
                                    onChange={(e) => setFormData({...formData, competition: e.target.value})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
                                >
                                    <option value='' className='text-gray-500'>Select Competition</option>
                                    {competitions.map(comp => (
                                        <option key={comp._id} value={comp._id} className='text-gray-900'>{comp.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Home Team <span className='text-red-500'>*</span>
                                    </label>
                                    <select
                                        value={formData.homeTeam}
                                        onChange={(e) => setFormData({...formData, homeTeam: e.target.value})}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
                                    >
                                        <option value='' className='text-gray-500'>Select Home Team</option>
                                        {teams.map(team => (
                                            <option key={team._id} value={team._id} className='text-gray-900'>{team.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Away Team <span className='text-red-500'>*</span>
                                    </label>
                                    <select
                                        value={formData.awayTeam}
                                        onChange={(e) => setFormData({...formData, awayTeam: e.target.value})}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
                                    >
                                        <option value='' className='text-gray-500'>Select Away Team</option>
                                        {teams.filter(team => team._id !== formData.homeTeam).map(team => (
                                            <option key={team._id} value={team._id} className='text-gray-900'>{team.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Stadium <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    value={formData.stadium}
                                    onChange={(e) => setFormData({...formData, stadium: e.target.value})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500'
                                    placeholder='Enter stadium name'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Scheduled Date & Time <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='datetime-local'
                                    value={formData.scheduledDate}
                                    onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Referee <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    value={formData.referee}
                                    onChange={(e) => setFormData({...formData, referee: e.target.value})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500'
                                    placeholder='Enter referee name'
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className='flex gap-3 p-6 border-t bg-gray-50'>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedFixture(null);
                                    setFormData(initialFormData);
                                }}
                                className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateFixture}
                                className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
                            >
                                Update Fixture
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reschedule Fixture Modal */}
            {showRescheduleModal && selectedFixture && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-lg shadow-xl w-full max-w-md'>
                        {/* Modal Header */}
                        <div className='flex items-center justify-between p-6 border-b'>
                            <div>
                                <h2 className='text-xl font-bold text-gray-900'>Reschedule Fixture</h2>
                                <p className='text-sm text-gray-600 mt-1'>
                                    {selectedFixture.homeTeam.name} vs {selectedFixture.awayTeam.name}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowRescheduleModal(false);
                                    setSelectedFixture(null);
                                    setRescheduleData({ postponedReason: '', rescheduledDate: '' });
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
                                    Reason for Postponement <span className='text-red-500'>*</span>
                                </label>
                                <textarea
                                    value={rescheduleData.postponedReason}
                                    onChange={(e) => setRescheduleData({...rescheduleData, postponedReason: e.target.value})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none bg-white text-gray-900 placeholder-gray-500'
                                    rows={3}
                                    placeholder='Enter reason for postponement (e.g., weather conditions, venue issues, etc.)'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    New Date & Time <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='datetime-local'
                                    value={rescheduleData.rescheduledDate}
                                    onChange={(e) => setRescheduleData({...rescheduleData, rescheduledDate: e.target.value})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white text-gray-900'
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className='flex gap-3 p-6 border-t bg-gray-50'>
                            <button
                                onClick={() => {
                                    setShowRescheduleModal(false);
                                    setSelectedFixture(null);
                                    setRescheduleData({ postponedReason: '', rescheduledDate: '' });
                                }}
                                className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRescheduleFixture}
                                className='flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium'
                            >
                                Reschedule Fixture
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminFixturesPage;
