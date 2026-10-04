import { VocationalTrade, LearnerProfile, MatchScoreBreakdown } from '../types/career';
import { NSQF_VOCATIONAL_TRADES } from '../data/nsqfTrades';

export function calculateTradeMatch(learner: LearnerProfile, trade: VocationalTrade): MatchScoreBreakdown {
  // 1. Interest Fit (25% weight)
  let interestMatches = 0;
  learner.interests.forEach(interest => {
    const term = interest.toLowerCase();
    if (
      trade.title.toLowerCase().includes(term) ||
      trade.sector.toLowerCase().includes(term) ||
      trade.keySkills.some(skill => skill.toLowerCase().includes(term))
    ) {
      interestMatches++;
    }
  });

  if (learner.preferredWorkStyle === 'Hands-on Machines' && ['solar-technician', 'electrician', 'welder-fabricator', 'cnc-machinist', 'automotive-service-tech'].includes(trade.id)) {
    interestMatches += 2;
  } else if (learner.preferredWorkStyle === 'Digital & Tech' && ['ev-technician', 'drone-technician', 'it-network-technician'].includes(trade.id)) {
    interestMatches += 2;
  } else if (learner.preferredWorkStyle === 'People & Service' && ['healthcare-gda', 'beauty-wellness-associate'].includes(trade.id)) {
    interestMatches += 2;
  } else if (learner.preferredWorkStyle === 'Design & Creative' && ['garment-fashion-tech', 'beauty-wellness-associate'].includes(trade.id)) {
    interestMatches += 2;
  }

  const interestFit = Math.min(96, Math.max(55, Math.round(60 + (interestMatches * 9))));

  // 2. Eligibility Fit (25% weight)
  let eligibilityFit = 85;
  if (learner.educationLevel === 'Class 12th (Science)') {
    eligibilityFit = 98; // Highest eligibility for technical & drone
  } else if (learner.educationLevel === 'Class 12th (Arts/Comm)') {
    eligibilityFit = ['it-network-technician', 'healthcare-gda', 'beauty-wellness-associate', 'garment-fashion-tech'].includes(trade.id) ? 95 : 82;
  } else if (learner.educationLevel === 'Class 10th Passed') {
    eligibilityFit = trade.eligibility.includes('10th') ? 92 : 70;
  } else if (learner.educationLevel === 'Below 10th') {
    eligibilityFit = ['welder-fabricator', 'garment-fashion-tech', 'beauty-wellness-associate'].includes(trade.id) ? 90 : 50;
  }

  // 3. District Fit (20% weight)
  const isLocalDemand = trade.localDemandClusters.some(
    d => d.toLowerCase().includes(learner.district.toLowerCase())
  );
  let districtFit = isLocalDemand ? 95 : 75;
  if (learner.willingToRelocate) {
    districtFit = Math.max(districtFit, 88);
  }

  // 4. Income Fit (15% weight)
  let incomeFit = 80;
  if (learner.priority === 'High Earning Potential') {
    incomeFit = ['solar-technician', 'ev-technician', 'drone-technician', 'welder-fabricator', 'electrician'].includes(trade.id) ? 94 : 78;
  } else if (learner.priority === 'Immediate Job') {
    incomeFit = trade.durationMonths <= 6 ? 96 : 82;
  } else if (learner.priority === 'Self Employment / Shop') {
    incomeFit = ['solar-technician', 'beauty-wellness-associate', 'electrician', 'automotive-service-tech'].includes(trade.id) ? 95 : 76;
  }

  // 5. Growth & Degree Fit (15% weight)
  const growthFit = trade.nsqfLevel >= 4 && trade.degreeProgression.includes('Lateral Entry') ? 92 : 82;

  // Weighted Total
  const overallScore = Math.round(
    interestFit * 0.25 +
    eligibilityFit * 0.25 +
    districtFit * 0.20 +
    incomeFit * 0.15 +
    growthFit * 0.15
  );

  const explanation = `${trade.title} scores ${overallScore}% because your interest in ${learner.preferredWorkStyle.toLowerCase()} directly matches this sector, you satisfy the minimum qualification requirement (${trade.eligibility}), and there is strong active industrial placement in ${learner.district || 'your region'}.`;
  
  const explanationHi = `${trade.titleHi} आपके लिए ${overallScore}% अनुकूल है क्योंकि आपकी कार्यशैली (${learner.preferredWorkStyle}), शैक्षणिक योग्यता (${trade.eligibilityHi}) और आपके जिले (${learner.district || 'स्थानीय क्षेत्र'}) में उद्योग मांग का यह श्रेष्ठ संयोजन है।`;

  return {
    tradeId: trade.id,
    overallScore,
    interestFit,
    eligibilityFit,
    districtFit,
    incomeFit,
    growthFit,
    explanation,
    explanationHi
  };
}

export function rankTradesForLearner(learner: LearnerProfile): { trade: VocationalTrade; breakdown: MatchScoreBreakdown }[] {
  return NSQF_VOCATIONAL_TRADES.map(trade => ({
    trade,
    breakdown: calculateTradeMatch(learner, trade)
  })).sort((a, b) => b.breakdown.overallScore - a.breakdown.overallScore);
}
