import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Course Videos Data', () => {
  // Read the generated courseVideos.ts file and parse it
  const filePath = resolve(__dirname, '../client/src/lib/courseVideos.ts');
  const fileContent = readFileSync(filePath, 'utf-8');

  it('should have exactly 65 video entries', () => {
    // Count the number of lesson ID entries (e.g., "l-1-1":)
    const entries = fileContent.match(/"l-\d+-\d+":/g);
    expect(entries).not.toBeNull();
    expect(entries!.length).toBe(65);
  });

  it('should have valid publicUrl for every entry', () => {
    // Extract all publicUrl values
    const urls = fileContent.match(/publicUrl: "([^"]+)"/g);
    expect(urls).not.toBeNull();
    expect(urls!.length).toBe(65);
    
    // Each URL should be a Colossyan CloudFront URL
    urls!.forEach((urlLine) => {
      const url = urlLine.replace('publicUrl: "', '').replace('"', '');
      expect(url).toContain('d16jwoab4xr2kx.cloudfront.net');
      expect(url).toContain('.mp4');
    });
  });

  it('should have valid thumbnailUrl for every entry', () => {
    const thumbs = fileContent.match(/thumbnailUrl: "([^"]+)"/g);
    expect(thumbs).not.toBeNull();
    expect(thumbs!.length).toBe(65);
    
    thumbs!.forEach((thumbLine) => {
      const url = thumbLine.replace('thumbnailUrl: "', '').replace('"', '');
      expect(url).toContain('d16jwoab4xr2kx.cloudfront.net');
      expect(url).toContain('.jpg');
    });
  });

  it('should have positive durationSeconds for every entry', () => {
    const durations = fileContent.match(/durationSeconds: (\d+)/g);
    expect(durations).not.toBeNull();
    expect(durations!.length).toBe(65);
    
    durations!.forEach((durLine) => {
      const dur = parseInt(durLine.replace('durationSeconds: ', ''));
      expect(dur).toBeGreaterThan(0);
    });
  });

  it('should cover all 12 modules', () => {
    const moduleNumbers = new Set<number>();
    const entries = fileContent.match(/"l-(\d+)-\d+":/g);
    entries!.forEach((entry) => {
      const match = entry.match(/"l-(\d+)-\d+":/);
      if (match) moduleNumbers.add(parseInt(match[1]));
    });
    
    // Modules 1-12
    for (let i = 1; i <= 12; i++) {
      expect(moduleNumbers.has(i)).toBe(true);
    }
  });

  it('should have expected lesson counts per module', () => {
    const moduleCounts: Record<number, number> = {};
    const entries = fileContent.match(/"l-(\d+)-\d+":/g);
    entries!.forEach((entry) => {
      const match = entry.match(/"l-(\d+)-\d+":/);
      if (match) {
        const mod = parseInt(match[1]);
        moduleCounts[mod] = (moduleCounts[mod] || 0) + 1;
      }
    });
    
    // Expected counts: M1=3, M2=8, M3=7, M4=8, M5=3, M6=3, M7=3, M8=3, M9=3, M10=12, M11=7, M12=5
    expect(moduleCounts[1]).toBe(3);
    expect(moduleCounts[2]).toBe(8);
    expect(moduleCounts[3]).toBe(7);
    expect(moduleCounts[4]).toBe(8);
    expect(moduleCounts[5]).toBe(3);
    expect(moduleCounts[6]).toBe(3);
    expect(moduleCounts[7]).toBe(3);
    expect(moduleCounts[8]).toBe(3);
    expect(moduleCounts[9]).toBe(3);
    expect(moduleCounts[10]).toBe(12);
    expect(moduleCounts[11]).toBe(7);
    expect(moduleCounts[12]).toBe(5);
  });

  it('total video duration should be approximately 6 hours', () => {
    const durations = fileContent.match(/durationSeconds: (\d+)/g);
    let totalSeconds = 0;
    durations!.forEach((durLine) => {
      totalSeconds += parseInt(durLine.replace('durationSeconds: ', ''));
    });
    
    const totalHours = totalSeconds / 3600;
    // Should be between 5 and 8 hours
    expect(totalHours).toBeGreaterThan(5);
    expect(totalHours).toBeLessThan(8);
  });
});
