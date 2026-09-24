export interface Sector {
  id: string;
  slug: string;
  name: string;
  description?: string;
}

export interface Trade {
  id: string;
  sectorId: string;
  slug: string;
  name: string;
  description?: string;
  status?: string;
  sector?: Sector;
  levelCount?: number;
  unitCount?: number;
  image?: string | null;
  imageAssetId?: string | null;
}

export interface Unit {
  id: string;
  referenceNumber: string;
  title: string;
  isMandatory: boolean;
  creditValue?: number;
  guidedLearningHours?: number;
  purpose?: string;
  assessmentMethods?: string[];
  structure?: Record<string, unknown>;
}

export interface QualificationLevel {
  id: string;
  level: number;
  slug?: string;
  purpose: string;
  units?: Unit[];
}

export interface NosDocument {
  id: string;
  tradeId: string;
  version: number;
  title: string;
  status: "active" | "superseded";
  qualificationLevels?: QualificationLevel[];
}

export interface TradeDetail extends Trade {
  activeNosDocument?: NosDocument;
}

export interface TradeSlot {
  slotNumber: number; // 1 to 12
  tradeId?: string | null;
  name?: string;
  description?: string;
  status: "available" | "empty";
  levelsCount: number;
  unitsCount: number;
  hasImage?: boolean;
}

export interface LevelItem {
  id: string;
  qualificationLevelId?: string;
  level: number;
  title: string;
  status: "published" | "draft";
  totalUnits: number;
  publishedUnits: number;
}

export interface UnitCourseItem {
  id: string;
  referenceNumber: string;
  title: string;
  status: "published" | "draft";
  path: string;
  courseId?: string;
  price?: {
    amountMinorUnits: string;
    currency: string;
  };
  tradeSlot?: number;
  levelNumber?: number;
}
