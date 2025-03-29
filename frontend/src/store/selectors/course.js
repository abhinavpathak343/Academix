import {
  userState
} from "../atoms/user";
import {
  selector
} from "recoil";
import {
  courseState
} from "../atoms/course";

export const isCourseLoading = selector({
  key: 'isCourseLoaingState',
  get: ({
    get
  }) => {
    const state = get(courseState);

    return state.isLoading;
  },
});

export const courseDetails = selector({
  key: 'courseDetailsState',
  get: ({
    get
  }) => {
    const state = get(courseState);

    return state.course;
  },
});

export const courseTitle = selector({
  key: 'courseTitleState',
  get: ({
    get
  }) => {
    const state = get(courseState);
    if (state.course) {
      return state.course.title;
    }
    return "";
  },
});

export const coursePrice = selector({
  key: 'coursePrice',
  get: ({
    get
  }) => {
    const course = get(courseState);
    return course.course ? Number(course.course.price) || 0 : 0;
  },
});

export const courseImage = selector({
  key: 'courseImageState',
  get: ({
    get
  }) => {
    const state = get(courseState);
    if (state.course) {
      return state.course.imageLink || ''; // Changed from image to imageLink
    }
    return "";
  },
});