import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const STYLES_DIR = path.resolve(__dirname, '../src/styles');
const TYPOGRAPHY_PATH = path.join(STYLES_DIR, 'typography.css');
const NEUMORPHISM_PATH = path.join(STYLES_DIR, 'neumorphism.css');
const MAIN_PATH = path.join(STYLES_DIR, 'main.css');

describe('Neumorphic Styling & Typography System', () => {
  it('has all 3 style files present on disk', () => {
    expect(fs.existsSync(TYPOGRAPHY_PATH), 'typography.css must exist').toBe(true);
    expect(fs.existsSync(NEUMORPHISM_PATH), 'neumorphism.css must exist').toBe(true);
    expect(fs.existsSync(MAIN_PATH), 'main.css must exist').toBe(true);
  });

  it('contains zero emojis in all CSS files', () => {
    const files = [TYPOGRAPHY_PATH, NEUMORPHISM_PATH, MAIN_PATH];
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA70}-\u{1FAFF}]/u;

    for (const filePath of files) {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        expect(emojiRegex.test(content), `Found emoji in ${filePath}`).toBe(false);
      }
    }
  });

  describe('typography.css', () => {
    it('defines required font custom properties and typography classes', () => {
      const content = fs.readFileSync(TYPOGRAPHY_PATH, 'utf-8');
      expect(content).toContain('--font-latin');
      expect(content).toContain('--font-arabic');
      expect(content).toContain('Plus Jakarta Sans');
      expect(content).toContain('Amiri');
      expect(content).toContain('.font-latin');
      expect(content).toContain('.latin-typography');
      expect(content).toContain('.font-arabic');
      expect(content).toContain('.arabic-typography');
      expect(content).toContain('.text-rtl');
      expect(content).toContain('direction: rtl');
    });
  });

  describe('neumorphism.css', () => {
    it('defines light and dark theme tokens and shadow presets', () => {
      const content = fs.readFileSync(NEUMORPHISM_PATH, 'utf-8');
      expect(content).toContain('--bg-primary');
      expect(content).toContain('--bg-surface');
      expect(content).toContain('--text-primary');
      expect(content).toContain('--accent-primary');
      expect(content).toContain('--neu-raised');
      expect(content).toContain('--neu-inset');
      expect(content).toContain('--neu-floating');
      expect(content).toContain('[data-theme="dark"]');
      expect(content).toContain('.theme-dark');
      expect(content).toContain('#F5F2EA');
      expect(content).toContain('#0F141F');
    });

    it('defines tactile neumorphic utility and component classes', () => {
      const content = fs.readFileSync(NEUMORPHISM_PATH, 'utf-8');
      expect(content).toContain('.neu-flat');
      expect(content).toContain('.neu-raised');
      expect(content).toContain('.neu-inset');
      expect(content).toContain('.neu-button');
      expect(content).toContain('.neu-card');
      expect(content).toContain('.neu-pill');
      expect(content).toContain('.neu-badge');
      expect(content).toContain('.neu-button:active');
      expect(content).toContain('min-height: 44px');
    });
  });

  describe('main.css', () => {
    it('imports typography and neumorphism sheets and defines base layout and utilities', () => {
      const content = fs.readFileSync(MAIN_PATH, 'utf-8');
      expect(content).toContain('typography.css');
      expect(content).toContain('neumorphism.css');
      expect(content).toContain('.app-container');
      expect(content).toContain('.header-bar');
      expect(content).toContain('.view-container');
      expect(content).toContain('.floating-dock');
      expect(content).toContain('.hidden');
      expect(content).toContain('.flex');
      expect(content).toContain('.grid');
      expect(content).toContain('.badge');
      expect(content).toContain('@keyframes');
      expect(content).toContain('@media (max-width: 820px)');
      expect(content).toContain('@media (max-width: 480px)');
    });
  });
});
