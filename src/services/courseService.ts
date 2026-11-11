import { apiClient } from './api';
import { Course } from '@/types';
import { INITIAL_COURSES } from '@/utils/mockData';

interface DummyProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  thumbnail: string;
  category: string;
}

interface DummyJSONResponse {
  products: DummyProduct[];
  total: number;
}

export class CourseService {
  /**
   * Fetches external course items from DummyJSON products API and maps them
   * cleanly into Course domain entities.
   */
  static async fetchExternalCourses(): Promise<Course[]> {
    try {
      const response = await apiClient.get<DummyJSONResponse>('/products?limit=6');
      const products = response.data.products || [];

      const categories = ['Development', 'Data Science', 'Design', 'DevOps', 'Security', 'Business'];
      const instructors = [
        { id: 'inst-1', name: 'Prof. Marcus Chen' },
        { id: 'inst-2', name: 'Dr. Sarah Jenkins' },
        { id: 'inst-3', name: 'Elena Rostova' },
        { id: 'inst-4', name: 'David O\'Connor' },
      ];

      return products.map((prod, index) => {
        const inst = instructors[index % instructors.length];
        const category = categories[index % categories.length];
        const durationHours = 20 + (prod.id * 3) % 40;

        return {
          id: `external-${prod.id}`,
          title: `Professional ${prod.title} Masterclass`,
          description: prod.description,
          thumbnail: prod.thumbnail,
          instructorId: inst.id,
          instructorName: inst.name,
          category,
          duration: `${Math.round(durationHours / 4)} Weeks`,
          durationHours,
          level: index % 3 === 0 ? 'Beginner' : index % 3 === 1 ? 'Intermediate' : 'Advanced',
          price: prod.price > 0 ? prod.price : 49.99,
          rating: prod.rating || 4.7,
          ratingCount: 120 + prod.id * 8,
          totalLessons: 4 + (prod.id % 4),
          lessons: [
            { id: `les-ext-${prod.id}-1`, title: 'Course Orientation & Setup', durationMinutes: 30, order: 1, content: 'Overview of foundational principles and toolchain setup.' },
            { id: `les-ext-${prod.id}-2`, title: 'Core Concepts & Real-World Patterns', durationMinutes: 45, order: 2, content: 'Deep dive into industry implementation patterns and anti-patterns.' },
            { id: `les-ext-${prod.id}-3`, title: 'Hands-on Project Architecture', durationMinutes: 60, order: 3, content: 'Practical step-by-step development of production-grade project.' },
            { id: `les-ext-${prod.id}-4`, title: 'Testing, Hardening & Deployment', durationMinutes: 50, order: 4, content: 'Automated verification, security review, and deployment pipelines.' },
          ],
          isCustom: false,
          createdAt: new Date(Date.now() - prod.id * 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });
    } catch (error) {
      console.warn('[CourseService] DummyJSON fetch failed or offline; using default curated courses.', error);
      return [];
    }
  }

  static getInitialCourses(): Course[] {
    return INITIAL_COURSES;
  }
}
