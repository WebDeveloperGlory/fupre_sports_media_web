'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FixtureTimeline } from '@/utils/V2Utils/v2requestSubData.types'
import { FixtureTimelineType, FixtureTimelineGoalType, FixtureTimelineCardType, TeamType } from '@/utils/V2Utils/v2requestData.enums'
import { Clock, Target, AlertTriangle, RotateCcw, Flag, UserX, Zap, Shield, Activity } from 'lucide-react'
import { PopulatedFixtureTimeline } from '@/utils/V2Utils/v2requestData.types'

interface TimelineProps {
  events?: PopulatedFixtureTimeline[]
  homeTeamName?: string
  awayTeamName?: string
  isLive?: boolean
}

const getEventIcon = (event: PopulatedFixtureTimeline) => {
  switch (event.type) {
    case FixtureTimelineType.GOAL:
      return <Target className="w-3 h-3 text-emerald-500" />
    case FixtureTimelineType.YELLOWCARD:
      return <div className="w-3 h-3 bg-yellow-500 rounded-sm" />
    case FixtureTimelineType.REDCARD:
      return <div className="w-3 h-3 bg-red-500 rounded-sm" />
    case FixtureTimelineType.SUBSTITUTION:
      return <RotateCcw className="w-3 h-3 text-blue-500" />
    case FixtureTimelineType.CORNER:
      return <Flag className="w-3 h-3 text-orange-500" />
    case FixtureTimelineType.OFFSIDE:
      return <UserX className="w-3 h-3 text-gray-500" />
    case FixtureTimelineType.PENALTYAWARDED:
      return <Zap className="w-3 h-3 text-purple-500" />
    case FixtureTimelineType.PENALTYMISSED:
      return <AlertTriangle className="w-3 h-3 text-red-400" />
    case FixtureTimelineType.PENALTYSAVED:
      return <Shield className="w-3 h-3 text-blue-600" />
    case FixtureTimelineType.OWNGOAL:
      return <Target className="w-3 h-3 text-red-500" />
    case FixtureTimelineType.VARDECISION:
      return <Activity className="w-3 h-3 text-indigo-500" />
    case FixtureTimelineType.INJURY:
      return <AlertTriangle className="w-3 h-3 text-amber-500" />
    default:
      return <div className="w-3 h-3 bg-gray-400 rounded-full" />
  }
}

const getEventText = (event: PopulatedFixtureTimeline, homeTeamName?: string, awayTeamName?: string) => {
  const teamName = event.team === TeamType.HOME ? (homeTeamName || 'Home Team') : (awayTeamName || 'Away Team')
  const playerName = event.player?.name || 'Unknown Player'
  const relatedPlayerName = event.relatedPlayer?.name

  switch (event.type) {
    case FixtureTimelineType.GOAL:
      const goalTypeText = event.goalType === FixtureTimelineGoalType.PENALTY ? ' (Penalty)' :
                          event.goalType === FixtureTimelineGoalType.FREEKICK ? ' (Free Kick)' :
                          event.goalType === FixtureTimelineGoalType.HEADER ? ' (Header)' :
                          event.goalType === FixtureTimelineGoalType.OWNGOAL ? ' (Own Goal)' : ''
      const assistText = relatedPlayerName ? ` - Assist: ${relatedPlayerName}` : ''
      return `Goal${goalTypeText} - ${playerName}${assistText}`

    case FixtureTimelineType.YELLOWCARD:
      return `Yellow Card - ${playerName}`

    case FixtureTimelineType.REDCARD:
      const cardTypeText = event.cardType === FixtureTimelineCardType.SECONDYELLOW ? ' (Second Yellow)' :
                          event.cardType === FixtureTimelineCardType.STRAIGHTRED ? ' (Straight Red)' : ''
      return `Red Card${cardTypeText} - ${playerName}`

    case FixtureTimelineType.SUBSTITUTION:
      return `Substitution - ${playerName} ${relatedPlayerName ? `replaces ${relatedPlayerName}` : ''}`

    case FixtureTimelineType.CORNER:
      return `Corner - ${teamName}`

    case FixtureTimelineType.OFFSIDE:
      return `Offside - ${playerName}`

    case FixtureTimelineType.PENALTYAWARDED:
      return `Penalty Awarded - ${teamName}`

    case FixtureTimelineType.PENALTYMISSED:
      return `Penalty Missed - ${playerName}`

    case FixtureTimelineType.PENALTYSAVED:
      return `Penalty Saved - ${playerName}`

    case FixtureTimelineType.OWNGOAL:
      return `Own Goal - ${playerName}`

    case FixtureTimelineType.VARDECISION:
      return `VAR Decision - ${event.description || 'Review completed'}`

    case FixtureTimelineType.INJURY:
      return `Injury - ${playerName}`

    default:
      return event.description || 'Match Event'
  }
}

const getEventColor = (event: PopulatedFixtureTimeline) => {
  switch (event.type) {
    case FixtureTimelineType.GOAL:
    case FixtureTimelineType.OWNGOAL:
      return 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/20'
    case FixtureTimelineType.YELLOWCARD:
      return 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-900/20'
    case FixtureTimelineType.REDCARD:
      return 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/20'
    case FixtureTimelineType.SUBSTITUTION:
      return 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/20'
    case FixtureTimelineType.VARDECISION:
      return 'border-indigo-200 bg-indigo-50/50 dark:border-indigo-800 dark:bg-indigo-900/20'
    default:
      return 'border-border bg-card/40'
  }
}

const Timeline = ({ events = [], homeTeamName, awayTeamName, isLive = false }: TimelineProps) => {
  // Ensure events is always an array
  const safeEvents = Array.isArray(events) ? events : []
  const sortedEvents = [...safeEvents].sort((a, b) => b.minute - a.minute)

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border'>
        <div className="flex items-center justify-between">
          <h1 className='font-bold flex items-center gap-2'>
            <Clock className="w-4 h-4" />
            Match Timeline
          </h1>
          {isLive && (
            <span className="flex items-center gap-1 text-red-600 text-sm">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              LIVE
            </span>
          )}
        </div>
      </div>

      {/* Timeline Events */}
      <div className="space-y-3">
        {sortedEvents.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 bg-card/20 rounded-xl border border-border">
            No events yet
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

            {/* Events */}
            <div className="space-y-3">
              {sortedEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-16"
                >
                  {/* Event icon */}
                  <div className="absolute left-4 -translate-x-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-background border-2 border-border">
                    {getEventIcon(event)}
                  </div>

                  {/* Event content */}
                  <div className={`rounded-xl border backdrop-blur-sm p-4 hover:bg-accent/30 transition-all duration-300 ${getEventColor(event)}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-semibold text-foreground bg-background/80 px-2 py-1 rounded">
                            {event.minute}'{event.injuryTime ? '+' : ''}
                          </span>
                          <span className="text-sm font-medium">
                            {getEventText(event, homeTeamName, awayTeamName)}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-sm text-muted-foreground pl-12">
                            {event.description}
                          </p>
                        )}
                      </div>

                      {/* Team indicator */}
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        event.team === TeamType.HOME
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {event.team === TeamType.HOME ? 'H' : 'A'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Timeline