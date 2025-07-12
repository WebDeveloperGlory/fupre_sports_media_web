'use client'

import React, { useEffect, useState } from 'react'
import { createDepartment, createFaculty, deleteDepartment, deleteFaculty, editDepartment, editFaculty, getAllDepartments, getAllFaculties } from '@/lib/requests/v2/admin/super-admin/team/requests';
import { Building2, Calendar, Edit, GraduationCap, Plus, Save, Trash2 } from 'lucide-react'
import { Loader } from '@/components/ui/loader';
import { toast } from 'react-toastify';
import PopUpModal from '@/components/modal/PopUpModal';

type Faculty = {
    _id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
type Department = {
    _id: string;
    name: string;
    faculty: {
        _id: string;
        name: string;
    }
    createdAt: Date;
    updatedAt: Date;
}
const DepartmentFacultyPage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [popUpType, setPopUpType] = useState<'faculty' | 'department'>('faculty');
    const [formData, setFormData] = useState<{ name: string; faculty: string}>({
        name: '',
        faculty: ''
    })
    // On Load //
    useEffect( () => {
        const fetchData = async () => {
            const facultyData = await getAllFaculties();
            const departmentData = await getAllDepartments();

            if( facultyData && facultyData.data ) {
                setFaculties( facultyData.data );
            }
            if( departmentData && departmentData.data ) {
                setDepartments( departmentData.data );
            }
            
            setLoading( false );
        }

        if( loading ) fetchData();
    }, [ loading ]);
    
    if( loading ) {
        return <Loader />
    };

    // Faculty Buttons //
    const createFacultyClick = () => {
        setSelectedFaculty(null);
        setSelectedDepartment(null);
        setPopUpType('faculty');
        setFormData({faculty: '', name: ''});
        setModalOpen(true);
    }
    const handleFacultyEditClick = ( faculty: Faculty ) => {
        setSelectedFaculty( faculty );
        setFormData({ ...formData, name: faculty.name });
        setPopUpType('faculty');
        setModalOpen(true);
    }
    const handleFacultyDelete = async ( id: string ) => {
        const confirmed = window.confirm('Are you sure you want to delete this faculty?');

        if( confirmed ) {
            const response = await deleteFaculty( id );
            if( response?.code === '99' ) {
                toast.error(response.message)
            } else if( response?.code === '00' ) {
                const filteredFactulties = [...faculties].filter(fal => fal._id !== id);
                toast.success(response.message);
                setFaculties(filteredFactulties);
            } else {
                toast.error('Error Deleting Faculty')
            }
        } else {
            toast.error('Action Cancelled');
        }
    }
    const handleFacultyCreate = async () => {
        const response = await createFaculty( formData.name );
        if( response?.code === '99' ) {
            toast.error(response.message)
        } else if( response?.code === '00' ) {
            toast.success(response.message);
            setFaculties([ ...faculties, response.data ])
        } else {
            toast.error('Error Creating Faculty')
        }
        handleClose();
    }
    const handleFacultyUpdate = async () => {
        if( selectedFaculty ) {
            const response = await editFaculty( selectedFaculty._id, formData.name );
            if( response?.code === '99' ) {
                toast.error(response.message)
            } else if( response?.code === '00' ) {
                toast.success(response.message);
                const updatedFaculties = faculties.map(faculty => {
                    if(faculty._id === selectedFaculty._id) {
                        return response.data
                    } else {
                        return faculty
                    }
                })
                setFaculties([...updatedFaculties]);
            } else {
                toast.error('Error Updating Faculty')
            }
            handleClose();
        } else {
            handleClose();
        }
    }
    // End of Faculty Buttons //

    // Department Buttons //
    const createDepartmentClick = () => {
        setSelectedFaculty(null);
        setSelectedDepartment(null);
        setPopUpType('department');
        setFormData({faculty: '', name: ''});
        setModalOpen(true);
    }
    const handleDepartmentEditClick = ( department: Department ) => {
        setSelectedDepartment( department );
        setFormData({ faculty: department.faculty._id, name: department.name });
        setPopUpType('department');
        setModalOpen(true);
    }
    const handleDepartmentDelete = async ( id: string ) => {
        const confirmed = window.confirm('Are you sure you want to delete this department?');

        if( confirmed ) {
            const response = await deleteDepartment( id );
            if( response?.code === '99' ) {
                toast.error(response.message)
            } else if( response?.code === '00' ) {
                const filteredDepartments = [...departments].filter(dept => dept._id !== id);
                toast.success(response.message);
                setDepartments(filteredDepartments);
            } else {
                toast.error('Error Deleting Faculty')
            }
        } else {
            toast.error('Action Cancelled');
        }
    }
    const handleDepartmentCreate = async () => {
        const response = await createDepartment( formData.name, formData.faculty );
        if( response?.code === '99' ) {
            toast.error(response.message)
        } else if( response?.code === '00' ) {
            toast.success(response.message);
            setDepartments([ ...departments, response.data ])
        } else {
            toast.error('Error Creating Department')
        }
        handleClose();
    }
    const handleDepartmentUpdate = async () => {
        if( selectedDepartment ) {
            const response = await editDepartment( selectedDepartment._id, formData.name, formData.faculty );
            if( response?.code === '99' ) {
                toast.error(response.message)
            } else if( response?.code === '00' ) {
                toast.success(response.message);
                const updatedDepartments = departments.map(department => {
                    if(department._id === selectedDepartment._id) {
                        return response.data
                    } else {
                        return department
                    }
                })
                setDepartments([...updatedDepartments]);
            } else {
                toast.error('Error Updating Department')
            }
            handleClose();
        } else {
            handleClose();
        }
    }
    // End of Department Buttons //
    
    
    const handleClose = () => {
        setSelectedFaculty(null);
        setSelectedDepartment(null);
        setFormData({ name: '', faculty: '' })
        setModalOpen(false);
    }

  return (
    <div className='space-y-6 md:space-y-4'>
        {/* Header */}
        <div className=' flex items-center justify-between md:px-4 md:py-4 md:border md:rounded-lg'>
            <div>
                <h1 className='text-2xl font-bold'>Departments & Faculties</h1>
                <p>Manage academic faculties and their departments</p>
            </div>
        </div>
        
        {/* Info Cards */}
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div className='px-4 py-2 md:py-4 flex justify-between items-center border border-emerald-500 rounded-lg'>
                    <div>
                        <p className='text-muted-foreground'>Total Faculties</p>
                        <span className='text-lg font-bold'>{ faculties.length }</span>
                    </div>
                    <GraduationCap className='w-5 h-5 text-emerald-500' />
                </div>
                <div className='px-4 py-2 md:py-4 flex justify-between items-center border border-emerald-500 rounded-lg'>
                    <div>
                        <p className='text-muted-foreground'>Total Departments</p>
                        <span className='text-lg font-bold'>{ departments.length }</span>
                    </div>
                    <Building2 className='w-5 h-5 text-emerald-500' />
                </div>
                <div className='px-4 py-2 md:py-4 flex justify-between items-center border border-emerald-500 rounded-lg'>
                    <div>
                        <p className='text-muted-foreground'>Latest Addition</p>
                        <span className='text-lg font-bold'>{ departments.length > 0 ? departments[0].name : 'No Departments Yet' }</span>
                    </div>
                    <Calendar className='w-5 h-5 text-emerald-500' />
                </div>
            </div>
        </div>

        {/* Faculty */}
        <div className='px-4 py-4 border border-muted-foreground bg-card'>
            {/* Title */}
            <div className='flex justify-between items-center'>
                <div className='flex gap-2 items-center'>
                    <GraduationCap className='w-5 h-5' />
                    <h2 className='text-lg font-bold'>Faculties({ faculties.length })</h2>
                </div>
                <button 
                    onClick={createFacultyClick}
                    className='py-2 px-4 rounded-lg flex gap-2 border border-muted-foreground hover:border-emerald-500 hover:text-emerald-500'
                >
                    <Plus className='w-5 h-5' />
                    Add Faculty
                </button>
            </div>

            {/* Faculty Table */}
            <table className="w-full">
                <thead>
                    <tr className="border-b border-border">
                    <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">id</th>
                    <th className="text-left py-4 px-3 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-4 px-3 text-sm font-medium text-muted-foreground">Created</th>
                    <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        faculties.length > 0 && faculties.map(faculty => (
                            <tr 
                                key={ faculty._id } 
                                className="border-b border-border hover:bg-accent/50 transition-colors"
                            >
                                <td className="text-center py-4 px-3 text-sm">{ faculty._id }</td>
                                <td className="text-left py-4 px-3 text-sm">{ faculty.name }</td>
                                <td className="text-left py-4 px-3 text-sm">{ faculty.createdAt.toLocaleString() }</td>
                                <td className="text-center py-4 px-3 text-sm">
                                    <div className='flex items-center justify-center gap-4'>
                                        <button
                                            onClick={() => handleFacultyEditClick( faculty )}
                                            className='text-emerald-500'
                                        >
                                            <Edit className='w-5 h-5' />
                                        </button>
                                        <button
                                            onClick={() => handleFacultyDelete( faculty._id )}
                                            className='text-red-500'
                                        >
                                            <Trash2 className='w-5 h-5' />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
        
        {/* Departments */}
        <div className='px-4 py-4 border border-muted-foreground bg-card'>
            {/* Title */}
            <div className='flex justify-between items-center'>
                <div className='flex gap-2 items-center'>
                    <GraduationCap className='w-5 h-5' />
                    <h2 className='text-lg font-bold'>Departments({ departments.length })</h2>
                </div>
                <button 
                    onClick={createDepartmentClick}
                    className='py-2 px-4 rounded-lg flex gap-2 border border-muted-foreground hover:border-emerald-500 hover:text-emerald-500'
                >
                    <Plus className='w-5 h-5' />
                    Add Department
                </button>
            </div>

            {/* Faculty Table */}
            <table className="w-full">
                <thead>
                    <tr className="border-b border-border">
                    <th className="text-left py-4 px-3 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-4 px-3 text-sm font-medium text-muted-foreground">Faculty</th>
                    <th className="text-left py-4 px-3 text-sm font-medium text-muted-foreground">Created</th>
                    <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        departments.length > 0 && departments.map(department => (
                            <tr 
                                key={ department._id } 
                                className="border-b border-border hover:bg-accent/50 transition-colors"
                            >
                                <td className="text-left py-4 px-3 text-sm">{ department.name }</td>
                                <td className="text-left py-4 px-3 text-sm">{ department.faculty.name }</td>
                                <td className="text-left py-4 px-3 text-sm">{ department.createdAt.toLocaleString() }</td>
                                <td className="text-center py-4 px-3 text-sm">
                                    <div className='flex items-center justify-center gap-4'>
                                        <button
                                            onClick={() => handleDepartmentEditClick( department )}
                                            className='text-emerald-500'
                                        >
                                            <Edit className='w-5 h-5' />
                                        </button>
                                        <button
                                            onClick={() => handleDepartmentDelete( department._id )}
                                            className='text-red-500'
                                        >
                                            <Trash2 className='w-5 h-5' />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>

        {/* PopUp Modal */}
        <div>
            <PopUpModal open={ modalOpen } onClose={ handleClose }>
                {
                    popUpType === 'faculty' && (
                        <>
                            <h2 className='text-lg font-bold mb-6'>{ selectedFaculty ? 'Edit Faculty' : 'Create New Faculty' }</h2>
                            <div className='space-y-4 text-left'>
                                <div>
                                    <label className="block font-semibold mb-1.5">Faculty Name</label>
                                    <input
                                        type='text'
                                        placeholder='e.g. Faculty of Engineering'
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
                                <button 
                                    onClick={selectedFaculty ? handleFacultyUpdate : handleFacultyCreate}
                                    className='py-2 rounded-lg flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-500/50 text-white w-full disabled:opacity-50 disabled:line-through'
                                    disabled={ formData.name === '' }
                                >
                                    <Save className='w-5 h-5' />
                                    { selectedFaculty ? 'Save Faculty' : 'Create Faculty' }
                                </button>
                            </div>
                        </>
                    )
                }
                {
                    popUpType === 'department' && (
                        <>
                            <h2 className='text-lg font-bold mb-6'>{ selectedDepartment ? 'Edit Department' : 'Create New Department' }</h2>
                            <div className='space-y-4 text-left'>
                                <div>
                                    <label className="block font-semibold mb-1.5">Department Name</label>
                                    <input
                                        type='text'
                                        placeholder='e.g. Electrical Engineering'
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
                                    <label className="block font-semibold mb-1.5">Faculty</label>
                                    <select 
                                        className="w-full p-2 border rounded cursor-pointer bg-input"
                                        value={ formData.faculty }
                                        onChange={ (e) => setFormData({ 
                                            ...formData, 
                                            faculty: e.target.value
                                        }) }
                                    >
                                        <option value={''}>Select a faculty</option>
                                        {
                                            faculties.map( faculty => (
                                                <option key={ faculty._id } value={ faculty._id }>{ faculty.name }</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <button 
                                    onClick={selectedDepartment ? handleDepartmentUpdate : handleDepartmentCreate}
                                    className='py-2 rounded-lg flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-500/50 text-white w-full disabled:opacity-50 disabled:line-through'
                                    disabled={ formData.name === '' || formData.faculty === '' }
                                >
                                    <Save className='w-5 h-5' />
                                    { selectedDepartment ? 'Save Department' : 'Create Department' }
                                </button>
                            </div>
                        </>
                    )
                }
                
            </PopUpModal>
        </div>
    </div>
  )
}

export default DepartmentFacultyPage