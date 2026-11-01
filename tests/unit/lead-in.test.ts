import { describe, expect, it } from 'vitest';
import { leadIn } from '../../src/lib/lead-in.ts';

describe('case-study lead-ins', () => {
  it('splits a label off and starts the rest as a sentence', () => {
    expect(leadIn('Legacy code: a React Native app', 'en')).toEqual({
      lead: 'Legacy code',
      rest: 'A React Native app',
    });
    expect(leadIn('Altlasten: eine App', 'de')).toEqual({ lead: 'Altlasten', rest: 'Eine App' });
  });

  it('keeps the case of words with an inner capital', () => {
    expect(leadIn('Two platforms: iOS and Android', 'en').rest).toBe('iOS and Android');
    expect(leadIn('Zwei Plattformen: iOS und Android', 'de').rest).toBe('iOS und Android');
    expect(leadIn('Security: OAuth2 tokens', 'en').rest).toBe('OAuth2 tokens');
  });

  it('leaves text without a lead-in alone', () => {
    expect(leadIn('no colon here', 'en')).toEqual({ rest: 'no colon here' });
    expect(leadIn('[DETAIL: a placeholder]', 'en')).toEqual({ rest: '[DETAIL: a placeholder]' });
  });
});
