'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import Link from "next/link";
import { Trophy, Users, Calendar, ArrowRight, Target, Play, Newspaper, Clock, ChevronRight } from "lucide-react";
import Footer from "@/components/Footer";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { footballCompetitionApi } from "@/lib/api/v1/football-competition.api";
import { footballFixtureApi } from "@/lib/api/v1/football-fixture.api";
import { FixtureResponse } from "@/lib/types/v1.response.types";
import { CompetitionStatus } from "@/types/v1.football-competition.types";
import { FixtureStatus } from "@/types/v1.football-fixture.types";
import { getAllBlogs } from "@/lib/requests/v2/admin/media-admin/news-management/requests";
import { IV2Blog } from "@/utils/V2Utils/v2requestData.types";
import { toast } from "react-toastify";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type DashboardData = {
  football: {
    totalCompetitions: number;
    totalTeams: number;
    totalUpcomingFixtures: number;
  };
  basketball: {};
  general: {
    totalCompetitions: number;
    totalTeams: number;
    totalPlayedFixtures: number;
    totalActiveCompetitions: number;
  };
  fixtures: {
    latest: FixtureResponse[];
  };
  blogs: {
    total: number;
    latest: IV2Blog[];
  };
}

export default function SportsOverviewPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const sportsRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  // Fetch news data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [competitionsRes, fixturesRes, upcomingRes, blogsRes] = await Promise.all([
          footballCompetitionApi.getAll(1, 200),
          footballFixtureApi.getAll(1, 200),
          footballFixtureApi.getUpcoming(1, 5),
          getAllBlogs(),
        ]);

        const competitionsData = Array.isArray(competitionsRes?.data) ? competitionsRes.data : [];
        const fixturesData = Array.isArray(fixturesRes?.data) ? fixturesRes.data : [];
        const upcomingData = Array.isArray(upcomingRes?.data) ? upcomingRes.data : [];

        const publishedBlogs = blogsRes?.code === '00'
          ? (blogsRes.data as IV2Blog[]).filter((blog) => blog.isPublished)
          : [];
        const sortedBlogs = [...publishedBlogs].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const latestBlogs = sortedBlogs.slice(0, 5);

        const teamSet = new Set<string>();
        competitionsData.forEach((comp) => {
          if (comp.teams && Array.isArray(comp.teams)) {
            comp.teams.forEach((team: any) => {
              if (typeof team === 'string') {
                teamSet.add(team);
                return;
              }
              if (team?.id) {
                teamSet.add(team.id);
              }
            });
          }
        });

        const totalTeams = teamSet.size;
        const totalCompetitions = competitionsRes?.total ?? competitionsData.length;
        const totalActiveCompetitions = competitionsData.filter(
          (comp) => comp.isActive || comp.status === CompetitionStatus.ONGOING
        ).length;
        const totalPlayedFixtures = fixturesData.filter(
          (fixture) => fixture.status === FixtureStatus.COMPLETED
        ).length;
        const totalUpcomingFixtures = upcomingRes?.total ?? upcomingData.length;

        setDashboardData({
          football: {
            totalCompetitions,
            totalTeams,
            totalUpcomingFixtures,
          },
          basketball: {},
          general: {
            totalCompetitions,
            totalTeams,
            totalPlayedFixtures,
            totalActiveCompetitions,
          },
          fixtures: {
            latest: upcomingData,
          },
          blogs: {
            total: publishedBlogs.length,
            latest: latestBlogs,
          },
        });
      } catch (error) {
        console.error('Error fetching sports overview data:', error);
        toast.error('Error Getting Analytics');
      } finally {
        setLoading(false);
      }
    }

    if (loading) fetchData();
  }, [loading]);

  // GSAP Animations
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // If user prefers reduced motion, just set opacity to 1 without animations
      gsap.set([".hero-title", ".hero-subtitle", ".hero-mission", ".hero-cta", ".stats-card", ".sports-card", ".featured-section"], { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo(".hero-title",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );

      gsap.fromTo(".hero-subtitle",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power2.out" }
      );

      gsap.fromTo(".hero-mission",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: "power2.out" }
      );

      gsap.fromTo(".hero-cta",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.9, ease: "power2.out" }
      );

      // Stats cards animation
      gsap.fromTo(".stats-card",
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".stats-section",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Sports cards animation
      gsap.fromTo(".sports-card",
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".sports-section",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Featured content animation
      gsap.fromTo(".featured-section",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".featured-section",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const sports = [
    {
      name: "Football",
      href: "/sports/football",
      description: "University football competitions, fixtures, and live matches",
      icon: Trophy,
      color: "emerald" as const,
      gradient: "from-emerald-500/20 to-emerald-600/10",
      stats: {
        activeCompetitions: dashboardData?.football.totalCompetitions ?? 0,
        teams: dashboardData?.football.totalTeams ?? 0,
        upcomingMatches: dashboardData?.football.totalUpcomingFixtures ?? 0
      },
      features: ["Live Matches", "Team Rankings", "TOTS Voting", "Match Statistics"],
      image: "/images/football-hero.jpg" // Add actual image path
    },
    {
      name: "Basketball",
      href: "/sports/basketball",
      description: "Basketball tournaments, teams, and game schedules",
      icon: Target,
      color: "orange" as const,
      gradient: "from-orange-500/20 to-orange-600/10",
      stats: {
        activeCompetitions: "0",
        teams: "0",
        upcomingMatches: "0"
      },
      features: ["Tournament Brackets", "Player Stats", "Game Highlights", "Team Profiles"],
      image: "/images/basketball-hero.jpg" // Add actual image path
    }
  ];

  return (
    <>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-background min-h-[calc(100vh-6rem)] flex flex-col justify-center overflow-hidden">
          {/* Animated background gradient with grid pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-500/20 via-background to-background animate-pulse" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500/10 via-background to-background animate-pulse delay-1000" />
            {/* Grid pattern overlay */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(34, 197, 94, 0.5) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(34, 197, 94, 0.5) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            />
          </div>

          <div className="relative container mx-auto px-0 sm:px-4 py-6 sm:py-12 lg:py-16">
            <BlurFade>
              <div className="text-center space-y-6 sm:space-y-8 mb-16">
                <div className="relative max-w-[90vw] sm:max-w-none hero-title">
                  <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tight">
                    <span className="text-emerald-500">FUPRE</span> SPORTS MEDIA
                  </h1>
                  <div className="absolute -top-4 -right-4 w-8 h-8 sm:w-12 sm:h-12 bg-emerald-500/10 rounded-full animate-ping" />
                </div>
                <p className="hero-subtitle text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Your Ultimate Hub for University Sports Coverage, Live Updates, and Comprehensive Athletic Media
                </p>

                {/* Mission Statement */}
                <div className="hero-mission max-w-4xl mx-auto mt-8">
                  <p className="text-base sm:text-lg text-muted-foreground/80 leading-relaxed">
                    Connecting the FUPRE community through sports excellence, real-time coverage, and celebrating athletic achievements across all disciplines.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                  <Link
                    href="#sports"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-500 text-white text-lg font-medium hover:bg-emerald-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
                  >
                    Explore Sports
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-border bg-background/50 backdrop-blur-sm text-foreground text-lg font-medium hover:bg-accent transition-all duration-300 hover:scale-105"
                  >
                    Latest News
                    <Newspaper className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </BlurFade>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
        </section>

        {/* Platform Statistics */}
        <section className="stats-section py-16 bg-card/20 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <BlurFade>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Platform Overview</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Comprehensive sports coverage across the FUPRE community
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div
                  className="stats-card bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border text-center hover:scale-105 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/50">
                      <Users className={`h-6 w-6 text-blue-500`} />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold mb-2">{dashboardData?.general.totalTeams || 'Unknown'}</div>
                  <div className="text-sm text-muted-foreground">Total Teams</div>
                </div>
                <div
                  className="stats-card bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border text-center hover:scale-105 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/50">
                      <Trophy className={`h-6 w-6 text-emerald-500`} />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold mb-2">{dashboardData?.general.totalActiveCompetitions || '0'}</div>
                  <div className="text-sm text-muted-foreground">Active Competitions</div>
                </div>
                <div
                  className="stats-card bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border text-center hover:scale-105 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/50">
                      <Play className={`h-6 w-6 text-purple-500`} />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold mb-2">{dashboardData?.general.totalPlayedFixtures || '0'}</div>
                  <div className="text-sm text-muted-foreground">Matches Played</div>
                </div>
                <div
                  className="stats-card bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border text-center hover:scale-105 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/50">
                      <Newspaper className={`h-6 w-6 text-orange-500`} />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold mb-2">{dashboardData?.blogs.total || 'Unknown'}</div>
                  <div className="text-sm text-muted-foreground">News Articles</div>
                </div>
              </div>
            </BlurFade>
          </div>
        </section>

        {/* Sports Section */}
        <section id="sports" className="sports-section py-16">
          <div className="container mx-auto px-4">
            <BlurFade>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Explore Our Sports</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Dive into comprehensive coverage of university athletics
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {sports.map((sport) => {
                  const Icon = sport.icon;
                  const colorClasses = {
                    emerald: {
                      border: "border-emerald-500/20",
                      text: "text-emerald-500",
                      button: "bg-emerald-500 hover:bg-emerald-600",
                      accent: "bg-emerald-500/10"
                    },
                    orange: {
                      border: "border-orange-500/20",
                      text: "text-orange-500",
                      button: "bg-orange-500 hover:bg-orange-600",
                      accent: "bg-orange-500/10"
                    }
                  }[sport.color] || {
                    border: "border-emerald-500/20",
                    text: "text-emerald-500",
                    button: "bg-emerald-500 hover:bg-emerald-600",
                    accent: "bg-emerald-500/10"
                  };

                  return (
                    <div
                      key={sport.name}
                      className={`sports-card relative bg-gradient-to-br ${sport.gradient} backdrop-blur-sm rounded-2xl p-8 border ${colorClasses.border} overflow-hidden group hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl`}
                    >
                      {/* Background decoration */}
                      <div className={`absolute top-0 right-0 w-32 h-32 ${colorClasses.text} opacity-5 transform rotate-12 translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className="w-full h-full" />
                      </div>

                      <div className="relative">
                        <div className="flex items-center gap-4 mb-6">
                          <div className={`flex h-14 w-14 items-center justify-center rounded-full ${colorClasses.accent} backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className={`h-7 w-7 ${colorClasses.text}`} />
                          </div>
                          <div>
                            <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                              {sport.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">University Athletics</p>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-8 text-base leading-relaxed">
                          {sport.description}
                        </p>

                        {/* Enhanced Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                          <div className="text-center p-3 rounded-lg bg-background/30 backdrop-blur-sm">
                            <div className="text-xl font-bold">{sport.stats.activeCompetitions}</div>
                            <div className="text-xs text-muted-foreground">Competitions</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-background/30 backdrop-blur-sm">
                            <div className="text-xl font-bold">{sport.stats.teams}</div>
                            <div className="text-xs text-muted-foreground">Teams</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-background/30 backdrop-blur-sm">
                            <div className="text-xl font-bold">{sport.stats.upcomingMatches}</div>
                            <div className="text-xs text-muted-foreground">Upcoming</div>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="mb-8">
                          <div className="flex flex-wrap gap-2">
                            {sport.features.map((feature) => (
                              <span
                                key={feature}
                                className="inline-block px-3 py-1.5 rounded-full bg-background/40 backdrop-blur-sm text-xs font-medium border border-border/50"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        <Link
                          href={sport.href}
                          className={`inline-flex items-center gap-2 px-8 py-4 rounded-full ${colorClasses.button} text-white text-base font-medium transition-all duration-300 hover:scale-105 shadow-lg group`}
                        >
                          Explore {sport.name}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </BlurFade>
          </div>
        </section>

        {/* Featured Content Section */}
        <section className="featured-section py-16 bg-card/20 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Upcoming Matches */}
              <BlurFade>
                <div>
                  <div className="flex items-center gap-2 mb-8">
                    <Clock className="h-6 w-6 text-orange-500" />
                    <h2 className="text-2xl sm:text-3xl font-bold">Upcoming Matches</h2>
                  </div>

                  <div className="space-y-6">
                    {dashboardData && dashboardData.fixtures.latest.length > 0 && dashboardData.fixtures.latest.map((fixture) => {
                      const fixtureDate = fixture.scheduledDate ? new Date(fixture.scheduledDate) : null;
                      const dateLabel = fixtureDate && !isNaN(fixtureDate.getTime())
                        ? fixtureDate.toLocaleDateString('en-US')
                        : 'TBD';
                      const timeLabel = fixtureDate && !isNaN(fixtureDate.getTime())
                        ? fixtureDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
                        : '--:--';
                      const homeName = fixture.homeTeam?.name ?? fixture.temporaryHomeTeamName ?? 'Home';
                      const awayName = fixture.awayTeam?.name ?? fixture.temporaryAwayTeamName ?? 'Away';

                      return (
                        <Link
                          key={fixture.id}
                          href={`/sports/football/fixtures/${fixture.id}/stats`}
                          className="block"
                        >
                          <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-orange-500/30 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                              <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-medium">
                                Football
                              </span>
                              <div className="text-right">
                                <div className="text-sm font-medium">{dateLabel}</div>
                                <div className="text-xs text-muted-foreground">{timeLabel}</div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                              <div className="text-center flex-1">
                                <div className="font-semibold text-sm">{homeName}</div>
                              </div>
                              <div className="px-4">
                                <div className="text-lg font-bold text-muted-foreground">VS</div>
                              </div>
                              <div className="text-center flex-1">
                                <div className="font-semibold text-sm">{awayName}</div>
                              </div>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{fixture.stadium || 'TBD'}</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                    {
                      ( !dashboardData || dashboardData.fixtures.latest.length === 0 ) && (
                        <div className="flex flex-col justify-center items-center gap-6 p-8 border border-muted-foreground bg-card rounded-lg">
                          <Calendar className="w-8 h-8" />
                          <div className="text-center">
                            <p>Uh Oh! No Upcoming Fixtures</p>
                            <span className="text-sm">Contach FSM to add your friendly or something</span>
                          </div>
                        </div>
                      )
                    }
                    {dashboardData && (
                      <div className="mt-2 rounded-lg border border-dashed border-border/70 bg-background/40 p-4 text-xs sm:text-sm text-muted-foreground">
                        Basketball fixtures are not available yet. Check back later for updates.
                      </div>
                    )}
                  </div>

                  <div className="mt-8">
                    <Link
                      href="/sports/football/fixtures"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300"
                    >
                      View All Fixtures
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </BlurFade>

              {/* Latest News */}
              <BlurFade>
                <div>
                  <div className="flex items-center gap-2 mb-8">
                    <Newspaper className="h-6 w-6 text-emerald-500" />
                    <h2 className="text-2xl sm:text-3xl font-bold">Latest News</h2>
                  </div>

                  <div className="space-y-6">
                    {dashboardData && dashboardData.blogs.latest.length > 0 && dashboardData.blogs.latest.map((article, index) => (
                      <Link
                        key={index}
                        href={`/news/${article._id}`}
                        className="block group"
                      >
                        <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-emerald-500/30 transition-all duration-300 hover:scale-[1.02]">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium">
                              {article.category}
                            </span>
                            <span className="text-xs text-muted-foreground">{'2mins'}</span>
                          </div>
                          <h3 className="font-semibold text-foreground mb-2 group-hover:text-emerald-500 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {article.content.slice(0, 125)}...
                          </p>
                          <div className="flex items-center gap-2 mt-4 text-emerald-500 text-sm font-medium">
                            Read more
                            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    ))}
                    {
                      ( !dashboardData || dashboardData.blogs.latest.length === 0 ) && (
                        <div className="flex flex-col justify-center items-center gap-6 p-8 border border-muted-foreground bg-card rounded-lg">
                          <Newspaper className="w-8 h-8" />
                          <div className="text-center">
                            <p>Huh? No Blogs???</p>
                            <span className="text-sm">Thats not right. Contact FSM to report the issue</span>
                          </div>
                        </div>
                      )
                    }
                  </div>

                  <div className="mt-8">
                    <Link
                      href="/news"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all duration-300"
                    >
                      View All News
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </BlurFade>


            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <BlurFade>
              <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-orange-500/10 rounded-2xl p-8 sm:p-12 text-center border border-emerald-500/20">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    Join the FUPRE Sports Community
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    Stay connected with live updates, match highlights, and exclusive content from all university sports activities.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/highlights"
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-all duration-300 hover:scale-105"
                    >
                      <Play className="w-5 h-5" />
                      Watch Highlights
                    </Link>
                    <Link
                      href="/teams"
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-border bg-background/50 backdrop-blur-sm text-foreground font-medium hover:bg-accent transition-all duration-300 hover:scale-105"
                    >
                      <Users className="w-5 h-5" />
                      Explore Teams
                    </Link>
                  </div>
                </div>
              </div>
            </BlurFade>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
