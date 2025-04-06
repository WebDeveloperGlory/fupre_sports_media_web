'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Loader2, Camera, Bell, Settings, LogOut } from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';
import { BackButton } from '@/components/ui/back-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import useAuthStore from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/requests/v2/authentication/requests';

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  favoriteTeam?: string;
  bio?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { jwt, clearUserData } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    bio: '',
    favoriteTeam: '',
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        // Simulate API call with mock data
        setTimeout(() => {
          setProfile({
            name: 'John Doe',
            email: 'john.doe@example.com',
            bio: 'Football enthusiast and stats lover',
            favoriteTeam: 'Arsenal',
          });
          
          setNotifications([
            {
              id: '1',
              title: 'Welcome to FSM',
              message: 'Thank you for joining our platform. Explore the latest football statistics!',
              date: '2023-10-15',
              read: false,
            },
            {
              id: '2',
              title: 'New Feature Available',
              message: 'Check out our new match prediction algorithm in the Statistics section.',
              date: '2023-10-10',
              read: true,
            },
            {
              id: '3',
              title: 'Weekend Matches',
              message: 'Don\'t miss the big matches this weekend. Set your reminders now!',
              date: '2023-10-05',
              read: true,
            },
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        toast.error('Failed to load profile');
        setLoading(false);
      }
    };

    if( !jwt ) {
        toast.error('Please Login First');
        setTimeout(() => router.push( '/auth/login' ), 1000);
    } else {
        if( loading ) fetchProfile();
    }
  }, [ loading ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

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

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleLogout = async () => {
    const result = await logoutUser( jwt! );
    if( result?.code === '00' ) {
      toast.success('Logout successful!');
      clearUserData();
      router.push('/');
    } else {
      toast.error( result?.message || 'Logout failed! Please try again.');
    }
    console.log(result);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background">
      <BackButton />
      
      <BlurFade>
        <div className="max-w-3xl mx-auto mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList className="bg-muted">
                <TabsTrigger value="profile" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                  Profile
                </TabsTrigger>
                <TabsTrigger value="notifications" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profile" className="mt-0">
              <div className="bg-card rounded-xl shadow-md border border-border p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-emerald-500">
                        {profile.avatar ? (
                          <img
                            src={profile.avatar}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
                        className="bg-muted"
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Favorite Team
                      </label>
                      <Input
                        type="text"
                        name="favoriteTeam"
                        value={profile.favoriteTeam}
                        onChange={handleChange}
                        className="focus:ring-emerald-500 focus:border-emerald-500"
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Bio
                      </label>
                      <Textarea
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                        rows={4}
                        className="focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                        disabled={!isEditing}
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
                        key={notification.id}
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
                            onClick={() => markAsRead(notification.id)}
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