import { UnitHeader } from "./unit-header.model";

export interface WeeklyProgressStatistics {
  totalKcCount: number;
  totalTaskCount: number;
  satisfiedKcCount: number;
  gradedTaskCount: number;
  completedTaskCount: number;
  achievedPoints: number;
  totalMaxPoints: number;
  percentPoints: number;
  avgGroupPoints: number;
  satisfactionCount: number;
  avgSatisfaction: number;

  negativePatterns: {
    name: string;
    count: number;
  }[];
}
  
export function calculateWeeklyProgressStatistics(units: UnitHeader[]): WeeklyProgressStatistics {
  let totalKcCount = 0;
  let totalTaskCount = 0;
  let satisfiedKcCount = 0;
  let gradedTaskCount = 0;
  let completedTaskCount = 0;
  let achievedPoints = 0;
  let totalMaxPoints = 0;
  let avgGroupPoints = 0;
  let satisfactionCount = 0;
  let avgSatisfaction = 0;
  let negativePatterns: {name: string, count: number}[] = [];
  
  units.forEach(u => {
    if(u.kcStatistics) {
      totalKcCount += u.kcStatistics.totalCount;
      satisfiedKcCount += u.kcStatistics.satisfiedCount;
      const kcNegativePatterns = u.kcStatistics.satisfiedKcStatistics.flatMap(stats => stats.negativePatterns);
      kcNegativePatterns.forEach(pattern => {
        const patternCategory = pattern.split(':')[0];
        const matchingPatternCategory = negativePatterns.find(p => p.name === patternCategory);
        if(matchingPatternCategory) {
          matchingPatternCategory.count++;
          return;
        }
        negativePatterns.push({name: patternCategory, count: 1});
      })
    }
    if(u.taskStatistics) {
      totalTaskCount += u.taskStatistics.totalCount;
      gradedTaskCount += u.taskStatistics.gradedCount;
      completedTaskCount += u.taskStatistics.completedCount;
      achievedPoints += u.taskStatistics.learnerPoints;
      avgGroupPoints += u.taskStatistics.avgGroupPoints;
      totalMaxPoints += u.taskStatistics.totalMaxPoints;
      const taskNegativePatterns = u.taskStatistics.taskStatistics.flatMap(stats => stats.negativePatterns);
      taskNegativePatterns.forEach(pattern => {
        const patternCategory = pattern.split(':')[0];
        const matchingPatternCategory = negativePatterns.find(p => p.name === patternCategory);
        if(matchingPatternCategory) {
          matchingPatternCategory.count++;
          return;
        }
        negativePatterns.push({name: patternCategory, count: 1});
      })
    }
    u.reflections.forEach(r => {
      const satisfactionQuestion = r.questions.find(q => q.category === 1 && q.type === 2);
      if(!satisfactionQuestion?.answer) return;
      avgSatisfaction += +satisfactionQuestion.answer;
      satisfactionCount++;
    });
  });
  
  return {
    totalKcCount,
    totalTaskCount,
    satisfiedKcCount,
    gradedTaskCount,
    completedTaskCount,
    totalMaxPoints,
    achievedPoints,
    percentPoints: +(100 * achievedPoints / totalMaxPoints).toFixed(0), // Course monitoring doubles this calculation and it should be centralized on the backend
    avgGroupPoints,
    satisfactionCount,
    avgSatisfaction: satisfactionCount === 0 ? 0 : Math.round(avgSatisfaction * 10 / satisfactionCount) / 10,
    negativePatterns
  };
}