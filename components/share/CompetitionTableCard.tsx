import { teamLogos } from '@/constants'
import { ILeagueStandings, IV2FootballCompetition } from '@/utils/V2Utils/v2requestData.types'
import Image from 'next/image'
import { Trophy, Share2, Download } from 'lucide-react'
import { useRef } from 'react'
import html2canvas from 'html2canvas'

export const LeagueTableShareCard = ({ 
  table, 
  competition,
  showTableStandingsRange,
}: { 
  table: ILeagueStandings[], 
  competition: IV2FootballCompetition,
  showTableStandingsRange: number[],
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadCard = async (cardRef: React.RefObject<HTMLDivElement | null>, filename: string) => {
  if (!cardRef.current) return;
  
  try {
    const canvas = await html2canvas(cardRef!.current, {
    backgroundColor: '#ffffff',
    scale: 2,
    logging: false,
    useCORS: true,
    });

    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL();
    link.click();
  } catch (error) {
    console.error('Error generating image:', error);
  }
};

const shareCard = async (cardRef: React.RefObject<HTMLDivElement | null>, title: string) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: `Check out this ${title.toLowerCase()} from ${competition.name}`,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  }
};

  return (
    <div ref={cardRef} className="bg-card p-4 rounded-xl shadow-lg max-w-md mx-auto border border-muted-foreground">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-emerald-500 font-bold text-lg">{competition.name}</div>
        <div className="text-muted-foreground text-sm">League Standings - {competition.season}</div>
      </div>

      {/* Compact Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-2 text-xs font-semibold uppercase">Pos</th>
              <th className="text-left py-2 px-2 text-xs font-semibold uppercase">Team</th>
              <th className="text-center py-2 px-1 text-xs font-semibold uppercase">P</th>
              <th className="text-center py-2 px-1 text-xs font-semibold uppercase">Pts</th>
              <th className="text-center py-2 px-1 text-xs font-semibold uppercase">Form</th>
            </tr>
          </thead>
          <tbody>
            {table.slice(showTableStandingsRange[0], showTableStandingsRange[1]).map((entry, index) => (
              <tr key={entry.team._id} className="border-b border-gray-100">
                <td className="py-2 px-2 text-sm">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${
                    entry.position < 9 
                        ? 'bg-emerald-300 text-black' 
                        : entry.position > 8 && entry.position < 17
                            ? 'bg-orange-300 text-black'
                            : 'bg-red-300 text-black'
                  }`}>
                    {entry.position}
                  </span>
                </td>
                <td className="py-2 px-2">
                  <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6">
                      <Image
                        src={teamLogos[entry.team.name] || '/images/team_logos/default.jpg'}
                        alt={entry.team.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-sm font-medium truncate max-w-[120px]">{entry.team.name}</span>
                  </div>
                </td>
                <td className="text-center py-2 px-1 text-sm">{entry.played}</td>
                <td className="text-center py-2 px-1 text-sm font-bold">{entry.points}</td>
                <td className="text-center py-2 px-1">
                  <div className="flex justify-center gap-0.5">
                    {[...entry.form].reverse().slice(0, 3).map((result, i) => (
                      <span key={i} className={`w-4 h-4 flex items-center justify-center text-[8px] ${
                        result === 'W' ? 'bg-emerald-500 text-white' :
                        result === 'D' ? 'bg-orange-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {result}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Direct Qualification</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          <span>Playoffs</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span>Elimination</span>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-4 pt-3 border-t text-center">
        <div className="text-xs text-muted-foreground">View full table on</div>
        <div className="text-sm font-semibold text-emerald-600">Fupre Sports Media</div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-center gap-3">
        <button 
          onClick={() => downloadCard(cardRef, 'league-table')}
          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white rounded-full text-xs"
        >
          <Download className="w-3 h-3" />
          Download
        </button>
        <button 
          onClick={() => shareCard(cardRef, 'League Table')}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-full text-xs"
        >
          <Share2 className="w-3 h-3" />
          Share
        </button>
      </div>
    </div>
  )
}