import { lmsClient } from "@/shared/api/clients";
import { unwrapItem, unwrapList } from "@/shared/api/response";
import type {
  AddCourseInstructorInput,
  AuthoringCoursesQuery,
  CourseAuthoring,
  CourseDetail,
  CourseInstructor,
  CourseItem,
  CourseModule,
  CourseOutline,
  CoursesQuery,
  CourseSummary,
  CourseWrite,
  GenericMessage,
  ItemWrite,
  ModuleWrite,
  SequencingConfig,
} from "@/features/courses/types";

// Catalogue — authenticated browse of published courses.

export function getCourses(params?: CoursesQuery) {
  return unwrapList<CourseSummary>(lmsClient.get("/courses", { params }));
}

export function getCourse(courseId: string) {
  return unwrapItem<CourseDetail>(lmsClient.get(`/courses/${courseId}`));
}

export function getCourseOutline(courseId: string) {
  return unwrapItem<CourseOutline>(lmsClient.get(`/courses/${courseId}/outline`));
}

// Authoring — course/module/item CRUD, sequencing, publish.

export function getAuthoringCourses(params?: AuthoringCoursesQuery) {
  return unwrapList<CourseDetail>(lmsClient.get("/authoring/courses", { params }));
}

export function createCourse(input: CourseWrite) {
  return unwrapItem<CourseDetail>(lmsClient.post("/authoring/courses", input));
}

export function getAuthoringCourse(courseId: string) {
  return unwrapItem<CourseAuthoring>(lmsClient.get(`/authoring/courses/${courseId}`));
}

export function updateCourse(courseId: string, input: CourseWrite) {
  return unwrapItem<CourseAuthoring>(
    lmsClient.patch(`/authoring/courses/${courseId}`, input)
  );
}

export function publishCourse(courseId: string) {
  return unwrapItem<CourseDetail>(
    lmsClient.post(`/authoring/courses/${courseId}/publish`)
  );
}

export function unpublishCourse(courseId: string) {
  return unwrapItem<CourseDetail>(
    lmsClient.post(`/authoring/courses/${courseId}/unpublish`)
  );
}

export function createModule(courseId: string, input: ModuleWrite) {
  return unwrapItem<CourseModule>(
    lmsClient.post(`/authoring/courses/${courseId}/modules`, input)
  );
}

export function updateModule(courseId: string, moduleId: string, input: ModuleWrite) {
  return unwrapItem<CourseModule>(
    lmsClient.patch(`/authoring/courses/${courseId}/modules/${moduleId}`, input)
  );
}

export function deleteModule(courseId: string, moduleId: string) {
  return unwrapItem<GenericMessage>(
    lmsClient.delete(`/authoring/courses/${courseId}/modules/${moduleId}`)
  );
}

export function createItem(courseId: string, moduleId: string, input: ItemWrite) {
  return unwrapItem<CourseItem>(
    lmsClient.post(`/authoring/courses/${courseId}/modules/${moduleId}/items`, input)
  );
}

export function updateItem(courseId: string, itemId: string, input: ItemWrite) {
  return unwrapItem<CourseItem>(
    lmsClient.patch(`/authoring/courses/${courseId}/items/${itemId}`, input)
  );
}

export function deleteItem(courseId: string, itemId: string) {
  return unwrapItem<GenericMessage>(
    lmsClient.delete(`/authoring/courses/${courseId}/items/${itemId}`)
  );
}

export function saveSequencing(courseId: string, input: SequencingConfig) {
  return unwrapItem<SequencingConfig>(
    lmsClient.put(`/authoring/courses/${courseId}/sequencing`, input)
  );
}

// Course-level instructor roster (owner + co-instructors).

export function getCourseInstructors(courseId: string) {
  return unwrapItem<CourseInstructor[]>(
    lmsClient.get(`/authoring/courses/${courseId}/instructors`)
  );
}

export function addCourseInstructor(courseId: string, input: AddCourseInstructorInput) {
  return unwrapItem<CourseInstructor>(
    lmsClient.post(`/authoring/courses/${courseId}/instructors`, input)
  );
}

export function removeCourseInstructor(courseId: string, lmsUserId: string) {
  return unwrapItem<GenericMessage>(
    lmsClient.delete(`/authoring/courses/${courseId}/instructors/${lmsUserId}`)
  );
}
