import {
  createCourse,
  updateCourse,
  getAuthoringCourse,
  createModule,
  createItem,
  updateItem,
} from "@/features/courses/api";
import { uploadScormPackage } from "@/features/storage";
import type { ApiError } from "@/shared/types";
import type {
  CreateCourseStepOneData,
  CreateCourseStepTwoData,
} from "../types/courses";

/**
 * Thrown when the course record was saved but its content could not be attached.
 * Carries the course id so a retry can update that draft instead of creating a duplicate.
 */
export class CourseContentError extends Error {
  constructor(
    public courseId: string,
    cause: unknown
  ) {
    super(
      `The course was saved as a draft, but its SCORM package couldn't be attached: ${
        (cause as ApiError)?.message || "unknown error"
      }`
    );
    this.name = "CourseContentError";
  }
}

/** True when the authoring outline has at least one module with at least one item. */
export async function courseHasContent(courseId: string) {
  const course = await getAuthoringCourse(courseId);
  return (course.outline?.modules ?? []).some((m) => m.items.length > 0);
}

/**
 * Point the course at an uploaded SCORM package. Replaces the package on the existing
 * SCORM item if there is one; otherwise adds an item to the first module (creating it if needed).
 */
export async function attachScormPackage(
  courseId: string,
  packageAssetId: string,
  title: string
) {
  const course = await getAuthoringCourse(courseId);
  const modules = course.outline?.modules ?? [];

  const scormItem = modules
    .flatMap((m) => m.items)
    .find((item) => item.type === "scorm_package");
  if (scormItem) {
    await updateItem(courseId, scormItem.id, { packageAssetId });
    return;
  }

  const moduleId =
    modules[0]?.id ??
    (await createModule(courseId, { title: "Module 1: Course Content", order: 1 })).id;
  await createItem(courseId, moduleId, {
    title,
    type: "scorm_package",
    order: 1,
    required: true,
    packageAssetId,
  });
}

export interface CreateFullCourseParams {
  stepOne: CreateCourseStepOneData;
  stepTwo: CreateCourseStepTwoData;
  /** Draft left behind by a previous failed attempt — updated instead of creating a new course. */
  existingCourseId?: string | null;
}

export async function createCourseWithScorm({
  stepOne,
  stepTwo,
  existingCourseId,
}: CreateFullCourseParams) {
  const priceNum = Number(stepOne.price) || 0;
  const minPercent = Number(stepTwo.minPercentage) || 80;
  const courseInput = {
    title: stepOne.title || "Untitled Course",
    description: stepOne.description || "",
    price: { amountMinorUnits: String(priceNum * 100), currency: "NGN" },
    completionPolicy: {
      minPercent,
      requireAllRequiredItems: true,
      requirePassedAssessments: true,
    },
  };

  // 1. Upload first so a failed upload never leaves an empty course behind
  const packageAssetId = stepTwo.scormFile
    ? await uploadScormPackage(stepTwo.scormFile)
    : null;

  // 2. Create (or update the leftover draft of) the course shell
  const course = existingCourseId
    ? await updateCourse(existingCourseId, courseInput)
    : await createCourse(courseInput);

  // 3. Attach the package
  if (packageAssetId) {
    try {
      await attachScormPackage(
        course.id,
        packageAssetId,
        stepTwo.scormFileName || stepOne.title || "SCORM Package"
      );
    } catch (err) {
      throw new CourseContentError(course.id, err);
    }
  }

  return course;
}
