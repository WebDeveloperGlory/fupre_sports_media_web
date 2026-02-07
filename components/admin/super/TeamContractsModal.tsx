"use client";

import React from "react";
import { X, User, Calendar, Target, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  FootballTeamResponse,
  FootballPlayerContractResponse,
} from "@/lib/types/v1.response.types";
import {
  PlayerContractType,
  PlayerPosition,
} from "@/types/v1.football-player.types";
import { format } from "date-fns";

interface TeamContractsModalProps {
  team: FootballTeamResponse;
  contracts: FootballPlayerContractResponse[];
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const CONTRACT_TYPE_LABELS: Record<PlayerContractType, string> = {
  [PlayerContractType.PERMANENT]: "Permanent",
  [PlayerContractType.ON_LOAN]: "Loan",
  [PlayerContractType.TRIAL]: "Trial",
};

const POSITION_LABELS: Record<PlayerPosition, string> = {
  [PlayerPosition.GK]: "Goalkeeper",
  [PlayerPosition.CB]: "Center Back",
  [PlayerPosition.LB]: "Left Back",
  [PlayerPosition.RB]: "Right Back",
  [PlayerPosition.CM]: "Central Midfielder",
  [PlayerPosition.AM]: "Attacking Midfielder",
  [PlayerPosition.LM]: "Left Midfielder",
  [PlayerPosition.RM]: "Right Midfielder",
  [PlayerPosition.LW]: "Left Winger",
  [PlayerPosition.RW]: "Right Winger",
  [PlayerPosition.SS]: "Second Striker",
  [PlayerPosition.CF]: "Center Forward",
};

export default function TeamContractsModal({
  team,
  contracts,
  loading,
  isOpen,
  onClose,
}: TeamContractsModalProps) {
  if (!isOpen) return null;

  const activeContracts = contracts.filter((c) => c.isActive);
  const expiredContracts = contracts.filter((c) => !c.isActive);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-background rounded-lg shadow-lg">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background p-6 rounded-t-lg">
            <div>
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {team.name} - Player Contracts
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {contracts.length} total contracts ({activeContracts.length}{" "}
                active)
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">
                    Loading contracts...
                  </p>
                </div>
              </div>
            ) : contracts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground">
                  No contracts found
                </h3>
                <p className="text-muted-foreground">
                  This team doesn't have any player contracts yet
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Active Contracts */}
                {activeContracts.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                      <User className="h-4 w-4 text-emerald-500" />
                      Active Contracts ({activeContracts.length})
                    </h3>
                    <div className="space-y-3">
                      {activeContracts.map((contract) => (
                        <div
                          key={contract.id}
                          className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-foreground">
                                {contract.player.name} #{contract.jerseyNumber}
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Target className="h-3 w-3" />
                                  {POSITION_LABELS[contract.position]}
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <FileText className="h-3 w-3" />
                                  {CONTRACT_TYPE_LABELS[contract.contractType]}
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {format(
                                    new Date(contract.startDate),
                                    "MMM yyyy",
                                  )}{" "}
                                  -
                                  {contract.endDate
                                    ? format(
                                        new Date(contract.endDate),
                                        "MMM yyyy",
                                      )
                                    : "Present"}
                                </span>
                              </div>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-medium">
                              Active
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expired Contracts */}
                {expiredContracts.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      Expired Contracts ({expiredContracts.length})
                    </h3>
                    <div className="space-y-3">
                      {expiredContracts.map((contract) => (
                        <div
                          key={contract.id}
                          className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-foreground">
                                {contract.player.name} #{contract.jerseyNumber}
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Target className="h-3 w-3" />
                                  {POSITION_LABELS[contract.position]}
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <FileText className="h-3 w-3" />
                                  {CONTRACT_TYPE_LABELS[contract.contractType]}
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {format(
                                    new Date(contract.startDate),
                                    "MMM yyyy",
                                  )}{" "}
                                  -
                                  {contract.endDate
                                    ? format(
                                        new Date(contract.endDate),
                                        "MMM yyyy",
                                      )
                                    : "Present"}
                                </span>
                              </div>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">
                              Expired
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contract Statistics */}
                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-medium text-foreground mb-4">
                    Contract Statistics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {contracts.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Contracts
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-emerald-600">
                        {activeContracts.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Active Contracts
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-amber-600">
                        {expiredContracts.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Expired Contracts
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {new Set(contracts.map((c) => c.player)).size}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Unique Players
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6">
            <div className="flex justify-end">
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
