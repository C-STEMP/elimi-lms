"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as coursesApi from "@/features/courses/api";
import type {
  AddCourseInstructorInput,
  AuthoringCoursesQuery,
  CourseWrite,
  CoursesQuery,
  ItemWrite,
  ModuleWrite,
  SequencingConfig,
} from "@/features/courses/types";

export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (params?: CoursesQuery) => [...courseKeys.lists(), params ?? {}] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (courseId: string) => [...courseKeys.details(), courseId] as const,
  outline: (courseId: string) => [...courseKeys.detail(courseId), "outline"] as const,
  authoringLists: () => [...courseKeys.all, "authoring", "list"] as const,
  authoringList: (params?: AuthoringCoursesQuery) =>
    [...courseKeys.authoringLists(), params ?? {}] as const,
  authoringDetail: (courseId: string) =>
    [...courseKeys.all, "authoring", "detail", courseId] as const,
  instructors: (courseId: string) =>
    [...courseKeys.authoringDetail(courseId), "instructors"] as const,
};

// Catalogue

export function useCourses(params?: CoursesQuery) {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: () => coursesApi.getCourses(params),
  });
}

export function useCourse(courseId: string) {
  return useQuery({
    queryKey: courseKeys.detail(courseId),
    queryFn: () => coursesApi.getCourse(courseId),
    enabled: Boolean(courseId),
  });
}

export function useCourseOutline(courseId: string) {
  return useQuery({
    queryKey: courseKeys.outline(courseId),
    queryFn: () => coursesApi.getCourseOutline(courseId),
    enabled: Boolean(courseId),
  });
}

// Authoring

export function useAuthoringCourses(params?: AuthoringCoursesQuery) {
  return useQuery({
    queryKey: courseKeys.authoringList(params),
    queryFn: () => coursesApi.getAuthoringCourses(params),
  });
}

export function useAuthoringCourse(courseId: string) {
  return useQuery({
    queryKey: courseKeys.authoringDetail(courseId),
    queryFn: () => coursesApi.getAuthoringCourse(courseId),
    enabled: Boolean(courseId),
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CourseWrite) => coursesApi.createCourse(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.authoringLists() });
    },
  });
}

export function useUpdateCourse(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CourseWrite) => coursesApi.updateCourse(courseId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.authoringDetail(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.authoringLists() });
    },
  });
}

export function usePublishCourse(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => coursesApi.publishCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.authoringDetail(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.authoringLists() });
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
}

export function useUnpublishCourse(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => coursesApi.unpublishCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.authoringDetail(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.authoringLists() });
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
}

export function useCreateModule(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ModuleWrite) => coursesApi.createModule(courseId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.authoringDetail(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.outline(courseId) });
    },
  });
}

export function useUpdateModule(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ moduleId, input }: { moduleId: string; input: ModuleWrite }) =>
      coursesApi.updateModule(courseId, moduleId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.authoringDetail(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.outline(courseId) });
    },
  });
}

export function useDeleteModule(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (moduleId: string) => coursesApi.deleteModule(courseId, moduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.authoringDetail(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.outline(courseId) });
    },
  });
}

export function useCreateItem(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ moduleId, input }: { moduleId: string; input: ItemWrite }) =>
      coursesApi.createItem(courseId, moduleId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.authoringDetail(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.outline(courseId) });
    },
  });
}

export function useUpdateItem(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, input }: { itemId: string; input: ItemWrite }) =>
      coursesApi.updateItem(courseId, itemId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.authoringDetail(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.outline(courseId) });
    },
  });
}

export function useDeleteItem(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => coursesApi.deleteItem(courseId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.authoringDetail(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.outline(courseId) });
    },
  });
}

export function useSaveSequencing(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SequencingConfig) => coursesApi.saveSequencing(courseId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.authoringDetail(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.outline(courseId) });
    },
  });
}

// Course-level instructors

export function useCourseInstructors(courseId: string) {
  return useQuery({
    queryKey: courseKeys.instructors(courseId),
    queryFn: () => coursesApi.getCourseInstructors(courseId),
    enabled: Boolean(courseId),
  });
}

export function useAddCourseInstructor(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddCourseInstructorInput) =>
      coursesApi.addCourseInstructor(courseId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.instructors(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.authoringDetail(courseId) });
    },
  });
}

export function useRemoveCourseInstructor(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lmsUserId: string) => coursesApi.removeCourseInstructor(courseId, lmsUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.instructors(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.authoringDetail(courseId) });
    },
  });
}
