import { defineCopy } from '../../i18n/copy.ts';
import type { LegalPageCopy } from '../legal/legal.ts';

/**
 * Impressum under § 5 DDG (Digitale-Dienste-Gesetz, in force since 14 May
 * 2024): name, postal address and fast electronic contact, plus the optional
 * line under § 18 Abs. 2 MStV and two short notes. The German text is binding.
 * Orientation, not legal advice (brief §11).
 */
export const impressumCopy = defineCopy<LegalPageCopy>({
  en: {
    title: 'Legal notice (Impressum)',
    lede: 'Information under § 5 of the German Digital Services Act (Digitale-Dienste-Gesetz, DDG).',
    sections: [
      {
        id: 'provider',
        title: 'Service provider',
        blocks: [{ type: 'address' }],
      },
      {
        id: 'contact',
        title: 'Contact',
        blocks: [{ type: 'email' }],
      },
      {
        id: 'responsible',
        title: 'Responsible for the content',
        blocks: [
          {
            type: 'p',
            text: 'Responsible for the content under § 18(2) of the German Interstate Media Treaty (Medienstaatsvertrag, MStV): [NAME: full legal name], address as above.',
          },
        ],
      },
      {
        id: 'links',
        title: 'Links to other websites',
        blocks: [
          {
            type: 'p',
            text: 'This website links to external websites such as LinkedIn, GitHub and YouTube. Their operators alone are responsible for their content. If I learn of unlawful content behind a link, I remove the link.',
          },
        ],
      },
      {
        id: 'copyright',
        title: 'Copyright',
        blocks: [
          {
            type: 'p',
            text: 'The texts, images and graphics on this website are protected by copyright. Any use beyond what the law permits needs my prior consent. Third-party trademarks and product names belong to their owners.',
          },
        ],
      },
    ],
  },
  de: {
    title: 'Impressum',
    lede: 'Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG).',
    sections: [
      {
        id: 'anbieter',
        title: 'Diensteanbieter',
        blocks: [{ type: 'address' }],
      },
      {
        id: 'kontakt',
        title: 'Kontakt',
        blocks: [{ type: 'email' }],
      },
      {
        id: 'verantwortlich',
        title: 'Verantwortlich für den Inhalt',
        blocks: [
          {
            type: 'p',
            text: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 Medienstaatsvertrag (MStV): [NAME: full legal name], Anschrift wie oben.',
          },
        ],
      },
      {
        id: 'links',
        title: 'Links auf andere Websites',
        blocks: [
          {
            type: 'p',
            text: 'Diese Website verlinkt auf externe Websites wie LinkedIn, GitHub und YouTube. Für deren Inhalte sind ausschließlich die jeweiligen Betreiber verantwortlich. Erfahre ich von rechtswidrigen Inhalten hinter einem Link, entferne ich den Link.',
          },
        ],
      },
      {
        id: 'urheberrecht',
        title: 'Urheberrecht',
        blocks: [
          {
            type: 'p',
            text: 'Texte, Bilder und Grafiken auf dieser Website sind urheberrechtlich geschützt. Jede Nutzung über die gesetzlich erlaubten Fälle hinaus bedarf meiner vorherigen Zustimmung. Marken und Produktnamen Dritter gehören ihren jeweiligen Inhabern.',
          },
        ],
      },
    ],
  },
});
