/**
 * Cross-Quest Conflict Radar
 * Proactively intercepts date clashes between college examination dates
 * and pinned internship commitments, or stipend vs. scholarship eligibility violations.
 */

export function detectCrossQuestConflicts({
  activeInternship = null,
  activeScholarships = [],
  examSchedule = null
}) {
  const conflicts = [];

  // Default mock commitments if none supplied
  const internship = activeInternship || {
    companyName: "Nexus Dynamics AI",
    role: "Full-Stack Web Intern (On-site)",
    startDate: "2024-12-01",
    endDate: "2025-02-28",
    workType: "ON_SITE",
    dailyHours: "9:00 AM - 5:30 PM",
    monthlyStipend: 25000
  };

  const exams = examSchedule || {
    name: "Odd-Semester University Theory Exams",
    startDate: "2024-12-04",
    endDate: "2024-12-18",
    mandatoryAttendanceRequired: true
  };

  const scholarships = activeScholarships.length > 0 ? activeScholarships : [
    {
      name: "UGC National STEM Scholar Grant",
      annualGrant: 50000,
      stipendCeiling: 15000,
      ruleText: "Clause 7.2: Beneficiary cannot draw dual corporate stipend exceeding ₹15,000/month."
    }
  ];

  // 1. Date Collision: Exams vs On-Site Internship Onboarding
  if (internship && exams) {
    const internStart = new Date(internship.startDate);
    const examStart = new Date(exams.startDate);
    const examEnd = new Date(exams.endDate);

    if (internStart <= examEnd) {
      conflicts.push({
        id: "conf-date-01",
        type: "SCHEDULE_COLLISION",
        severity: "CRITICAL",
        title: "Major Exam Window Clash with Internship Onboarding",
        dates: `${exams.startDate} to ${exams.endDate}`,
        affectedEntities: [internship.companyName, exams.name],
        description: `Your semester theory examinations run from Dec 4 to Dec 18, 2024. The on-site internship schedule (${internship.dailyHours}) directly collides with required morning/evening exam shifts.`,
        regulatoryRisk: "Failure to attend examination leads to backlogs; unapproved absence from work leads to termination without completion letter.",
        mitigationAction: "Dispatch automated Sentinel letter requesting HR to convert Week 1-2 into Remote Orientation mode, or defer joining date to Dec 19 post-exams."
      });
    }
  }

  // 2. Policy Collision: Dual Financial Benefit / Stipend Ceiling
  if (internship && scholarships.length > 0) {
    for (const sch of scholarships) {
      if (sch.stipendCeiling && internship.monthlyStipend > sch.stipendCeiling) {
        conflicts.push({
          id: `conf-policy-${sch.name.toLowerCase().replace(/\s+/g, '-')}`,
          type: "FINANCIAL_POLICY_VIOLATION",
          severity: "HIGH",
          title: `Stipend Exceeds ${sch.name} Threshold`,
          affectedEntities: [sch.name, internship.companyName],
          description: `Your internship offers ₹${internship.monthlyStipend.toLocaleString('en-IN')}/month. However, ${sch.name} (${sch.ruleText}) explicitly caps outside stipends at ₹${sch.stipendCeiling.toLocaleString('en-IN')}/month.`,
          regulatoryRisk: "Audit discrepancy during annual DBT verification may cause recovery of entire ₹50,000 scholarship and disqualification for final year.",
          mitigationAction: "Option A: Restructure corporate payout as 'Hardware Grant & Project Milestone Reimbursement' instead of monthly wage, or Option B: Disclose to nodal officer."
        });
      }
    }
  }

  // 3. Attendance Debarment Radar
  if (internship.workType === 'ON_SITE') {
    conflicts.push({
      id: "conf-att-03",
      type: "ATTENDANCE_DEFICIT",
      severity: "MODERATE",
      title: "75% Mandatory Attendance Violation Risk",
      affectedEntities: ["University Academic Ordinance", internship.companyName],
      description: "On-site commercial hours (9:00 AM - 5:30 PM) prevent weekday classroom attendance. University requires 75% bio-metric or roll-call presence for admit card issuance.",
      regulatoryRisk: "Debarment from practical exams and laboratory evaluations.",
      mitigationAction: "Obtain formal Dean NOC for 8th-semester industrial training or shift to 20-hour hybrid model."
    });
  }

  const hasCriticalConflict = conflicts.some(c => c.severity === 'CRITICAL');
  const conflictCount = conflicts.length;

  return {
    hasConflict: conflictCount > 0,
    conflictCount,
    overallRisk: hasCriticalConflict ? 'HIGH' : (conflictCount > 0 ? 'MODERATE' : 'CLEAN'),
    statusBadge: hasCriticalConflict ? 'CRITICAL CONFLICT DETECTED' : (conflictCount > 0 ? 'CAUTION: POLICY CLASH' : 'ALL CLEAR'),
    conflicts,
    activeQuests: {
      internship,
      exams,
      scholarships
    },
    analyzedAt: new Date().toISOString()
  };
}
