import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OccupationMatch, RIASECScores } from "@/pages/Assessment";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { DollarSign, TrendingUp, Clock, Target, Award } from "lucide-react";

interface OccupationResultsProps {
  occupations: OccupationMatch[];
  riasecScores: RIASECScores;
  onOccupationSelect: (occupation: OccupationMatch) => void;
  onBackToSkills: () => void;
  onBackToInterests: () => void;
}

const OccupationResults = ({ occupations, onOccupationSelect, onBackToSkills, onBackToInterests }: OccupationResultsProps) => {
  // Pagination state (2 pages max, 25 per page)
  const PAGE_SIZE = 25;
  const totalPages = Math.ceil(occupations.length / PAGE_SIZE);
  const [page, setPage] = useState(0);

  // Generate positions for up to 25 items using 3 rings (7 + 9 + 9)
  const generatePositions = (count: number) => {
    const positions: { x: number; y: number }[] = [];
    let remaining = count;

    const ringConfigs = [
      { cap: 7, radius: 22, offsetFactor: 0 },
      { cap: 9, radius: 34, offsetFactor: 0.5 },
      { cap: 9, radius: 46, offsetFactor: 0.33 },
    ];

    for (let r = 0; r < ringConfigs.length && remaining > 0; r++) {
      const { cap, radius, offsetFactor } = ringConfigs[r];
      const useCount = Math.min(cap, remaining);
      const baseOffset = 360 / (useCount * (offsetFactor === 0 ? 1 : (1/offsetFactor)));
      for (let i = 0; i < useCount; i++) {
        const angle = (i * 360 / useCount) + (baseOffset * offsetFactor) - 90;
        const rad = (angle * Math.PI) / 180;
        positions.push({
          x: Math.round((50 + radius * Math.cos(rad)) * 10) / 10,
          y: Math.round((50 + radius * Math.sin(rad)) * 10) / 10,
        });
      }
      remaining -= useCount;
    }
    return positions;
  };

  const currentSlice = occupations.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const desktopPositions = generatePositions(currentSlice.length);

  // Mobile: single ring if <=10 else two rings
  const generateMobilePositions = (count: number) => {
    const pos: { x: number; y: number }[] = [];
    if (count <= 10) {
      for (let i = 0; i < count; i++) {
        const angle = (i * 360 / count) - 90;
        const rad = (angle * Math.PI)/180;
        pos.push({ x: Math.round((50 + 38 * Math.cos(rad))*10)/10, y: Math.round((50 + 38 * Math.sin(rad))*10)/10 });
      }
    } else {
      const inner = Math.min(8, count);
      const outer = count - inner;
      for (let i=0;i<inner;i++) {
        const angle = (i * 360 / inner) - 90;
        const rad = (angle * Math.PI)/180;
        pos.push({ x: Math.round((50 + 30 * Math.cos(rad))*10)/10, y: Math.round((50 + 30 * Math.sin(rad))*10)/10 });
      }
      for (let i=0;i<outer;i++) {
        const angle = (i * 360 / outer) - 90 + (360/(outer*2));
        const rad = (angle * Math.PI)/180;
        pos.push({ x: Math.round((50 + 42 * Math.cos(rad))*10)/10, y: Math.round((50 + 42 * Math.sin(rad))*10)/10 });
      }
    }
    return pos;
  };
  const mobilePositions = generateMobilePositions(currentSlice.length);

  // Color variants for different occupations
  const getColor = (index: number) => {
    const colors = [
      "hsl(var(--uh-green))",
      "hsl(var(--accent))",
      "hsl(var(--primary))",
    ];
    return colors[index % colors.length];
  };

  const orbitOccupations = currentSlice; // rename for clarity

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <Card className="p-4 md:p-8 shadow-lg bg-gradient-to-br from-background to-uh-green/5">
        {/* Navigation */}
        <div className="flex gap-2 mb-6">
          <Button 
            variant="outline" 
            onClick={onBackToInterests}
            className="text-sm"
          >
            ← Back to Interests
          </Button>
          <Button 
            variant="outline" 
            onClick={onBackToSkills}
            className="text-sm"
          >
            ← Back to Skills
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-uh-green to-primary bg-clip-text text-transparent mb-4">
            Your Career Possibilities
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore careers based on your interests and skills. Hover over each career to learn more.
          </p>
        </div>

        {/* Career Map */}
        <div className="relative w-full h-[500px] md:h-[600px] bg-gradient-to-br from-muted/20 to-muted/5 rounded-xl border-2 border-border/50 mb-8 overflow-hidden">
          {/* Center Circle lowered z-index so orbit dots appear above */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-uh-green/30 to-primary/30 rounded-full blur-3xl" />
              <Card className="relative w-32 h-32 md:w-48 md:h-48 rounded-full flex items-center justify-center border-4 border-border/50 bg-background/95 shadow-xl">
                <div className="text-center px-2 md:px-4">
                  <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                    Explore paths
                  </p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">based on...</p>
                  <div className="mt-1 md:mt-2 text-xl md:text-2xl">
                    🎯 💪
                  </div>
                </div>
              </Card>
            </div>
          </div>

            {/* Career Dots - Desktop (paginated orbital view) */}
            <div className="hidden md:block">
              {orbitOccupations.map((occupation, index) => {
              const pos = desktopPositions[index] || { x: 50, y: 50 };
              const color = getColor(index);

              return (
                <HoverCard key={occupation.onetCode} openDelay={200}>
                  <HoverCardTrigger asChild>
                    <button
                      className="absolute group cursor-pointer animate-[float_3s_ease-in-out_infinite] z-20"
                      style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        transform: 'translate(-50%, -50%)',
                        animationDelay: `${index * 0.2}s`,
                      }}
                      onClick={() => onOccupationSelect(occupation)}
                    >
                      {/* Glow effect */}
                      <div
                        className="absolute inset-0 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity"
                        style={{ backgroundColor: color }}
                      />
                      
                      {/* Dot */}
                      <div
                        className="relative w-3 h-3 rounded-full transition-transform group-hover:scale-150"
                        style={{ backgroundColor: color }}
                      />
                      
                      {/* Label - always visible */}
                      <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <div className="flex flex-col items-center gap-1">
                          <p className="text-xs font-medium text-foreground bg-background/95 px-2 py-1 rounded-md shadow-lg border border-border">
                            {occupation.title}
                          </p>
                          {occupation.compositeScore && (
                            <span className="text-[10px] font-bold text-uh-green bg-uh-green/10 px-2 py-0.5 rounded-full border border-uh-green/30">
                              {Math.round(occupation.compositeScore * 100)}% match
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80" side="top">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{occupation.title}</h3>
                        <p className="text-sm text-muted-foreground">{occupation.description}</p>
                      
                                            {/* Match Score & Interest Metadata */}
                                            {(occupation.compositeScore || occupation.interestSum) && (
                                              <div className="flex items-center gap-3 text-sm border-t pt-2">
                                                {occupation.compositeScore && (
                                                  <div className="flex items-center gap-1">
                                                    <Target className="w-4 h-4 text-uh-green" />
                                                    <span className="font-semibold text-uh-green">
                                                      {Math.round(occupation.compositeScore * 100)}% match
                                                    </span>
                                                  </div>
                                                )}
                                                {occupation.interestSum && (
                                                  <div className="flex items-center gap-1 text-muted-foreground">
                                                    <span className="text-xs">
                                                      Interest: {occupation.interestSum.toFixed(1)} ({occupation.interestsCount || 0} areas)
                                                    </span>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                      
                                            {/* SKA Rank if available */}
                                            {occupation.skaRank && (
                                              <div className="flex items-center gap-1 text-sm">
                                                <Award className="w-4 h-4 text-accent" />
                                                <span className="text-xs text-muted-foreground">
                                                  Skills Rank: #{occupation.skaRank}
                                                </span>
                                              </div>
                                            )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-uh-green" />
                          <span className="font-medium">
                            ${(occupation.medianSalary / 1000).toFixed(0)}k
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-accent" />
                          <span className="text-xs">{occupation.growthOutlook}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-xs">{occupation.trainingDuration}</span>
                      </div>

                      <div>
                        <p className="text-xs font-semibold mb-2">Top Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {occupation.topSkills.map((skill) => (
                            <span
                              key={skill}
                              className="text-xs bg-muted px-2 py-1 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="w-full bg-uh-green hover:bg-uh-green/90"
                        onClick={() => onOccupationSelect(occupation)}
                      >
                        Explore Programs
                      </Button>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              );
            })}
          </div>

          {/* Career Dots - Mobile (paginated orbital view) */}
          <div className="md:hidden">
            {orbitOccupations.map((occupation, index) => {
              const pos = mobilePositions[index] || { x: 50, y: 50 };
              const color = getColor(index);

              return (
                <HoverCard key={occupation.onetCode} openDelay={200}>
                  <HoverCardTrigger asChild>
                    <button
                      className="absolute group cursor-pointer animate-[float_3s_ease-in-out_infinite] z-20"
                      style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        transform: 'translate(-50%, -50%)',
                        animationDelay: `${index * 0.2}s`,
                      }}
                      onClick={() => onOccupationSelect(occupation)}
                    >
                      {/* Glow effect */}
                      <div
                        className="absolute inset-0 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity"
                        style={{ backgroundColor: color }}
                      />
                      
                      {/* Dot */}
                      <div
                        className="relative w-3 h-3 rounded-full transition-transform group-hover:scale-150"
                        style={{ backgroundColor: color }}
                      />
                      
                      {/* Label - always visible */}
                      <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <div className="flex flex-col items-center gap-1">
                          <p className="text-[10px] font-medium text-foreground bg-background/95 px-2 py-1 rounded-md shadow-lg border border-border">
                            {occupation.title}
                          </p>
                          {occupation.compositeScore && (
                            <span className="text-[9px] font-bold text-uh-green bg-uh-green/10 px-1.5 py-0.5 rounded-full border border-uh-green/30">
                              {Math.round(occupation.compositeScore * 100)}%
                            </span>
                          )}
                        </div>
                      
                                            {/* Match Score & Interest Metadata */}
                                            {(occupation.compositeScore || occupation.interestSum) && (
                                              <div className="flex items-center gap-3 text-sm border-t pt-2">
                                                {occupation.compositeScore && (
                                                  <div className="flex items-center gap-1">
                                                    <Target className="w-4 h-4 text-uh-green" />
                                                    <span className="font-semibold text-uh-green">
                                                      {Math.round(occupation.compositeScore * 100)}% match
                                                    </span>
                                                  </div>
                                                )}
                                                {occupation.interestSum && (
                                                  <div className="flex items-center gap-1 text-muted-foreground">
                                                    <span className="text-xs">
                                                      Interest: {occupation.interestSum.toFixed(1)} ({occupation.interestsCount || 0} areas)
                                                    </span>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                      
                                            {/* SKA Rank if available */}
                                            {occupation.skaRank && (
                                              <div className="flex items-center gap-1 text-sm">
                                                <Award className="w-4 h-4 text-accent" />
                                                <span className="text-xs text-muted-foreground">
                                                  Skills Rank: #{occupation.skaRank}
                                                </span>
                                              </div>
                                            )}
                      </div>
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80" side="top">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{occupation.title}</h3>
                        <p className="text-sm text-muted-foreground">{occupation.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-uh-green" />
                          <span className="font-medium">
                            ${(occupation.medianSalary / 1000).toFixed(0)}k
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-accent" />
                          <span className="text-xs">{occupation.growthOutlook}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-xs">{occupation.trainingDuration}</span>
                      </div>

                      <div>
                        <p className="text-xs font-semibold mb-2">Top Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {occupation.topSkills.map((skill) => (
                            <span
                              key={skill}
                              className="text-xs bg-muted px-2 py-1 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="w-full bg-uh-green hover:bg-uh-green/90"
                        onClick={() => onOccupationSelect(occupation)}
                      >
                        Explore Programs
                      </Button>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              );
            })}
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage(p => Math.max(0, p - 1))}
            >
              ← Prev Page
            </Button>
            <span className="text-xs font-medium text-muted-foreground">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            >
              Next Page →
            </Button>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground mt-6">
          <p>Click any career to explore education programs and pathways. Use pagination to view additional matches.</p>
        </div>
      </Card>
    </div>
  );
};

export default OccupationResults;
