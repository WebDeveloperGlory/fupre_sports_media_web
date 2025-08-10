'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Loader2, Camera, Bell, Settings, LogOut } from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';
import { BackButton } from '@/components/ui/back-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/requests/v2/authentication/requests';
import { getProfile, markNotificationAsRead } from '@/lib/requests/v2/user/requests';
import { IV2User } from '@/utils/V2Utils/v2requestData.types';
import { UserRole } from '@/utils/V2Utils/v2requestData.enums';
import { useAuthStore } from '@/stores/v2/authStore';

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  favoriteTeam?: string;
  bio?: string;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export default function ProfilePage() {
  const { setUser, setIsLoggedIn } = useAuthStore();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<IV2User | null>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number | null>(null);

  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      const request = await getProfile();
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
      
      const response = await getProfile();
      if( response?.code === '00' ) {
        setProfile( response.data );
      } else {
        toast.error(response?.message || 'An Error Occurred');
      }
      setLoading( false );
    };

    if( loading ) fetchProfile();
  }, [ loading ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
      setIsEditing(false); // Turn off editing mode after successful save
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // const markAsRead = async (id: string) => {
  //   const result = await markNotificationAsRead( jwt!, id );
  //   if( result?.code === '00' ) {
  //     toast.success('Notification marked as read!');
  //     setNotifications((prev) =>
  //       prev.map((notification) =>
  //         notification._id === id ? { ...notification, read: true } : notification
  //       )
  //     );
  //     setUnreadCount((prev) => (prev !== null ? prev - 1 : null));
  //   }
  // };

  const handleLogout = async () => {
    const result = await logoutUser();
    if( result?.code === '00' ) {
      toast.success('Logout successful!');
      setProfile(null);
      setIsLoggedIn(false);
      setUser(null);
      router.push('/');
    } else {
      toast.error( result?.message || 'Logout failed! Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <BackButton />
      
      <BlurFade>
        <div className="max-w-3xl mx-auto mt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList className="bg-muted">
                <TabsTrigger value="profile" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                  Profile
                </TabsTrigger>
                <TabsTrigger value="notifications" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                  Notifications
                  {unreadCount && unreadCount >= 1 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profile" className="mt-0">
              {
                profile ? (
                  <div className="bg-card rounded-xl shadow-md border border-border p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Avatar Upload */}
                      <div className="flex justify-center">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-emerald-500">
                            {profile.profileImage ? (
                              <img
                                src={profile.profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-emerald-800 text-2xl font-bold">
                                {profile.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <label
                            htmlFor="avatar"
                            className="absolute bottom-0 right-0 bg-emerald-500 text-white p-2 rounded-full cursor-pointer hover:bg-emerald-600 transition-colors"
                          >
                            <Camera className="w-4 h-4" />
                          </label>
                          <input
                            type="file"
                            id="avatar"
                            className="hidden"
                            accept="image/*"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Full Name
                          </label>
                          <Input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={
                              (e) => {
                                setProfile({
                                  ...profile,
                                  name: e.target.value
                                })
                              }
                            }
                            className="focus:ring-emerald-500 focus:border-emerald-500"
                            disabled={!isEditing}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Email
                          </label>
                          <Input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={
                              (e) => {
                                setProfile({
                                  ...profile,
                                  email: e.target.value
                                })
                              }
                            }
                            className="bg-muted"
                            disabled
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Role
                          </label>
                          <Input
                            type="role"
                            name="role"
                            value={profile.role}
                            onChange={
                              (e) => {
                                setProfile({
                                  ...profile,
                                  role: e.target.value as UserRole
                                })
                              }
                            }
                            className="bg-muted"
                            disabled
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Favorite Team
                          </label>
                          {/* <Input
                            type="text"
                            name="favoriteTeam"
                            value={profile.favoriteTeam}
                            onChange={handleChange}
                            className="focus:ring-emerald-500 focus:border-emerald-500"
                            disabled={!isEditing}
                          /> */}
                          <Input
                            type="text"
                            name="favoriteTeam"
                            value="Not Implemented Yet"
                            onChange={() => {}}
                            className="focus:ring-emerald-500 focus:border-emerald-500"
                            disabled={ true }
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        {isEditing ? (
                          <Button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                          >
                            {saving ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Saving...
                              </>
                            ) : (
                              'Save Changes'
                            )}
                          </Button>
                        ) : (
                          <Button
                            type="button" 
                            onClick={(e) => {
                              e.preventDefault(); // Prevent form submission
                              setIsEditing(true);
                            }}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                          >
                            Edit Profile
                          </Button>
                        )}
                        
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div>How Odd! No Profile Data</div>
                )
              }
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <div className="bg-card rounded-xl shadow-md border border-border p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-emerald-500" />
                    Your Notifications
                  </h2>
                  {notifications.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Mark all as read
                    </Button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No notifications yet</h3>
                    <p className="text-muted-foreground mt-2">
                      We'll notify you when there's something new.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg border ${
                          notification.read 
                            ? 'border-border bg-card' 
                            : 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className={`font-medium ${!notification.read && 'text-emerald-700 dark:text-emerald-400'}`}>
                            {notification.title}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {new Date(notification.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <Button
                            variant="link"
                            size="sm"
                            className="mt-2 p-0 h-auto text-emerald-600 dark:text-emerald-400"
                            // onClick={() => markAsRead(notification._id)}
                            onClick={() => {}}
                          >
                            Mark as read
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </BlurFade>
    </div>
  );
}