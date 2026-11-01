import { z } from 'astro/zod';
import { recommendationSchema } from '../schemas/data.ts';

/**
 * Recommendations. Quotes are verbatim excerpts and are never rephrased; they
 * stay in English in both locales (rendered with lang="en"). The full text of
 * the Khayati recommendation is on the old site (medlkhl.github.io, "Reference").
 * Slots stay empty until the owner supplies recent recommendations (brief §15).
 */
export const recommendations = z.array(recommendationSchema).parse([
  {
    kind: 'quote',
    id: 'naoufel-khayati',
    author: 'Naoufel Khayati',
    role: { en: 'Director, 4C ENISo', de: 'Direktor, 4C ENISo' },
    context: {
      en: 'Robotics and engineering studies at ENISo, Sousse',
      de: 'Robotik und Ingenieurstudium an der ENISo, Sousse',
    },
    quote: {
      lang: 'en',
      text: 'He is very dynamic, passionate about Robotics and Computer Science, and he has excellent interpersonal skills.',
    },
    work: ['humanoid-robot'],
  },
  {
    kind: 'slot',
    id: 'slot-manager',
    wanted: {
      en: 'A recent recommendation from a manager',
      de: 'Eine aktuelle Empfehlung einer Führungskraft',
    },
    placeholder: {
      en: '[RECOMMENDATION: manager at Anton-Haering]',
      de: '[RECOMMENDATION: Führungskraft bei Anton-Haering]',
    },
  },
  {
    kind: 'slot',
    id: 'slot-peer',
    wanted: { en: 'From a peer engineer', de: 'Von einer Kollegin oder einem Kollegen' },
    placeholder: {
      en: '[RECOMMENDATION: peer engineer]',
      de: '[RECOMMENDATION: Kollegin oder Kollege aus der Entwicklung]',
    },
  },
  {
    kind: 'slot',
    id: 'slot-coached',
    wanted: {
      en: 'From someone I coached',
      de: 'Von jemandem, den ich gecoacht habe',
    },
    placeholder: {
      en: '[RECOMMENDATION: developer I coached]',
      de: '[RECOMMENDATION: gecoachte Entwicklerin oder gecoachter Entwickler]',
    },
  },
]);

export function getRecommendation(id: string) {
  return recommendations.find((entry) => entry.id === id);
}
