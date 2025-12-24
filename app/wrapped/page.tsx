'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Trophy, Flame, Zap, Award, Calendar, Users, TrendingUp, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface WrappedStats {
  totalMatches: number;
  teamsParticipated: number;
  totalGoals: number;
  topTeam: string;
  mostMemorableMatch: string;
  attendance: number;
}

const mockStats: WrappedStats = {
  totalMatches: 156,
  teamsParticipated: 24,
  totalGoals: 423,
  topTeam: 'Citizens FC',
  mostMemorableMatch: 'Citizens FC 3-2 Seventeen FC',
  attendance: 45680
};

const WrappedScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const isMobile = window.innerWidth < 768;
    const particlesCount = isMobile ? 800 : 2000;
    
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.015 : 0.02,
      color: 0x10b981,
      transparent: true,
      opacity: 0.8,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    const torusGeometry = new THREE.TorusGeometry(isMobile ? 1.5 : 2, 0.02, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.6 });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(0, 0, isMobile ? -4 : -5);
    scene.add(torus);

    const torus2Geometry = new THREE.TorusGeometry(isMobile ? 2 : 2.5, 0.02, 16, 100);
    const torus2Material = new THREE.MeshBasicMaterial({ color: 0x14b8a6, transparent: true, opacity: 0.4 });
    const torus2 = new THREE.Mesh(torus2Geometry, torus2Material);
    torus2.position.set(0, 0, isMobile ? -4 : -5);
    scene.add(torus2);

    camera.position.z = isMobile ? 6 : 5;

    const animate = () => {
      requestAnimationFrame(animate);
      
      particlesMesh.rotation.y += 0.0005;
      particlesMesh.rotation.x += 0.0002;
      
      torus.rotation.x += 0.005;
      torus.rotation.y += 0.005;
      
      torus2.rotation.x -= 0.003;
      torus2.rotation.y -= 0.003;
      
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      camera.position.z = mobile ? 6 : 5;
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
};

const StatCard = ({ icon: Icon, label, value, color, delay }: { icon: any, label: string, value: number | string, color: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.02, rotate: 0.5 }}
    className={`relative overflow-hidden rounded-xl sm:rounded-2xl p-3 sm:p-6 ${color} bg-gradient-to-br shadow-2xl backdrop-blur-sm`}
  >
    <div className="absolute top-0 right-0 p-2 sm:p-4 opacity-20">
      <Icon className="w-10 h-10 sm:w-16 sm:h-16" />
    </div>
    <Icon className="w-7 h-7 sm:w-10 sm:h-10 mb-3 sm:mb-4" />
    <p className="text-xs sm:text-sm opacity-80 mb-1">{label}</p>
    <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">{value}</p>
  </motion.div>
);

