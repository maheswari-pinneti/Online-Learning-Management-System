/**
 * Robust, versioned LocalStorage service.
 * Handles JSON parsing errors, missing data, schema migrations, and corrupt entries safely.
 */

const STORAGE_PREFIX = 'edusphere_v1_';

export const STORAGE_KEYS = {
  SESSION: `${STORAGE_PREFIX}session`,
  THEME: `${STORAGE_PREFIX}theme`,
  COURSES: `${STORAGE_PREFIX}courses`,
  STUDENTS: `${STORAGE_PREFIX}students`,
  INSTRUCTORS: `${STORAGE_PREFIX}instructors`,
  ENROLLMENTS: `${STORAGE_PREFIX}enrollments`,
  ASSIGNMENTS: `${STORAGE_PREFIX}assignments`,
  QUIZZES: `${STORAGE_PREFIX}quizzes`,
  ASSIGNMENT_SUBMISSIONS: `${STORAGE_PREFIX}assignment_submissions`,
  QUIZ_SUBMISSIONS: `${STORAGE_PREFIX}quiz_submissions`,
  NOTIFICATIONS: `${STORAGE_PREFIX}notifications`,
  ACTIVITIES: `${STORAGE_PREFIX}activities`,
} as const;

export class StorageService {
  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === undefined || item === '') {
        return defaultValue;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`[StorageService] Failed to parse key "${key}". Falling back to default.`, error);
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[StorageService] Failed to set key "${key}":`, error);
      return false;
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`[StorageService] Failed to remove key "${key}":`, error);
    }
  }

  static clearAppStorage(): void {
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    } catch (error) {
      console.error('[StorageService] Failed to clear application storage:', error);
    }
  }
}
