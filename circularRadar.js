/**
 * College & Scholarship Notice Board Radar
 * Monitors and auto-extracts circulars via TinyFetch/TinyMonitor,
 * and provides 1-Click Autopilot form population into official application portals.
 */

export const MOCK_SCRAPED_CIRCULARS = [
  {
    id: "circ-ugc-2024-08",
    title: "National Merit Scholarship for Undergraduate STEM Scholars 2024-25",
    category: "SCHOLARSHIP",
    authority: "UGC / Ministry of Education, Govt. of India",
    date: "2024-11-18",
    deadline: "2024-12-15",
    badge: "₹50,000 / Year",
    stipendAmount: 50000,
    eligibility: "Full-time B.Tech/B.Sc students with CGPA >= 7.5 and family annual income < ₹6 Lakhs.",
    portalUrl: "https://scholarships.gov.in/portal/ugc-stem-2024",
    clauses: [
      "Clause 4.1: Beneficiary must maintain min 75% attendance.",
      "Clause 7.2: Cannot draw dual corporate stipend exceeding ₹15,000/mo simultaneously."
    ],
    requiredFields: ["studentName", "rollNumber", "collegeName", "cgpa", "familyIncome", "bankIfsc", "accountNumber"]
  },
  {
    id: "circ-du-exam-2024",
    title: "Odd-Semester Final Theory Examination Date-Sheet (B.Tech / BCA)",
    category: "EXAM_SCHEDULE",
    authority: "University Examination Branch",
    date: "2024-11-15",
    deadline: "2024-11-30",
    badge: "MANDATORY ATTENDANCE",
    stipendAmount: 0,
    eligibility: "All enrolled semester 3, 5, and 7 students.",
    portalUrl: "https://exam.university.ac.in/datesheet-dec-2024",
    examWindow: {
      startDate: "2024-12-04",
      endDate: "2024-12-18",
      morningShift: "09:30 AM - 12:30 PM",
      eveningShift: "02:00 PM - 05:00 PM"
    },
    clauses: [
      "No NOC will be granted for off-campus internships overlapping the examination schedule.",
      "75% attendance threshold strictly enforced for admit-card clearance."
    ],
    requiredFields: ["rollNumber", "enrollmentId", "semester", "centerCode"]
  },
  {
    id: "circ-aicte-intern-2024",
    title: "AICTE - Smart India Industrial Research Internship Fellowship",
    category: "INTERNSHIP_DRIVE",
    authority: "AICTE / CDAC Innovation Cell",
    date: "2024-11-12",
    deadline: "2024-12-10",
    badge: "₹25,000 / Month",
    stipendAmount: 25000,
    eligibility: "Pre-final and Final year engineering students. Remote or Hybrid options.",
    portalUrl: "https://internship.aicte-india.org/cdac-research-2024",
    clauses: [
      "Stipend disbursed directly into Aadhaar-seeded bank account.",
      "Requires institutional recommendation letter (NOC) within 14 days of offer."
    ],
    requiredFields: ["studentName", "rollNumber", "collegeName", "cgpa", "branch", "githubUrl", "resumeLink"]
  },
  {
    id: "circ-fee-waiver-2024",
    title: "Hostel & Tuition Fee Remission for Economically Weaker Section (EWS)",
    category: "FEE_DEADLINE",
    authority: "Dean of Student Welfare Office",
    date: "2024-11-10",
    deadline: "2024-11-28",
    badge: "100% Hostel Waiver",
    stipendAmount: 32000,
    eligibility: "Hostel residents with verifiable parental income certificate below ₹3.5 Lakhs.",
    portalUrl: "https://dsw.college.edu.in/ews-remission-2024",
    clauses: [
      "Electricity sub-meter charges are exempt from the baseline waiver.",
      "Original income affidavit attested by Tehsildar or Sub-Divisional Magistrate."
    ],
    requiredFields: ["studentName", "rollNumber", "hostelRoom", "familyIncome", "incomeCertNo"]
  }
];

/**
 * Perform 1-Click Autopilot Form Population
 */
export function executeAutopilotFormFill({
  circularId,
  studentProfile = {}
}) {
  const notice = MOCK_SCRAPED_CIRCULARS.find(c => c.id === circularId) || MOCK_SCRAPED_CIRCULARS[0];

  const defaultProfile = {
    studentName: "Aarav Sharma",
    rollNumber: "21BCSE0842",
    collegeName: "Delhi Technological University (DTU)",
    branch: "Computer Science & Engineering",
    semester: "Semester 5",
    cgpa: "8.64",
    familyIncome: "4,50,000",
    email: "aarav.sharma21@dtu.ac.in",
    phone: "+91 98765 43210",
    bankIfsc: "SBIN0004042",
    accountNumber: "XXXX-XXXX-8921",
    githubUrl: "https://github.com/aarav-sharma-dev",
    resumeLink: "https://drive.google.com/file/d/1XyZ_AaravResume2024"
  };

  const mergedProfile = { ...defaultProfile, ...studentProfile };

  // Map requested fields
  const fieldMapping = notice.requiredFields.map(fieldKey => {
    return {
      fieldName: fieldKey,
      fieldLabel: fieldKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      autoFilledValue: mergedProfile[fieldKey] || "Auto-detected from Student Locker",
      status: "MAPPED_AND_VALIDATED"
    };
  });

  return {
    success: true,
    autopilotRunId: `auto-${Date.now()}`,
    targetNotice: {
      id: notice.id,
      title: notice.title,
      authority: notice.authority,
      portalUrl: notice.portalUrl,
      deadline: notice.deadline
    },
    student: mergedProfile,
    fieldMapping,
    payloadReadyForSubmission: true,
    telemetry: {
      domSelectorCount: fieldMapping.length,
      estimatedFillTimeMs: 1420,
      captchaHandler: "BYPASS_UNNECESSARY_OFFICIAL_SSO",
      browserEngine: "TinyFish Headless Agent Chromium v128"
    }
  };
}
