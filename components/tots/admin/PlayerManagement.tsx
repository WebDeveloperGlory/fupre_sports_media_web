'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Trash, User } from "lucide-react";
import { TOTSPlayer } from "@/utils/requestDataTypes";
import { addPlayerToTOTSSession, removePlayerFromTOTSSession } from "@/lib/requests/tots/requests";
import useAuthStore from "@/stores/authStore";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

interface PlayerManagementProps {
  sessionId: string;
  players: TOTSPlayer[];
  onPlayersUpdated: () => void;
}

interface PlayerSearchResult {
  _id: string;
  name: string;
  position: string;
  team: {
    _id: string;
    name: string;
  };
}

const PlayerManagement = ({ sessionId, players, onPlayersUpdated }: PlayerManagementProps) => {
  const { jwt } = useAuthStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlayerSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [isRemovingPlayer, setIsRemovingPlayer] = useState(false);
  
  // Mock search function - in a real app, this would call an API endpoint
  const searchPlayers = async (query: string) => {
    setIsSearching(true);
    
    // This is a mock implementation - replace with actual API call
    try {
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data - replace with actual API response
      const mockResults: PlayerSearchResult[] = [
        { _id: "p1", name: "John Doe", position: "Forward", team: { _id: "t1", name: "Team A" } },
        { _id: "p2", name: "Jane Smith", position: "Midfielder", team: { _id: "t2", name: "Team B" } },
        { _id: "p3", name: "Bob Johnson", position: "Defender", team: { _id: "t3", name: "Team C" } },
      ].filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.position.toLowerCase().includes(query.toLowerCase()) ||
        p.team.name.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error("Error searching players:", error);
      toast.error("Failed to search players");
    } finally {
      setIsSearching(false);
    }
  };
  
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const delayDebounceFn = setTimeout(() => {
        searchPlayers(searchQuery);
      }, 300);
      
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);
  
  const handleAddPlayer = async (player: PlayerSearchResult) => {
    if (!jwt) {
      toast.error("You must be logged in to add players");
      return;
    }
    
    if (!selectedPosition) {
      toast.error("Please select a position for this player");
      return;
    }
    
    setIsAddingPlayer(true);
    
    try {
      const response = await addPlayerToTOTSSession(jwt, sessionId, {
        playerId: player._id,
        position: selectedPosition
      });
      
      if (response && response.code === "00") {
        toast.success(`${player.name} added to TOTS session`);
        onPlayersUpdated();
        setSearchQuery("");
        setSearchResults([]);
        setSelectedPosition("");
      } else {
        toast.error(response?.message || "Failed to add player");
      }
    } catch (error) {
      console.error("Error adding player:", error);
      toast.error("An error occurred while adding the player");
    } finally {
      setIsAddingPlayer(false);
    }
  };
  
  const handleRemovePlayer = async (playerId: string) => {
    if (!jwt) {
      toast.error("You must be logged in to remove players");
      return;
    }
    
    setIsRemovingPlayer(true);
    
    try {
      const response = await removePlayerFromTOTSSession(jwt, sessionId, playerId);
      
      if (response && response.code === "00") {
        toast.success("Player removed from TOTS session");
        onPlayersUpdated();
      } else {
        toast.error(response?.message || "Failed to remove player");
      }
    } catch (error) {
      console.error("Error removing player:", error);
      toast.error("An error occurred while removing the player");
    } finally {
      setIsRemovingPlayer(false);
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-500" />
            Add Players
          </CardTitle>
          <CardDescription>
            Search and add players to this TOTS session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search players by name, team or position..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Select Position</option>
                <option value="Goalkeeper">Goalkeeper</option>
                <option value="Defender">Defender</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Forward">Forward</option>
              </select>
            </div>
            
            {isSearching && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">Searching...</p>
              </div>
            )}
            
            {!isSearching && searchResults.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Search Results</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.map((player) => (
                    <div
                      key={player._id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{player.name}</h4>
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
                      <Button
                        size="sm"
                        onClick={() => handleAddPlayer(player)}
                        disabled={isAddingPlayer || !selectedPosition}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {!isSearching && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No players found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-500" />
            Current Players
          </CardTitle>
          <CardDescription>
            Players currently in this TOTS session
          </CardDescription>
        </CardHeader>
        <CardContent>
          {players.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No players added yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Group players by position */}
              {["Goalkeeper", "Defender", "Midfielder", "Forward"].map((position) => {
                const positionPlayers = players.filter(
                  (p) => p.position.toLowerCase() === position.toLowerCase()
                );
                
                if (positionPlayers.length === 0) return null;
                
                return (
                  <div key={position} className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <span className={cn("text-xs px-2 py-0.5 rounded-full", getPositionColor(position))}>
                        {position}s
                      </span>
                      <span className="text-muted-foreground">
                        ({positionPlayers.length})
                      </span>
                    </h3>
                    <div className="space-y-2">
                      {positionPlayers.map((player) => (
                        <div
                          key={player._id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">{player.name}</h4>
                              <span className="text-xs text-muted-foreground">
                                {player.team.name}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemovePlayer(player._id)}
                            disabled={isRemovingPlayer}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerManagement;
