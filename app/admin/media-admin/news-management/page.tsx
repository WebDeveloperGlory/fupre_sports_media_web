'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { checkHeadMediaAdminStatus } from '@/lib/requests/v2/authentication/requests';
import { Loader } from '@/components/ui/loader';
import { BlogCategories } from '@/utils/V2Utils/v2requestData.enums';
import { Calendar, ChevronDown, ChevronUp, Clock, Edit, Eye, Newspaper, Plus, Search, Trash2, User, X } from 'lucide-react';
import { IV2Blog } from '@/utils/V2Utils/v2requestData.types';
import PopUpModal from '@/components/modal/PopUpModal';
import { createBlog, deleteBlog, editBlog, getAllBlogs, publishBlog } from '@/lib/requests/v2/admin/media-admin/news-management/requests';
import Image from 'next/image';

type BlogForm = {
    category: BlogCategories;
    title: string;
    content: string;
    coverImage: string;
}

const NewsManagementPage = () => {
    const router = useRouter();
    
    const [loading, setLoading] = useState<boolean>(true);
    const [blogs, setBlogs] = useState<IV2Blog[]>([]);
    const [query, setQuery] = useState<string>("");
    const [filter, setFilter] = useState<string>("all-types");
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<'edit'|'create'>('create');
    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<BlogForm>({
        category: BlogCategories.FOOTBALL,
        title: '',
        content: '',
        coverImage: '',
    });
    const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
    const [selectedPreview, setSelectedPreview] = useState<IV2Blog | null>(null);

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

            const blogData = await getAllBlogs();
            if(blogData && blogData.code === '00') {
                setBlogs(blogData.data);
                console.log(blogData.data)
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
    const handleFilterClick = ( category: string ) => {
        setFilter( category );
        setFilterOpen( false );
    }
    // End of Search Bar Handlers //

    // Button Clicks //
    const handleNewsCreateClick = () => {
        setModalOpen(true);
        setModalType('create');
        setSelectedBlogId(null);
        setFormData({
            category: BlogCategories.FOOTBALL,
            title: '',
            content: '',
            coverImage: '',
        });
    }
    const handleNewsCreate = async () => {
        const response = await createBlog(formData);
        if( response?.code === '00' ) {
            toast.success(response.message || 'Blog Created');
            setBlogs([...blogs, response.data ]);
            handleModalClose();
        } else {
            toast.error(response?.message || 'Error Creating Blog');
            handleModalClose();
        }
    }
    const handleBlogEditClick = ( blog: IV2Blog ) => {
        const { _id, category, title, content, coverImage } = blog;

        setModalOpen(true);
        setModalType('edit');
        setSelectedBlogId(_id);
        setFormData({
            category,
            title,
            content,
            coverImage: coverImage ? coverImage : '',
        })
    }
    const handleBlogEdit = async () => {
        if( selectedBlogId ) {
            const response = await editBlog(selectedBlogId, formData);
            if( response?.code === '00' ) {
                toast.success(response.message || 'Blog Created');
                setBlogs(
                    [...blogs].map(blog => {
                        if(blog._id === selectedBlogId) {
                            return response.data
                        } else {
                            return blog
                        }
                    })
                );
                handleModalClose();
            } else {
                toast.error(response?.message || 'Error Creating Blog');
                handleModalClose();
            }
        }
    }
    const handleModalClose = () => {
        setModalOpen( false );
        setSelectedBlogId(null);
        setFormData({
            category: BlogCategories.FOOTBALL,
            title: '',
            content: '',
            coverImage: '',
        })
    } 
    const handleBlogDelete = async (blogId: string) => {
        const response = await deleteBlog(blogId);
        if(response?.code === '00') {
            toast.success(response.message);
            setBlogs([...blogs].filter(blog => blog._id !== blogId));
        } else {
            toast.error(response?.message || 'Error Creating Blog');
            handleModalClose();
        }
    }
    // End of Button Clicks //

    // Preview Modal //
    const openPreview = (blog: IV2Blog) => {
        setSelectedPreview(blog);
        setPreviewModalOpen(true);
    }
    const closePreview = () => {
        setPreviewModalOpen(false);
        setSelectedPreview(null);
    }
    const handlePublishBlog = async (blogId: string) => {
        const response = await publishBlog(blogId);
        if(response?.code === '00') {
            toast.success(response.message);
            setBlogs(
                [...blogs].map(blog => {
                    if(blog._id === blogId) {
                        return response.data
                    } else {
                        return blog
                    }
                })
            );
            closePreview();
        } else {
            toast.error(response?.message || 'Error Publishing Blog');
            closePreview();
        }
    }
    // End Of Preview Modal //

    // Others //
    const filteredBlogs = blogs.filter( blog => {
        if( filter === 'all-types' ) {
            return true
        } else {
            return blog.category === filter
        }
    });
    const disabledButton = formData.title === '' || formData.content === '';
    // End of Others //

  return (
    <div className='space-y-6 md:space-y-4'>
        {/* Header */}
        <div className=' flex items-center justify-between md:px-4 md:py-4 md:border md:rounded-lg'>
            <div>
                <h1 className='text-2xl font-bold'>News Management</h1>
                <p>Create and manage news articles and stories</p>
            </div>
            <button
                onClick={ handleNewsCreateClick }
                className='px-4 py-2 text-center rounded-lg bg-emerald-500 md:flex gap-2 items-center hover:bg-emerald-500/50 hidden'
            >
                <Plus className='w-5 h-5' />
                Create News Article
            </button>
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
                    placeholder="Search articles..."
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
                onClick={ handleNewsCreateClick }
                className='px-4 py-2 text-center rounded-lg bg-emerald-500 flex gap-2 items-center justify-center hover:bg-emerald-500/50 md:hidden col-span-1'
            >
                <Plus className='w-5 h-5' />
                Create News Article
            </button>
            {
                filterOpen && (
                    <>
                        <div className='hidden md:block md:col-span-9'></div>
                        <div className='col-span-2 md:col-span-3'>
                            {
                                ['all-types', ...Object.values( BlogCategories )].map( category => (
                                    <p 
                                        key={category}
                                        onClick={ () => handleFilterClick( category ) }
                                        className={`
                                            px-4 py-1 my-2 cursor-pointer hover:text-green-500 ${
                                                filter === category && 'text-green-500'
                                            }
                                        `}
                                    >
                                        { category }
                                    </p>
                                ))
                            }
                        </div>                    
                    </>
                )
            }
        </div>

        {/* Blog List */}
        {
            filteredBlogs && filteredBlogs.length > 0 && (
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    {
                        filteredBlogs.map(blog => (
                            <div
                                key={blog._id}
                                className='border border-muted-foreground bg-card p-4 rounded-lg flex items-center gap-4'
                            >
                                <div className='w-24 h-24 rounded-lg bg-white'>

                                </div>
                                <div>
                                    <h2 className='font-bold text-lg mb-1'>{ blog.title }</h2>
                                    <span className='text-muted-foreground'>{ blog.content.slice(0,100) }...</span>
                                    <p className='px-2 py-1 border bg-card rounded-full text-sm border-muted-foreground w-fit mt-2'>{ blog.category }</p>
                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 w-full'>
                                        <div className='md:col-span-2 flex items-center gap-3 text-sm text-muted-foreground'>
                                            <p className='flex items-center gap-1'>
                                                <User className='w-4 h-4' />
                                                { blog.author.name }
                                            </p>
                                            <p className='flex items-center gap-1'>
                                                <Calendar className='w-4 h-4' />
                                                { blog.createdAt.toLocaleString().split('T')[0] }
                                            </p>
                                        </div>
                                        <div className='flex items-center gap-3 justify-end w-full'>
                                            <button
                                                onClick={() => handleBlogEditClick(blog)}
                                                className='px-3 py-2 border border-muted-foreground text-sm rounded-md flex gap-1 items-center hover:border-emerald-500 hover:text-emerald-500'
                                            >
                                                <Edit className='w-4 h-4' />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => openPreview(blog)}
                                                className='px-3 py-2 border border-muted-foreground text-sm rounded-md flex gap-1 items-center text-blue-500 hover:border-blue-500'
                                            >
                                                <Eye className='w-5 h-5' />
                                            </button>
                                            <button
                                                onClick={() => handleBlogDelete(blog._id)}
                                                className='px-3 py-2 border border-muted-foreground text-sm rounded-md flex gap-1 items-center text-red-500 hover:border-red-500'
                                            >
                                                <Trash2 className='w-5 h-5' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            )
        }

        {/* No Blogs In Blog List */}
        {
            filteredBlogs.length === 0 && (
                <div className='border border-emerald-500 rounded-lg flex justify-center items-center flex-col gap-4 py-10'>
                    {/* No Blogs */}
                    <Newspaper className='w-8 h-8' />
                    <p className='font-bold'>No Articles Found</p>
                    <span className='text-sm text-muted-foreground'>Get started by creating your first article</span>
                    <button
                        onClick={ handleNewsCreateClick }
                        className='px-4 py-2 text-center rounded-lg bg-emerald-500 md:flex gap-2 items-center hover:bg-emerald-500/50 hidden'
                    >
                        <Plus className='w-5 h-5' />
                        Create News Article
                    </button>
                </div>
            )
        }

        {/* PopUp Modal */}
        <PopUpModal
            open={ modalOpen } 
            onClose={ handleModalClose }
        >
            <h2 className='text-lg font-bold mb-6'>{modalType === 'create' ? 'Create' : 'Edit'} Article</h2>
            <div className='space-y-4 text-left'>
                <div>
                    <label className="block font-semibold mb-1.5">Title</label>
                    <input
                        type='text'
                        placeholder='e.g. VC News'
                        value={ formData.title }
                        onChange={
                            ( e ) => setFormData({
                                ...formData,
                                title: e.target.value
                            })
                        }
                        className='w-full p-2 border rounded bg-input'
                    />
                </div>
                <div>
                    <label className="block font-semibold mb-1.5">Category</label>
                    <select 
                        className="w-full p-2 border rounded cursor-pointer bg-input"
                        value={ formData.category }
                        onChange={ (e) => setFormData({ 
                            ...formData,
                            category: e.target.value as BlogCategories
                        }) }
                    >
                        {
                            Object.values( BlogCategories ).map( category => (
                                <option key={ category } value={ category }>{ category }</option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    <label className="block font-semibold mb-1.5">Cover Image URL</label>
                    <input
                        type='text'
                        placeholder='e.g. https://sample-image.com'
                        value={ formData.coverImage }
                        onChange={
                            ( e ) => setFormData({
                                ...formData,
                                coverImage: e.target.value
                            })
                        }
                        className='w-full p-2 border rounded bg-input'
                    />
                </div>
                <div>
                    <label className="block font-semibold mb-1.5">Content</label>
                    <textarea 
                        name="description" 
                        value={formData.content}
                        onChange={
                            ( e ) => setFormData({
                                ...formData,
                                content: e.target.value
                            })
                        }
                        placeholder='Write article content here...'
                        rows={8}
                        className='w-full p-2 border rounded bg-input'
                    >
                    </textarea>
                </div>
                <div className='flex justify-between items-center'>
                    <div></div>
                    <div className='flex items-center gap-4'>
                        <button
                            onClick={handleModalClose}
                            className='border border-muted-foreground px-4 py-2 rounded-lg hover:border-red-500 hover:text-red-500 transition'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={modalType === 'create' ? handleNewsCreate : handleBlogEdit}
                            className='text-white bg-emerald-500 hover:bg-emerald-500/50 px-4 py-2 rounded-lg transition'
                        >
                            {modalType === 'create' ? 'Create' : 'Update'} Article
                        </button>
                    </div>
                </div>
            </div>
        </PopUpModal>

        {/* Preview Modal */}
        <PopUpModal
            open={previewModalOpen}
            onClose={closePreview}
        >
            <h2 className='text-lg font-bold'>Article Preview</h2>
            <div className='text-left space-y-6'>
                <header className="space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold">{selectedPreview?.title || 'Test Blog'}</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <div className="relative w-6 h-6 rounded-full bg-muted overflow-hidden">
                                {
                                    selectedPreview && selectedPreview.coverImage && selectedPreview.coverImage !== '' && (
                                        <Image
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPreview.author.name}`}
                                            alt={selectedPreview.author.name}
                                            fill
                                            className="object-cover"
                                        />
                                    )
                                }
                            </div>
                            <span>{selectedPreview?.author.name || 'Unknown'}</span>
                        </div>
                        <span>·</span>
                        <span>{ selectedPreview?.createdAt.toLocaleString().split('T')[0] }</span>
                        <span>·</span>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{2} min read</span>
                        </div>
                    </div>
                </header>

                <div className="w-full relative">
                    {
                        selectedPreview && selectedPreview.coverImage && selectedPreview.coverImage.trim() !== '' && (
                            <Image
                                src={selectedPreview.coverImage}
                                alt={selectedPreview.title}
                                width={1200}
                                height={675}
                                className="w-full h-auto rounded-lg"
                                priority
                            />
                        )
                    }
                    {
                        selectedPreview && (!selectedPreview.coverImage || selectedPreview.coverImage.trim() === '') && (
                            <Image
                                src={"/images/news/Today's game.jpg"}
                                alt={selectedPreview.title}
                                width={1200}
                                height={675}
                                className="w-full h-auto rounded-lg"
                                priority
                            />
                        )
                    }
                </div>

                <div className="prose prose-emerald max-w-none">
                    {
                        selectedPreview?.content.split('\n\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))
                    }
                </div>
            </div>
            <div className='border-t-2 border-muted-foreground mt-8 pt-8 flex justify-between items-center'>
                <span className='text-sm text-muted-foreground'>This is a preview of how your article will appear to readers</span>
                <button
                    onClick={closePreview}
                    className='border border-muted-foreground px-4 py-2 rounded-lg hover:border-red-500 hover:text-red-500 transition text-sm'
                >
                    Close Preview
                </button>
            </div>
            {
                !selectedPreview?.isPublished && (
                    <button
                        onClick={() => handlePublishBlog(selectedPreview!._id)}
                        className='px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-500/50 transition text-sm mt-2'
                    >
                        Publish Article
                    </button>
                )
            }
        </PopUpModal>
    </div>
  )
}

export default NewsManagementPage