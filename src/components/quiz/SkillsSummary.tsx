import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, ChevronRight, TrendingUp, AlertTriangle, Lightbulb, Loader2 } from "lucide-react";
import { RIASECScores } from "@/pages/Assessment";
import apiClient from "@/lib/apiClient";

interface SkillsSummaryProps {
  selections: Record<string, boolean>;
  taskStatements: Array<{
    ElementId: string;
    ElementName: string;
    statement: string;
  }>;
  riasecScores: RIASECScores;
  onEdit: () => void;
  onContinue: () => void;
  onAnswerMore: () => void;
  onClear: () => void;
}

interface PrescoredSkill {
  element_id: string;
  element_name: string;
  rank: number;
  initial_score: number;
  score: number;
  selected: boolean;
}

interface AssessmentInsights {
  riasec_code: string;
  skills: PrescoredSkill[];
  total_skills: number;
  selected_count: number;
  avg_selected: number;
  avg_unselected: number;
  differential: number;
  high_value_matches: PrescoredSkill[];
  potential_overestimation: PrescoredSkill[];
  skills_to_develop: PrescoredSkill[];
}

const SkillsSummary = ({
  selections,
  taskStatements,
  riasecScores,
  onEdit,
  onContinue,
  onAnswerMore,
  onClear,
}: SkillsSummaryProps) => {
  const [insights, setInsights] = useState<AssessmentInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedSkills = taskStatements.filter((task) => selections[task.ElementId]);
  const selectedCount = selectedSkills.length;

  // Calculate RIASEC code from top 3 interests
  const getRiasecCode = () => {
    const sortedScores = Object.entries(riasecScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
    return sortedScores.map(([key]) => key.charAt(0)).join("");
  };

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError(null);

        const riasecCode = getRiasecCode();
        const selectedSkillIds = selectedSkills.map(s => s.ElementId);

        const response = await apiClient.post("/assessment/skills/initialize", {
          riasec_code: riasecCode,
          selected_skill_ids: selectedSkillIds,
        });

        const data = response.data;
        
        // Calculate insights
        const selected = data.skills.filter((s: PrescoredSkill) => s.selected);
        const unselected = data.skills.filter((s: PrescoredSkill) => !s.selected);
        
        const avgSelected = selected.length > 0
          ? selected.reduce((sum: number, s: PrescoredSkill) => sum + s.score, 0) / selected.length
          : 0;
        const avgUnselected = unselected.length > 0
          ? unselected.reduce((sum: number, s: PrescoredSkill) => sum + s.score, 0) / unselected.length
          : 0;

        const highValueMatches = selected.filter((s: PrescoredSkill) => s.rank <= 10);
        const potentialOverestimation = selected.filter((s: PrescoredSkill) => s.rank > 20);
        const skillsToDevelop = unselected.filter((s: PrescoredSkill) => s.rank <= 10).slice(0, 5);

        setInsights({
          riasec_code: data.riasec_code,
          skills: data.skills,
          total_skills: data.skills.length,
          selected_count: selected.length,
          avg_selected: avgSelected,
          avg_unselected: avgUnselected,
          differential: avgSelected - avgUnselected,
          high_value_matches: highValueMatches,
          potential_overestimation: potentialOverestimation,
          skills_to_develop: skillsToDevelop,
        });
      } catch (err) {
        console.error("Failed to fetch skills insights:", err);
        setError(err instanceof Error ? err.message : "Failed to load insights");
      } finally {
        setLoading(false);
      }
    };

    if (selectedCount > 0) {
      fetchInsights();
    } else {
      setLoading(false);
    }
  }, [selections, riasecScores]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <Card className="p-8 shadow-lg">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Analyzing your skills...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <Card className="p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Skills Summary</h1>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
              <p className="text-destructive">Failed to load insights: {error}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {selectedSkills.map((task) => (
              <Badge key={task.ElementId} variant="default" className="text-sm py-2 px-4">
                {task.ElementName}
              </Badge>
            ))}
          </div>
          <div className="flex justify-between">
            <Button onClick={onEdit} variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Answers
            </Button>
            <Button onClick={onContinue} className="bg-primary hover:bg-primary/90 group">
              Continue Anyway
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (selectedCount === 0) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <Card className="p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">No Skills Selected</h1>
            <p className="text-muted-foreground mb-6">
              Please select at least one skill to see your personalized insights.
            </p>
          </div>
          <div className="flex justify-center">
            <Button onClick={onAnswerMore} variant="default">
              Select Skills
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <Card className="p-8 shadow-lg bg-gradient-to-br from-background to-uh-green/5">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-uh-green to-primary bg-clip-text text-transparent">
              Your Skills Assessment
            </h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={onEdit} size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Answers
              </Button>
              <Button variant="outline" onClick={onClear} size="sm">
                Clear All
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">
            Based on your {insights?.riasec_code} interest profile and {selectedCount} selected skill{selectedCount !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Score Analysis */}
        {insights && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100">
              📊 Assessment Insights
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Skills Selected</p>
                <p className="text-2xl font-bold">{insights.selected_count}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Selected Score</p>
                <p className="text-2xl font-bold">{insights.avg_selected.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Other Skills</p>
                <p className="text-2xl font-bold">{insights.avg_unselected.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Differential</p>
                <p className={`text-2xl font-bold ${insights.differential > 0.5 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {insights.differential > 0 ? '+' : ''}{insights.differential.toFixed(2)}
                </p>
              </div>
            </div>
            {insights.differential < 0.5 && (
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-4">
                💡 Low differentiation detected. Consider selecting a few more skills for better career matching.
              </p>
            )}
          </div>
        )}

        {/* High-Value Matches */}
        {insights && insights.high_value_matches.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">
                High-Value Matches
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              These skills are both interest-aligned AND user-validated. Strong career match indicators.
            </p>
            <div className="space-y-3">
              {insights.high_value_matches.map((skill) => {
                const boost = skill.score - skill.initial_score;
                return (
                  <div
                    key={skill.element_id}
                    className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{skill.element_name}</p>
                        <p className="text-sm text-muted-foreground">Rank #{skill.rank} for {insights.riasec_code} profiles</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-600 text-white">
                        {skill.initial_score.toFixed(2)} → {skill.score.toFixed(2)} (+{boost.toFixed(2)})
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Potential Overestimation */}
        {insights && insights.potential_overestimation.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h3 className="text-xl font-semibold text-yellow-700 dark:text-yellow-400">
                Worth Exploring Further
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              These skills are less common for your interest profile. Future refinement may help confirm your competency.
            </p>
            <div className="space-y-3">
              {insights.potential_overestimation.map((skill) => {
                const boost = skill.score - skill.initial_score;
                return (
                  <div
                    key={skill.element_id}
                    className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{skill.element_name}</p>
                        <p className="text-sm text-muted-foreground">Rank #{skill.rank} for {insights.riasec_code} profiles</p>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-600 text-white">
                        {skill.initial_score.toFixed(2)} → {skill.score.toFixed(2)} (+{boost.toFixed(2)})
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Skills to Develop */}
        {insights && insights.skills_to_develop.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                Skills to Develop
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              These are highly aligned with your interests but you haven't performed them yet. Great learning opportunities!
            </p>
            <div className="grid gap-3">
              {insights.skills_to_develop.map((skill) => (
                <div
                  key={skill.element_id}
                  className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{skill.element_name}</p>
                    <span className="text-sm text-muted-foreground">Rank #{skill.rank}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-6 border-t">
          <div className="flex gap-2">
            <Button onClick={onAnswerMore} variant="outline">
              Add More Skills
            </Button>
          </div>
          <Button
            onClick={onContinue}
            className="bg-primary hover:bg-primary/90 text-primary-foreground group"
          >
            Continue to Careers
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SkillsSummary;
