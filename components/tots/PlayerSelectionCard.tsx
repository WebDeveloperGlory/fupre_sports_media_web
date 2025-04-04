'use client';

import { TOTSPlayer } from "@/utils/requestDataTypes";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PlayerSelectionCardProps {
  player: TOTSPlayer;
  isSelected: boolean;
  onSelect: (playerId: string) => void;
  disabled?: boolean;
}

const PlayerSelectionCard = ({ 
  player, 
  isSelected, 
  onSelect,
  disabled = false
}: PlayerSelectionCardProps) => {
  const handleClick = () => {
    if (!disabled) {
      onSelect(player._id);
    }
  };

  // Helper function to get position color
  const getPositionColor = (position: string) => {
    const pos = position.toLowerCase();
    if (pos.includes('goalkeeper') || pos === 'gk') return 'bg-yellow-500/20 text-yellow-600';
    if (pos.includes('defender') || pos === 'def') return 'bg-blue-500/20 text-blue-600';
    if (pos.includes('midfielder') || pos === 'mid') return 'bg-green-500/20 text-green-600';
    if (pos.includes('forward') || pos === 'fwd' || pos.includes('striker')) return 'bg-red-500/20 text-red-600';
    return 'bg-gray-500/20 text-gray-600';
  };

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <Card 
        className={cn(
          "border overflow-hidden transition-all cursor-pointer",
          isSelected 
            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" 
            : "border-border hover:border-emerald-200 dark:hover:border-emerald-800",
          disabled && "opacity-60 cursor-not-allowed"
        )}
        onClick={handleClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-sm">{player.name}</h3>
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full", getPositionColor(player.position))}>
                    {player.position}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {player.team.name}
                  </span>
                </div>
              </div>
            </div>
            
            {isSelected && (
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <CheckCircle className="w-4 h-4" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PlayerSelectionCard;
