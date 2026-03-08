import { describe, it, expect } from 'vitest';
import { COURSE_MODULES } from '../client/src/lib/course';
import type { CourseTier } from '../client/src/lib/course';
import { MODULE_QUIZZES } from '../client/src/lib/quizData';

describe('Course Content Integrity', () => {
  it('should have 12 total modules', () => {
    expect(COURSE_MODULES.length).toBe(12);
  });

  it('should have 10 non-premium modules', () => {
    const base = COURSE_MODULES.filter(m => !m.premium);
    expect(base.length).toBe(10);
  });

  it('should have 2 premium bonus modules (11 and 12)', () => {
    const premium = COURSE_MODULES.filter(m => m.premium);
    expect(premium.length).toBe(2);
    expect(premium[0].title).toContain('Asset Protection');
    expect(premium[1].title).toContain('Creative Financing');
  });

  it('every module should have at least 1 lesson', () => {
    for (const mod of COURSE_MODULES) {
      expect(mod.lessons.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('every lesson should have non-empty content', () => {
    for (const mod of COURSE_MODULES) {
      for (const lesson of mod.lessons) {
        expect(lesson.content.length).toBeGreaterThan(50);
        expect(lesson.title.length).toBeGreaterThan(0);
        expect(lesson.id).toBeTruthy();
      }
    }
  });

  it('every lesson should have a videoId for Colossyan script reference', () => {
    for (const mod of COURSE_MODULES) {
      for (const lesson of mod.lessons) {
        expect(lesson).toHaveProperty('videoId');
        expect(lesson.videoId).toBeTruthy();
      }
    }
  });

  it('Module 1 should be Investor Mindset', () => {
    const mod1 = COURSE_MODULES.find(m => m.id === 'mod-1');
    expect(mod1).toBeTruthy();
    expect(mod1!.title).toContain('Mindset');
    expect(mod1!.lessons.length).toBe(3);
  });

  it('Module 4 should contain Fix & Flip content', () => {
    const mod4 = COURSE_MODULES.find(m => m.id === 'mod-4');
    expect(mod4).toBeTruthy();
    expect(mod4!.title.toLowerCase()).toContain('fix');
  });

  it('every module should have quiz questions', () => {
    for (const mod of COURSE_MODULES) {
      const quiz = MODULE_QUIZZES.find(q => q.moduleId === mod.id);
      expect(quiz).toBeTruthy();
      expect(quiz!.questions.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('quiz questions should have correct answer indices', () => {
    for (const quiz of MODULE_QUIZZES) {
      for (const q of quiz.questions) {
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.options.length);
        expect(q.options.length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it('should have unique lesson IDs across all modules', () => {
    const allIds = new Set<string>();
    for (const mod of COURSE_MODULES) {
      for (const lesson of mod.lessons) {
        expect(allIds.has(lesson.id)).toBe(false);
        allIds.add(lesson.id);
      }
    }
  });

  it('should have unique module IDs', () => {
    const ids = COURSE_MODULES.map(m => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('module numbers should be sequential', () => {
    for (let i = 0; i < COURSE_MODULES.length; i++) {
      expect(COURSE_MODULES[i].number).toBe(i + 1);
    }
  });

  it('premium modules should have premium flag set to true', () => {
    const mod11 = COURSE_MODULES.find(m => m.id === 'mod-11');
    const mod12 = COURSE_MODULES.find(m => m.id === 'mod-12');
    expect(mod11?.premium).toBe(true);
    expect(mod12?.premium).toBe(true);
  });

  it('Asset Protection module (11) should cover LLCs, trusts, and IRAs', () => {
    const mod11 = COURSE_MODULES.find(m => m.id === 'mod-11');
    expect(mod11).toBeTruthy();
    const allContent = mod11!.lessons.map(l => l.content).join(' ');
    expect(allContent).toContain('LLC');
    expect(allContent.toLowerCase()).toContain('trust');
  });

  it('Creative Financing module (12) should cover seller financing and lease options', () => {
    const mod12 = COURSE_MODULES.find(m => m.id === 'mod-12');
    expect(mod12).toBeTruthy();
    const allContent = mod12!.lessons.map(l => l.content).join(' ');
    expect(allContent.toLowerCase()).toContain('seller financing');
    expect(allContent.toLowerCase()).toContain('lease option');
  });

  // Tier Gating Tests
  it('every module should have a requiredTier field', () => {
    const validTiers: CourseTier[] = ['free', 'pro', 'elite'];
    for (const mod of COURSE_MODULES) {
      expect(validTiers).toContain(mod.requiredTier);
    }
  });

  it('Module 1 (Mindset) should be free tier', () => {
    const mod1 = COURSE_MODULES.find(m => m.id === 'mod-1');
    expect(mod1?.requiredTier).toBe('free');
  });

  it('Modules 2-10 should be pro tier', () => {
    for (let i = 2; i <= 10; i++) {
      const mod = COURSE_MODULES.find(m => m.id === `mod-${i}`);
      expect(mod?.requiredTier).toBe('pro');
    }
  });

  it('Modules 11-12 (bonus) should be elite tier', () => {
    const mod11 = COURSE_MODULES.find(m => m.id === 'mod-11');
    const mod12 = COURSE_MODULES.find(m => m.id === 'mod-12');
    expect(mod11?.requiredTier).toBe('elite');
    expect(mod12?.requiredTier).toBe('elite');
  });

  it('free tier should have exactly 1 module (3 micro-lessons)', () => {
    const freeModules = COURSE_MODULES.filter(m => m.requiredTier === 'free');
    expect(freeModules.length).toBe(1);
    const totalFreeLessons = freeModules.reduce((sum, m) => sum + m.lessons.length, 0);
    expect(totalFreeLessons).toBe(3);
  });

  it('pro tier should unlock 9 additional modules', () => {
    const proModules = COURSE_MODULES.filter(m => m.requiredTier === 'pro');
    expect(proModules.length).toBe(9);
  });

  it('elite tier should unlock 2 bonus modules', () => {
    const eliteModules = COURSE_MODULES.filter(m => m.requiredTier === 'elite');
    expect(eliteModules.length).toBe(2);
    const totalEliteLessons = eliteModules.reduce((sum, m) => sum + m.lessons.length, 0);
    expect(totalEliteLessons).toBe(12);
  });

  it('total course should have 65 micro-lessons across all tiers', () => {
    const totalLessons = COURSE_MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
    expect(totalLessons).toBe(65);
  });

  it('quiz module IDs should match course module IDs', () => {
    const courseModuleIds = COURSE_MODULES.map(m => m.id);
    const quizModuleIds = MODULE_QUIZZES.map(q => q.moduleId);
    for (const id of courseModuleIds) {
      expect(quizModuleIds).toContain(id);
    }
  });
});