export default function WrappedPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const sections = [
    { title: 'Welcome', subtitle: 'Your 2025 Sports Journey' },
    { title: 'Matches', subtitle: 'Total Games Played' },
    { title: 'Goals', subtitle: 'Goals Scored' },
    { title: 'Teams', subtitle: 'Teams Participated' },
    { title: 'Top Team', subtitle: 'Champion of 2025' },
    { title: 'Highlights', subtitle: 'Memorable Moments' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 flex items-center justify-center">
        <div className="text-center px-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-white/20 border-t-white rounded-full mx-auto mb-6 sm:mb-8"
          />
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-white text-lg sm:text-xl font-light"
          >
            Preparing your 2025 Wrapped...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950/50 via-green-950/50 to-teal-950/50 text-white overflow-hidden">
      <WrappedScene />

      <nav className="fixed top-0 left-0 right-0 z-50 p-2 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-2 sm:px-0">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-1.5 sm:gap-2 bg-white/5 backdrop-blur-md px-2 sm:px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">Back Home</span>
              <span className="text-xs sm:text-sm font-medium sm:hidden">Back</span>
            </motion.button>
          </Link>
          <div className="flex gap-1.5 sm:gap-2">
            {sections.map((_, index) => (
              <motion.button
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${index === currentSection ? 'bg-white' : 'bg-white/30'} hover:bg-white/50 transition-colors`}
                onClick={() => setCurrentSection(index)}
              />
            ))}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-0 sm:px-6 pt-20 sm:pt-24 pb-20 sm:pb-24">
        <AnimatePresence mode="wait">
          {currentSection === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center min-h-[65vh] sm:min-h-[70vh] text-center px-4"
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative mb-6 sm:mb-8"
              >
                <div className="absolute inset-0 bg-emerald-500/30 blur-3xl rounded-full" />
                <div className="relative text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                  2025
                </div>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
              >
                Wrapped
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 max-w-2xl mb-8 sm:mb-12 px-2"
              >
                Relive the incredible moments, top performances, and memorable games from FUPRE sports this year
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentSection(1)}
                className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg"
              >
                Start Your Journey
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </motion.button>
            </motion.div>
          )}

          {currentSection === 1 && (
            <motion.div
              key="matches"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center min-h-[65vh] sm:min-h-[70vh] text-center px-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                className="mb-6 sm:mb-8"
              >
                <Calendar className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-emerald-400" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent"
              >
                {mockStats.totalMatches}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-xl sm:text-2xl md:text-3xl text-white/70 mb-8 sm:mb-12"
              >
                Matches Played
              </motion.p>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentSection(2)}
                className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium text-sm sm:text-base hover:bg-white/20 transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </motion.div>
          )}

          {currentSection === 2 && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center min-h-[65vh] sm:min-h-[70vh] text-center px-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                className="mb-6 sm:mb-8"
              >
                <Flame className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-orange-400" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent"
              >
                {mockStats.totalGoals}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-xl sm:text-2xl md:text-3xl text-white/70 mb-8 sm:mb-12"
              >
                Goals Scored
              </motion.p>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentSection(3)}
                className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium text-sm sm:text-base hover:bg-white/20 transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </motion.div>
          )}

          {currentSection === 3 && (
            <motion.div
              key="teams"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center min-h-[65vh] sm:min-h-[70vh] text-center px-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                className="mb-6 sm:mb-8"
              >
                <Users className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-teal-400" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent"
              >
                {mockStats.teamsParticipated}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-xl sm:text-2xl md:text-3xl text-white/70 mb-8 sm:mb-12"
              >
                Teams Participated
              </motion.p>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentSection(4)}
                className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium text-sm sm:text-base hover:bg-white/20 transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </motion.div>
          )}

          {currentSection === 4 && (
            <motion.div
              key="top-team"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center min-h-[65vh] sm:min-h-[70vh] text-center px-4"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                className="mb-6 sm:mb-8"
              >
                <Trophy className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-yellow-400" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-sm sm:text-base md:text-lg lg:text-xl text-yellow-400 mb-3 sm:mb-4 uppercase tracking-wider"
              >
                Champion of 2025
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 px-4"
              >
                {mockStats.topTeam}
              </motion.h2>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentSection(5)}
                className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium text-sm sm:text-base hover:bg-white/20 transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </motion.div>
          )}

          {currentSection === 5 && (
            <motion.div
              key="highlights"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
              className="max-w-6xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-center mb-8 sm:mb-12"
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4">Your 2025 Stats</h2>
                <p className="text-base sm:text-lg md:text-xl text-white/70">A year of unforgettable moments</p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
                <StatCard
                  icon={Zap}
                  label="Goals per Match"
                  value={(mockStats.totalGoals / mockStats.totalMatches).toFixed(2)}
                  color="from-emerald-500/10 to-green-500/10 border-emerald-500/20"
                  delay={0.3}
                />
                <StatCard
                  icon={Users}
                  label="Total Attendance"
                  value={mockStats.attendance.toLocaleString()}
                  color="from-green-500/10 to-teal-500/10 border-green-500/20"
                  delay={0.4}
                />
                <StatCard
                  icon={TrendingUp}
                  label="Avg Attendance"
                  value={Math.round(mockStats.attendance / mockStats.totalMatches)}
                  color="from-teal-500/10 to-cyan-500/10 border-teal-500/20"
                  delay={0.5}
                />
                <StatCard
                  icon={Award}
                  label="Most Memorable Match"
                  value={mockStats.mostMemorableMatch}
                  color="from-emerald-500/10 to-teal-500/10 border-emerald-500/20"
                  delay={0.6}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-center"
              >
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg mx-auto"
                  >
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                    Replay Your Wrapped
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-2 sm:p-4 flex justify-center gap-2 sm:gap-4 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
          className="bg-white/5 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-sm sm:text-base hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="hidden sm:inline">Previous</span>
          <ChevronLeft className="w-4 h-4 sm:hidden" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
          disabled={currentSection === sections.length - 1}
          className="bg-white/5 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-sm sm:text-base hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4 sm:hidden" />
        </motion.button>
      </div>
    </div>
  );
}
