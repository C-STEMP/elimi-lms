export interface PublicLabelCountBucket {
  label: string;
  count: number;
}

export interface PublicIdCountBucket {
  id: string;
  count: number;
}

export interface PublicMonthCountBucket {
  month: string;
  count: number;
}

export interface PublicPublishStatusCounts {
  draft: number;
  published: number;
  archived: number;
}

export interface LmsPublicStats {
  generatedAt: string;
  cacheTtlSeconds: number;
  learners: {
    total: number;
    byStatus: {
      active: number;
      suspended: number;
    };
    certified: number;
    activeLast30Days: number;
    byState: PublicLabelCountBucket[];
    byGender: PublicLabelCountBucket[];
  };
  instructors: {
    total: number;
    byStatus: {
      invited: number;
      active: number;
      suspended: number;
    };
  };
  levelOfferings: {
    total: number;
    byStatus: PublicPublishStatusCounts;
    publishedByQualificationLevel: PublicIdCountBucket[];
  };
  unitOfferings: {
    total: number;
    byStatus: PublicPublishStatusCounts;
    publishedByTrade: PublicIdCountBucket[];
    publishedByQualificationLevel: PublicIdCountBucket[];
  };
  standaloneCourses: {
    total: number;
    byStatus: PublicPublishStatusCounts;
  };
  content: {
    modules: number;
    items: number;
    itemsByType: {
      nativeLesson: number;
      video: number;
      quiz: number;
      assignment: number;
      scormPackage: number;
    };
  };
  enrollments: {
    total: number;
    byStatus: {
      pending: number;
      active: number;
      completed: number;
      expired: number;
      withdrawn: number;
    };
    completionRate: number | null;
  };
  levelEnrollments: {
    total: number;
    byStatus: {
      pending: number;
      active: number;
      expired: number;
      withdrawn: number;
    };
    sponsored: number;
  };
  certificates: {
    issued: number;
    revoked: number;
    issuedThisYear: number;
    byMonth: PublicMonthCountBucket[];
  };
  seats: {
    allocations: number;
    organizations: number;
    totalSlots: number;
    seatsAssigned: number;
  };
}

export interface PublicStateCountBucket {
  state: string;
  count: number;
}

export interface PublicLevelCountBucket {
  level: number;
  count: number;
}

export interface NamedCountBucket {
  id: string;
  name: string;
  count: number;
}

export interface PublicReviewStatusCounts {
  pending: number;
  approved: number;
  suspended: number;
  rejected: number;
}

export interface PublicAssessorQualificationCounts {
  qaa: number;
  iqm: number;
  iv: number;
  ev: number;
}

export interface CapPublicStats {
  generatedAt: string;
  cacheTtlSeconds: number;
  candidates: {
    total: number;
    withApplication: number;
    certified: number;
    byState: PublicStateCountBucket[];
  };
  applications: {
    total: number;
    byStatus: {
      draft: number;
      inProgress: number;
      certified: number;
      rejected: number;
      withdrawn: number;
    };
    byType: { rpl: number; nsq: number };
    sponsored: number;
    byLevel: PublicLevelCountBucket[];
    byTrade: NamedCountBucket[];
  };
  assessors: {
    total: number;
    byStatus: PublicReviewStatusCounts;
    byQualification: PublicAssessorQualificationCounts;
    approvedByQualification: PublicAssessorQualificationCounts;
    approvedBySector: NamedCountBucket[];
    approvedByState: PublicStateCountBucket[];
  };
  centres: {
    total: number;
    byStatus: PublicReviewStatusCounts;
    approvedByState: PublicStateCountBucket[];
    approvedStatesCovered: number;
    approvedByTrade: NamedCountBucket[];
  };
  catalogue: {
    sectors: number;
    trades: { total: number; active: number; archived: number };
    nosDocuments: { active: number; superseded: number };
    qualificationLevels: number;
    units: number;
  };
  certificates: {
    issued: number;
    revoked: number;
    issuedThisYear: number;
    byMonth: PublicMonthCountBucket[];
    byTrade: NamedCountBucket[];
    byLevel: PublicLevelCountBucket[];
    medianDaysToCertification: number | null;
  };
  awardingBodies: { total: number };
  jobPostings: {
    total: number;
    byStatus: { open: number; closed: number; filled: number; cancelled: number };
  };
}
