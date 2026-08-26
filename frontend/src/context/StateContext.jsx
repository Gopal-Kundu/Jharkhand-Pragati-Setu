import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  JHARKHAND_DISTRICTS,
  HEI_INSTITUTIONS,
  INDUSTRY_PARTNERS,
  INITIAL_PROBLEM_CLUSTERS,
  GOV_DEPARTMENT_LIST,
  SYSTEM_AUDIT_LOGS
} from '../data/mockGraphData';
import { analyzeProblemSubmission } from '../services/aiIntelligenceEngine';

const StateContext = createContext();

export function StateProvider({ children }) {
  // 1. Language: 'en' | 'hi'
  const [lang, setLang] = useState('en');

  // 2. Active Role: 'citizen' | 'panchayat' | 'government' | 'university' | 'industry' | 'public'
  const [activeRole, setActiveRole] = useState('citizen');

  // 3. Active Nav View
  const [activeView, setActiveView] = useState('citizen_home');

  // 4. Selected Items
  const [selectedClusterId, setSelectedClusterId] = useState('JH-WTR-1042');
  const [activeDistrictId, setActiveDistrictId] = useState('khunti');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);

  // 5. Reactive Graph State (with localStorage caching)
  const [problemClusters, setProblemClusters] = useState(() => {
    try {
      const saved = localStorage.getItem('jh_pragati_clusters_v2');
      return saved ? JSON.parse(saved) : INITIAL_PROBLEM_CLUSTERS;
    } catch {
      return INITIAL_PROBLEM_CLUSTERS;
    }
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('jh_pragati_audit_v2');
      return saved ? JSON.parse(saved) : SYSTEM_AUDIT_LOGS;
    } catch {
      return SYSTEM_AUDIT_LOGS;
    }
  });

  const [notifications, setNotifications] = useState([
    { id: 'NOTIF-1', title: 'Torpa Pond Water Pilot Milestone 4 Updated', time: '10 mins ago', read: false, role: 'all' },
    { id: 'NOTIF-2', title: 'New Challenge Assigned to BIT Mesra', time: '1 hour ago', read: false, role: 'university' },
    { id: 'NOTIF-3', title: 'Tata Steel CSR Grant ₹12.5L Disbursed for #JH-WTR-1042', time: '3 hours ago', read: true, role: 'industry' }
  ]);

  // Persist graph state
  useEffect(() => {
    try {
      localStorage.setItem('jh_pragati_clusters_v2', JSON.stringify(problemClusters));
      localStorage.setItem('jh_pragati_audit_v2', JSON.stringify(auditLogs));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [problemClusters, auditLogs]);

  // Add system audit log entry
  const logAction = (officer, action, target, note) => {
    const newEntry = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      officer,
      action,
      target,
      note
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // Add notification
  const addNotification = (title, role = 'all') => {
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title,
      time: 'Just now',
      read: false,
      role
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // 1. Citizen Submit Problem Flow
  const submitCitizenProblem = (formData) => {
    // Run AI Intelligence Engine
    const aiResult = analyzeProblemSubmission(formData, problemClusters);
    
    // Check if there is an exact/strong duplicate to merge with
    const strongDuplicate = aiResult.duplicatesFound && aiResult.duplicatesFound.length > 0 && aiResult.duplicatesFound[0].similarity > 0.85 
      ? aiResult.duplicatesFound[0] 
      : null;

    const reportId = `REP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReport = {
      id: reportId,
      submittedBy: formData.name || 'Concerned Citizen',
      role: formData.submitterType || 'Citizen',
      date: new Date().toISOString().split('T')[0],
      village: `${formData.village || 'Local Village'}, ${formData.districtName || 'Jharkhand'}`,
      phone: formData.phone || '+91 9XXXX XXXXX',
      narrative: formData.narrative,
      media: formData.mediaFiles || [],
      gps: formData.gps || { lat: 23.3441, lng: 85.3096 },
      verification: 'Pending Panchayat & Block Verification'
    };

    if (strongDuplicate) {
      // Merge into existing cluster
      setProblemClusters(prev => prev.map(cluster => {
        if (cluster.id === strongDuplicate.clusterId) {
          const updatedReports = [...(cluster.reports || []), newReport];
          const newPop = (cluster.affectedPopulation || 2000) + (Number(formData.affectedPopulation) || 500);
          return {
            ...cluster,
            reportCount: (cluster.reportCount || 1) + 1,
            affectedPopulation: newPop,
            reports: updatedReports
          };
        }
        return cluster;
      }));

      logAction(formData.name || 'Citizen Submitter', 'AI Deduplication Merge', strongDuplicate.clusterId, `Linked report ${reportId} into existing problem cluster.`);
      addNotification(`New citizen report merged into cluster #${strongDuplicate.clusterId}`, 'government');
      return { success: true, clusterId: strongDuplicate.clusterId, isMerged: true, reportId };
    } else {
      // Create new cluster with AI Auto-Routing to best-fit College
      const prefix = aiResult.primaryDomain.substring(0, 3).toUpperCase();
      const newClusterId = `JH-${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
      const topMatchedHei = (aiResult.universityMatches && aiResult.universityMatches[0]) || { heiId: 'bit_mesra', name: 'BIT Mesra', matchScore: 96 };

      const newCluster = {
        id: newClusterId,
        title: formData.title || `${aiResult.primaryDomain} Innovation Challenge in ${formData.districtName || 'Jharkhand'}`,
        titleHi: `${formData.districtName || 'झारखंड'} में ${aiResult.primaryDomain} समस्या एवं समाधान`,
        primaryDomain: aiResult.primaryDomain,
        secondaryDomains: aiResult.secondaryDomains,
        district: formData.district || 'ranchi',
        districtName: formData.districtName || 'Ranchi',
        block: formData.block || 'Sadar',
        panchayats: [formData.panchayat || 'Central Panchayat'],
        villages: [formData.village || 'Gram'],
        reportedDate: new Date().toISOString().split('T')[0],
        severity: formData.severity || 'High',
        urgency: formData.urgency || 'Immediate',
        affectedPopulation: Number(formData.affectedPopulation) || 3500,
        reportCount: 1,
        status: 'Sent to College R&D',
        allocatedHei: topMatchedHei.name,
        allocatedHeiId: topMatchedHei.heiId,
        sdgGoals: ['SDG 6: Clean Water', 'SDG 1: No Poverty'],
        aiIntelligence: aiResult,
        reports: [newReport],
        institutionMatches: aiResult.universityMatches || [],
        project: null,
        collegeUpdates: [
          {
            id: `UPD-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            author: 'AI Problem Engine',
            stage: 'Auto-Matched & Sent',
            message: `AI categorized this challenge (${aiResult.primaryDomain}) and automatically dispatched it to ${topMatchedHei.name} R&D Hub (${topMatchedHei.matchScore}% capability match).`,
            mediaUrl: null
          }
        ]
      };

      setProblemClusters(prev => [newCluster, ...prev]);
      logAction('AI Problem Intelligence Engine', 'Auto-Routing to College', newClusterId, `Automatically routed to ${topMatchedHei.name} (${topMatchedHei.matchScore}% fit).`);
      addNotification(`Citizen Problem #${newClusterId} auto-sent to ${topMatchedHei.name} R&D Hub`, 'university');
      setSelectedClusterId(newClusterId);
      return { success: true, clusterId: newClusterId, isMerged: false, reportId, matchedHei: topMatchedHei };
    }
  };

  // 2. College Authority Accepts Problem into Lab & Assigns Team
  const approveAndAcceptProblem = (clusterId, collegeName = 'BIT Mesra', facultyLead = 'Dr. Amitava Roy', studentNames = 'Rahul Sharma (M.Tech), Priya Kumari (B.Tech)') => {
    const projectId = `PRJ-JH-2026-${Math.floor(100 + Math.random() * 900)}`;

    setProblemClusters(prev => prev.map(c => {
      if (c.id === clusterId) {
        const acceptUpdate = {
          id: `UPD-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          author: `${facultyLead} (${collegeName})`,
          stage: 'Approved & R&D Started',
          message: `${collegeName} R&D Authority accepted this citizen issue. Student engineering team assigned: ${studentNames}. Prototype development underway.`,
          mediaUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
        };

        const existingUpdates = c.collegeUpdates || [];

        return {
          ...c,
          status: 'In College R&D',
          allocatedHei: collegeName,
          project: {
            projectId,
            title: `R&D Solution for ${c.title}`,
            leadInstitution: collegeName,
            leadFaculty: facultyLead,
            studentTeam: studentNames,
            budget: {
              totalRequested: '₹12,50,000',
              govtGrantApproved: '₹6,00,000',
              industryCSRContribution: '₹6,50,000 (Tata Steel)',
              disbursedToDate: '₹3,50,000'
            },
            teamMembers: [
              { name: facultyLead, role: 'Principal Investigator', avatar: 'PI' },
              { name: studentNames.split(',')[0] || 'Lead Student', role: 'Student Researcher', avatar: 'SR' }
            ],
            milestones: [
              { id: 'M1', title: 'Citizen Evidence Verification & Lab Bench Testing', status: 'Completed', dueDate: 'Week 1', deliverables: 'Sensor schematic & field baseline' },
              { id: 'M2', title: 'Hardware Prototype & Telemetry Assembly', status: 'In-Progress', dueDate: 'Week 3', deliverables: 'IoT prototype with LoRaWAN probes' },
              { id: 'M3', title: 'Village Pilot Testing & Citizen Validation', status: 'Planned', dueDate: 'Week 6', deliverables: 'Field deployment & clean water metric' }
            ]
          },
          collegeUpdates: [acceptUpdate, ...existingUpdates]
        };
      }
      return c;
    }));

    logAction(facultyLead, 'College Acceptance', clusterId, `${collegeName} officially approved and initiated R&D project.`);
    addNotification(`College accepted Problem #${clusterId} - Students & Faculty assigned`, 'all');
  };

  // 3. College Authority Posts Live Progress Update / Milestone
  const addCollegeProgressUpdate = (clusterId, updateData) => {
    setProblemClusters(prev => prev.map(c => {
      if (c.id === clusterId) {
        const newUpdate = {
          id: `UPD-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          author: updateData.author || 'College Project Lead',
          stage: updateData.stage || 'Progress Milestone',
          message: updateData.message,
          mediaUrl: updateData.mediaUrl || null
        };

        let updatedStatus = c.status;
        if (updateData.stage === 'Field Pilot Deployed') updatedStatus = 'Pilot Testing';
        if (updateData.stage === 'Issue Fully Resolved') updatedStatus = 'Resolved & Verified';

        return {
          ...c,
          status: updatedStatus,
          collegeUpdates: [newUpdate, ...(c.collegeUpdates || [])]
        };
      }
      return c;
    }));

    logAction(updateData.author || 'College Authority', 'Posted Progress Update', clusterId, updateData.message);
    addNotification(`College posted new progress update on #${clusterId}`, 'all');
  };

  // 4. Override Priority & Status
  const overridePriority = (clusterId, newSeverity, newScore, reason, officerName = 'Director, State Innovation Mission') => {
    setProblemClusters(prev => prev.map(c => {
      if (c.id === clusterId) {
        return {
          ...c,
          severity: newSeverity,
          status: c.status === 'Submitted' ? 'Under Review' : c.status,
          aiIntelligence: {
            ...c.aiIntelligence,
            prioritizationScore: Number(newScore),
            priorityOverride: {
              hasOverride: true,
              officer: officerName,
              timestamp: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              reason
            }
          }
        };
      }
      return c;
    }));

    logAction(officerName, 'Priority Override', clusterId, `Severity set to ${newSeverity} (${newScore}/100). Note: ${reason}`);
    addNotification(`Priority score updated for Challenge #${clusterId}`, 'all');
  };

  // 5. Institutional Allocation
  const validateAndAllocate = (clusterId, assignedHeiId, allocatedDept = 'dept_water') => {
    const heiObj = HEI_INSTITUTIONS.find(h => h.id === assignedHeiId) || HEI_INSTITUTIONS[0];

    setProblemClusters(prev => prev.map(c => {
      if (c.id === clusterId) {
        const updatedMatches = (c.institutionMatches || []).map(m => {
          if (m.heiId === assignedHeiId) {
            return { ...m, status: 'Assigned by Government' };
          }
          return m;
        });

        return {
          ...c,
          status: 'Institution Matched',
          allocatedHei: heiObj.name,
          allocatedDept,
          institutionMatches: updatedMatches
        };
      }
      return c;
    }));

    logAction('State Innovation Command', 'Validation & HEI Allocation', clusterId, `Officially validated & allocated to ${heiObj.shortName}.`);
    addNotification(`Challenge #${clusterId} allocated to ${heiObj.shortName} for proposal`, 'university');
  };

  // 6. University Accept Challenge & Form Multidisciplinary Team & Submit Proposal
  const submitUniversityProposal = (clusterId, proposalData) => {
    const heiName = proposalData.heiName || 'BIT Mesra';
    const projectId = `PRJ-JH-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newProject = {
      projectId,
      title: proposalData.title || `Research & Innovation Solution for ${clusterId}`,
      leadInstitution: heiName,
      coInstitutions: proposalData.coInstitutions || [],
      budget: {
        totalRequested: proposalData.budgetRequested || '₹18,50,000',
        govtGrantApproved: '₹10,00,000',
        industryCSRContribution: '₹8,50,000 (Pledged)',
        disbursedToDate: '₹5,00,000'
      },
      teamMembers: proposalData.teamMembers || [
        { name: 'Dr. Amitava Roy', role: 'Principal Investigator', avatar: 'AR' },
        { name: 'Dr. Priya Toppo', role: 'Co-PI (IoT Hardware)', avatar: 'PT' }
      ],
      industryPartners: [],
      milestones: [
        { id: 'M1', title: 'Field Research & Community Baseline Survey', status: 'Completed', dueDate: 'Month 1', deliverables: 'Detailed site feasibility report' },
        { id: 'M2', title: 'Hardware Prototype & Lab Testing', status: 'In-Progress', dueDate: 'Month 2', deliverables: 'Functional working device' },
        { id: 'M3', title: 'Village Community Pilot Testing', status: 'Pending', dueDate: 'Month 3', deliverables: 'Field telemetry and user feedback' },
        { id: 'M4', title: 'Government Inspection & Directorate Handover', status: 'Planned', dueDate: 'Month 4', deliverables: 'Deployment SOP & impact audit' }
      ],
      impactMetrics: [
        { indicator: 'Citizens with Direct Access', baseline: '0', achieved: '850+', target: '3,500' },
        { indicator: 'Resource Downtime Reduction', baseline: '0%', achieved: '45%', target: '70%' }
      ]
    };

    setProblemClusters(prev => prev.map(c => {
      if (c.id === clusterId) {
        return {
          ...c,
          status: 'Proposal Submitted',
          project: newProject
        };
      }
      return c;
    }));

    logAction(proposalData.leadFaculty || 'University R&D Cell', 'Proposal & Team Formation', clusterId, `Submitted project charter ${projectId} (${heiName}).`);
    addNotification(`University proposal submitted for #${clusterId}. Seeking Industry/CSR Match.`, 'industry');
  };

  // 5. Industry Pledge Support
  const pledgeIndustryPartner = (clusterId, partnerId, pledgeDetails) => {
    const partner = INDUSTRY_PARTNERS.find(p => p.id === partnerId) || INDUSTRY_PARTNERS[0];

    setProblemClusters(prev => prev.map(c => {
      if (c.id === clusterId && c.project) {
        const newPartnerEntry = {
          partnerId: partner.id,
          name: partner.name,
          type: pledgeDetails.type || 'CSR Funding & Technical Mentorship',
          contribution: pledgeDetails.contribution || '₹10.0 Lakhs CSR Grant + Testing Equipment',
          dateJoined: new Date().toISOString().split('T')[0]
        };

        const updatedPartners = [...(c.project.industryPartners || []), newPartnerEntry];

        return {
          ...c,
          status: c.status === 'Proposal Submitted' ? 'Industry Joined' : c.status,
          project: {
            ...c.project,
            industryPartners: updatedPartners
          }
        };
      }
      return c;
    }));

    logAction(partner.spoc || partner.name, 'Industry/CSR Partnership Pledged', clusterId, `Pledged support: ${pledgeDetails.contribution || 'Technical hardware & CSR grant'}.`);
    addNotification(`${partner.shortName} joined project #${clusterId} as Industry Collaborator`, 'all');
  };

  // 6. Advance Milestone
  const updateMilestone = (clusterId, milestoneId, newStatus, progressPercent = 100) => {
    setProblemClusters(prev => prev.map(c => {
      if (c.id === clusterId && c.project && c.project.milestones) {
        const updatedMilestones = c.project.milestones.map(m => {
          if (m.id === milestoneId) {
            return {
              ...m,
              status: newStatus,
              progressPercent,
              completedDate: newStatus === 'Completed' ? new Date().toISOString().split('T')[0] : m.completedDate
            };
          }
          return m;
        });

        // Check if overall project lifecycle stage should advance
        let newStage = c.status;
        if (milestoneId === 'M2' && newStatus === 'Completed') newStage = 'Prototype';
        if (milestoneId === 'M3' && (newStatus === 'In-Progress' || newStatus === 'Completed')) newStage = 'Pilot';
        if (milestoneId === 'M5' && newStatus === 'Completed') newStage = 'Deployed';

        return {
          ...c,
          status: newStage,
          project: {
            ...c.project,
            milestones: updatedMilestones
          }
        };
      }
      return c;
    }));

    logAction('Project Management Lead', 'Milestone Status Update', clusterId, `Milestone ${milestoneId} updated to "${newStatus}".`);
    addNotification(`Milestone ${milestoneId} reached in Challenge #${clusterId}`, 'all');
  };

  // 7. Reset to Default Scenario
  const resetToDefaultData = () => {
    setProblemClusters(INITIAL_PROBLEM_CLUSTERS);
    setAuditLogs(SYSTEM_AUDIT_LOGS);
    localStorage.removeItem('jh_pragati_clusters_v2');
    localStorage.removeItem('jh_pragati_audit_v2');
    setSelectedClusterId('JH-WTR-1042');
  };

  const selectedCluster = problemClusters.find(c => c.id === selectedClusterId) || problemClusters[0];

  return (
    <StateContext.Provider
      value={{
        lang,
        setLang,
        activeRole,
        setActiveRole,
        activeView,
        setActiveView,
        selectedClusterId,
        setSelectedClusterId,
        selectedCluster,
        activeDistrictId,
        setActiveDistrictId,
        isSubmitModalOpen,
        setIsSubmitModalOpen,
        isAssistantOpen,
        setIsAssistantOpen,
        isAuditDrawerOpen,
        setIsAuditDrawerOpen,
        problemClusters,
        auditLogs,
        notifications,
        districts: JHARKHAND_DISTRICTS,
        heis: HEI_INSTITUTIONS,
        industryPartners: INDUSTRY_PARTNERS,
        govDepartments: GOV_DEPARTMENT_LIST,
        // Actions
        submitCitizenProblem,
        approveAndAcceptProblem,
        addCollegeProgressUpdate,
        overridePriority,
        validateAndAllocate,
        submitUniversityProposal,
        pledgeIndustryPartner,
        updateMilestone,
        logAction,
        addNotification,
        resetToDefaultData
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within a StateProvider');
  }
  return context;
}
