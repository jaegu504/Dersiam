import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getIconSvg, ICON_NAMES } from '../src/components/icons.js';
import { playPureSfx, isAudioMuted, setAudioMute, toggleAudioMute } from '../src/services/audio.js';

describe('Zero-Emoji SVG Vector Registry', () => {
  const EXPECTED_ICONS = [
    'home', 'sun', 'moon', 'search', 'settings', 'chart',
    'star', 'starFilled', 'arrowLeft', 'arrowRight', 'chevronDown', 'chevronUp',
    'eye', 'eyeOff', 'copy', 'pencil', 'cross', 'check', 'refresh', 'help',
    'book', 'timer', 'modeExam', 'modeReader', 'volumeOn', 'volumeOff',
    'close', 'clock'
  ];

  it('exports ICON_NAMES containing all 28 required icon names', () => {
    expect(Array.isArray(ICON_NAMES)).toBe(true);
    expect(ICON_NAMES.length).toBe(EXPECTED_ICONS.length);
    EXPECTED_ICONS.forEach((name) => {
      expect(ICON_NAMES).toContain(name);
    });
  });

  it('renders valid SVG strings for all icon keys with standard attributes', () => {
    ICON_NAMES.forEach((name) => {
      const svg = getIconSvg(name);
      expect(svg).toMatch(/^<svg/);
      expect(svg).toMatch(/<\/svg>$/);
      expect(svg).toContain('viewBox="0 0 24 24"');
      expect(svg).toContain('width="20"');
      expect(svg).toContain('height="20"');
      expect(svg).toContain('fill="none"');
      expect(svg).toContain('stroke="currentColor"');
      expect(svg).toContain('stroke-width="2"');
      expect(svg).toContain('stroke-linecap="round"');
      expect(svg).toContain('stroke-linejoin="round"');
      // Ensure zero emojis in icon output
      expect(svg).not.toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u);
    });
  });

  it('guarantees zero emoji in the entire icons.js and audio.js source files', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const iconsSource = fs.readFileSync(path.resolve(__dirname, '../src/components/icons.js'), 'utf-8');
    const audioSource = fs.readFileSync(path.resolve(__dirname, '../src/services/audio.js'), 'utf-8');
    const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

    expect(iconsSource).not.toMatch(emojiRegex);
    expect(audioSource).not.toMatch(emojiRegex);
  });

  it('accepts custom size and className arguments', () => {
    const svg = getIconSvg('home', 32, 'custom-class icon-primary');
    expect(svg).toContain('width="32"');
    expect(svg).toContain('height="32"');
    expect(svg).toContain('class="custom-class icon-primary"');
  });

  it('falls back safely for unknown icon names', () => {
    const fallbackSvg = getIconSvg('non_existent_icon');
    expect(fallbackSvg).toBeDefined();
    expect(fallbackSvg).toMatch(/^<svg/);
    expect(fallbackSvg).toMatch(/<\/svg>$/);
    expect(fallbackSvg).not.toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u);
  });
});

describe('Web Audio API Pure Sound Synthesizer', () => {
  beforeEach(() => {
    setAudioMute(false);
    vi.restoreAllMocks();
  });

  it('manages mute state correctly', () => {
    expect(isAudioMuted()).toBe(false);
    const muted = toggleAudioMute();
    expect(muted).toBe(true);
    expect(isAudioMuted()).toBe(true);
    const unmuted = toggleAudioMute();
    expect(unmuted).toBe(false);
    expect(isAudioMuted()).toBe(false);

    setAudioMute(true);
    expect(isAudioMuted()).toBe(true);
    setAudioMute(false);
    expect(isAudioMuted()).toBe(false);
  });

  it('safely no-ops when window.AudioContext is not present', () => {
    const originalAudioContext = window.AudioContext;
    const originalWebkitAudioContext = window.webkitAudioContext;
    try {
      delete window.AudioContext;
      delete window.webkitAudioContext;
      expect(() => playPureSfx('click')).not.toThrow();
      expect(() => playPureSfx('flip')).not.toThrow();
      expect(() => playPureSfx('chime')).not.toThrow();
    } finally {
      if (originalAudioContext) window.AudioContext = originalAudioContext;
      if (originalWebkitAudioContext) window.webkitAudioContext = originalWebkitAudioContext;
    }
  });

  it('does not synthesize sound when muted', () => {
    const mockCreateOscillator = vi.fn();
    window.AudioContext = vi.fn().mockImplementation(() => ({
      state: 'running',
      currentTime: 0,
      createOscillator: mockCreateOscillator,
      createGain: vi.fn(),
      destination: {},
    }));

    setAudioMute(true);
    playPureSfx('click');
    playPureSfx('flip');
    playPureSfx('chime');

    expect(mockCreateOscillator).not.toHaveBeenCalled();
  });

  it('synthesizes sound effects when active and unmuted', () => {
    const mockOscillator = {
      type: 'sine',
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };

    const mockGain = {
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };

    window.AudioContext = vi.fn().mockImplementation(() => ({
      state: 'running',
      currentTime: 0,
      createOscillator: vi.fn().mockReturnValue(mockOscillator),
      createGain: vi.fn().mockReturnValue(mockGain),
      destination: {},
      resume: vi.fn().mockResolvedValue(),
    }));

    setAudioMute(false);

    // click
    playPureSfx('click');
    expect(mockOscillator.start).toHaveBeenCalled();
    expect(mockOscillator.stop).toHaveBeenCalled();

    // flip
    mockOscillator.start.mockClear();
    mockOscillator.stop.mockClear();
    playPureSfx('flip');
    expect(mockOscillator.start).toHaveBeenCalled();
    expect(mockOscillator.stop).toHaveBeenCalled();

    // chime
    mockOscillator.start.mockClear();
    mockOscillator.stop.mockClear();
    playPureSfx('chime');
    expect(mockOscillator.start).toHaveBeenCalled();
    expect(mockOscillator.stop).toHaveBeenCalled();
  });

  it('resumes suspended AudioContext on play', () => {
    const resumeMock = vi.fn().mockResolvedValue();
    window.AudioContext = vi.fn().mockImplementation(() => ({
      state: 'suspended',
      currentTime: 0,
      createOscillator: vi.fn().mockReturnValue({
        frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      }),
      createGain: vi.fn().mockReturnValue({
        gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        connect: vi.fn(),
      }),
      destination: {},
      resume: resumeMock,
    }));

    playPureSfx('click');
    expect(resumeMock).toHaveBeenCalled();
  });

  it('ignores invalid sound effect types safely', () => {
    const mockCreateOscillator = vi.fn();
    window.AudioContext = vi.fn().mockImplementation(() => ({
      state: 'running',
      currentTime: 0,
      createOscillator: mockCreateOscillator,
      createGain: vi.fn(),
      destination: {},
    }));

    expect(() => playPureSfx('unknown_sfx_type')).not.toThrow();
    expect(mockCreateOscillator).not.toHaveBeenCalled();
  });
});

