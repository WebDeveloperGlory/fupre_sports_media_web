import { teamLogos } from '@/constants'
import { PopIV2FootballFixture, IV2FootballCompetition } from '@/utils/V2Utils/v2requestData.types'
import Image from 'next/image'
import { Calendar, Clock, ChevronLeft, ChevronRight, Share2, Download } from 'lucide-react'
import { useRef, useState } from 'react'
import { format } from 'date-fns'
import { FixtureStatus } from '@/utils/V2Utils/v2requestData.enums'

export const UpcomingFixturesShareCard = ({ 
  fixtures,
  competition
}: { 
  fixtures: PopIV2FootballFixture[],
  competition: IV2FootballCompetition
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [currentFixtureIndex, setCurrentFixtureIndex] = useState(0)
  const upcomingFixtures = fixtures.filter(f => f.status === FixtureStatus.SCHEDULED)
  
  if (upcomingFixtures.length === 0) return null

  const currentFixture = upcomingFixtures[currentFixtureIndex]
  const formattedDate = format(new Date(currentFixture.scheduledDate), 'MMM d, yyyy')
  const formattedTime = format(new Date(currentFixture.scheduledDate), 'HH:mm')

  const handlePrev = () => {
    setCurrentFixtureIndex(prev => 
      prev === 0 ? upcomingFixtures.length - 1 : prev - 1
    )
  }

  const handleNext = () => {
    setCurrentFixtureIndex(prev => 
      prev === upcomingFixtures.length - 1 ? 0 : prev + 1
    )
  }

  const downloadCard = async () => {
    if (!cardRef.current) return
    
    try {
      // Dynamically import html2canvas only when needed
      const html2canvas = (await import('html2canvas')).default
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
      })
      
      const link = document.createElement('a')
      link.download = `upcoming-fixture-${currentFixtureIndex + 1}.png`
      link.href = canvas.toDataURL('image/png')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error generating image:', error)
      alert('Failed to generate image. Please try again.')
    }
  }

  const shareCard = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Upcoming: ${currentFixture.homeTeam.name} vs ${currentFixture.awayTeam.name}`,
          text: `Check out this upcoming match in ${competition.name}`,
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      } catch (error) {
        console.error('Error copying to clipboard:', error)
        alert('Failed to share. Please copy the URL manually.')
      }
    }
  }

  return (
    <div ref={cardRef} className="bg-card p-4 rounded-xl shadow-lg max-w-md mx-auto border border-muted-foreground">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-emerald-500 font-bold text-lg">{competition.name}</div>
        <div className="text-muted-foreground text-sm">Upcoming Fixtures • {formattedDate}</div>
      </div>

      {/* Fixture Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={handlePrev}
          className="p-1 rounded-full bg-secondary"
          aria-label="Previous fixture"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="text-sm font-medium">
          {currentFixtureIndex + 1} of {upcomingFixtures.length}
        </div>
        
        <button 
          onClick={handleNext}
          className="p-1 rounded-full bg-secondary"
          aria-label="Next fixture"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Fixture Details */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="w-12 h-12 relative">
            <Image
              src={teamLogos[currentFixture.homeTeam.name] || '/images/team_logos/default.jpg'}
              alt={currentFixture.homeTeam.name}
              fill
              className="object-contain"
            />
          </div>
          <span className="text-sm font-medium text-center">
            {currentFixture.homeTeam.name}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">vs</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <Clock className="w-3 h-3" />
            <span>{formattedTime}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {currentFixture.stadium}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="w-12 h-12 relative">
            <Image
              src={teamLogos[currentFixture.awayTeam.name] || '/images/team_logos/default.jpg'}
              alt={currentFixture.awayTeam.name}
              fill
              className="object-contain"
            />
          </div>
          <span className="text-sm font-medium text-center">
            {currentFixture.awayTeam.name}
          </span>
        </div>
      </div>

      {/* Match Context */}
      <div className="bg-secondary rounded-lg p-3 text-center mb-4">
        <div className="text-xs text-muted-foreground mb-1">Upcoming Match</div>
        <div className="text-sm font-medium">
          {currentFixture.matchType} • {formattedDate}
        </div>
      </div>

      {/* Call to Action */}
      <div className="border-t pt-3 text-center">
        <div className="text-xs text-muted-foreground">View all fixtures on</div>
        <div className="text-sm font-semibold text-emerald-600">Fupre Sports Media</div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-center gap-3">
        <button 
          onClick={downloadCard}
          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-xs"
        >
          <Download className="w-3 h-3" />
          Download
        </button>
        <button 
          onClick={shareCard}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-xs"
        >
          <Share2 className="w-3 h-3" />
          Share
        </button>
      </div>
    </div>
  )
}