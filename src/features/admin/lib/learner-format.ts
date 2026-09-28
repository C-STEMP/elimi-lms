/**
 * Helpers for formatting learner names, emails, and identifiers
 * when backend returns raw identity ULIDs/UUIDs.
 */

export function formatLearnerName(
  learnerIdOrName?: string | null,
  fallbackName?: string | null
): string {
  if (fallbackName && fallbackName.trim() && fallbackName.toLowerCase() !== "string") {
    return fallbackName.trim();
  }

  if (!learnerIdOrName || !learnerIdOrName.trim()) {
    return "Learner";
  }

  const str = learnerIdOrName.trim();

  // If already an email, turn local part into a title-cased name
  if (str.includes("@")) {
    const localPart = str.split("@")[0];
    const words = localPart
      .replace(/[._\-+]+/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    return words.join(" ") || str;
  }

  // If it already contains whitespace and alphabetical characters (e.g. "Tunde Bakare")
  if (/\s+/.test(str) && /^[A-Za-z\s.'-]+$/.test(str)) {
    return str;
  }

  // If it looks like a ULID/UUID/system hash (e.g. "01M2MTQGCPJ5BQAMNPSD0J8AHG")
  if (str.length >= 8) {
    const shortCode = str.slice(-6).toUpperCase();
    return `Learner #${shortCode}`;
  }

  return str;
}

export function formatLearnerEmail(
  learnerIdOrName?: string | null,
  fallbackEmail?: string | null
): string {
  if (fallbackEmail && fallbackEmail.trim() && fallbackEmail.includes("@")) {
    return fallbackEmail.trim();
  }

  if (!learnerIdOrName || !learnerIdOrName.trim()) {
    return "learner@elimi.africa";
  }

  const str = learnerIdOrName.trim();
  if (str.includes("@")) {
    return str;
  }

  const shortCode =
    str.length >= 6 ? str.slice(-6).toLowerCase() : str.toLowerCase();
  return `learner-${shortCode}@elimi.africa`;
}

export function formatLearnerCode(learnerId?: string | null): string {
  if (!learnerId || !learnerId.trim()) return "";
  const str = learnerId.trim();
  if (str.includes("@")) return "";
  if (str.length >= 10) {
    return `ID: ${str.slice(0, 8)}...`;
  }
  return `ID: ${str}`;
}

function isIdLike(str: string): boolean {
  const trimmed = str.trim();
  if (trimmed.toLowerCase() === "string") return true;
  // ULID: 20+ alphanumeric chars without spaces (e.g., 01M3D36NCRXR9SRW7FC3436MFK)
  if (/^[0-9A-Za-z]{20,}$/.test(trimmed)) return true;
  // UUID: 36 chars with hyphens
  if (/^[0-9a-fA-F-]{36}$/.test(trimmed)) return true;
  return false;
}

export function cleanCourseTitle(
  courseTitle?: string | null,
  fallbackTitle?: string | null
): string {
  if (
    courseTitle &&
    !isIdLike(courseTitle) &&
    courseTitle.trim().length > 0
  ) {
    return courseTitle.trim();
  }

  if (
    fallbackTitle &&
    !isIdLike(fallbackTitle) &&
    fallbackTitle.trim().length > 0
  ) {
    return fallbackTitle.trim();
  }

  return "Trade Course";
}
