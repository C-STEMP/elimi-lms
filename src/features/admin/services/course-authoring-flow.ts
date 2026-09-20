import {
  createCourse,
  createModule,
  createItem,
} from "@/features/courses/api";
import { uploadScormPackage } from "@/features/storage";
import type {
  CreateCourseStepOneData,
  CreateCourseStepTwoData,
} from "../types/courses";

export interface CreateFullCourseParams {
  stepOne: CreateCourseStepOneData;
  stepTwo: CreateCourseStepTwoData;
}

export async function createCourseWithScorm({
  stepOne,
  stepTwo,
}: CreateFullCourseParams) {
  const priceNum = Number(stepOne.price) || 0;
  const minPercent = Number(stepTwo.minPercentage) || 80;

  // 1. Create course shell
  const course = await createCourse({
    title: stepOne.title || "Untitled Course",
    description: stepOne.description || "",
    price: { amountMinorUnits: String(priceNum * 100), currency: "NGN" },
    completionPolicy: {
      minPercent,
      requireAllRequiredItems: true,
      requirePassedAssessments: true,
    },
  });

  // 2. Ingest SCORM package if provided
  if (stepTwo.scormFile) {
    try {
      const packageAssetId = await uploadScormPackage(stepTwo.scormFile);
      const courseModule = await createModule(course.id, {
        title: "Module 1: Course Content",
        order: 1,
      });
      await createItem(course.id, courseModule.id, {
        title: stepTwo.scormFileName || stepOne.title || "SCORM Package",
        type: "scorm_package",
        order: 1,
        required: true,
        packageAssetId,
      });
    } catch (err) {
      console.error("Failed to attach SCORM package to course:", err);
    }
  }

  return course;
}
