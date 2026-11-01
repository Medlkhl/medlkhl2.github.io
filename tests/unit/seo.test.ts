import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BASE_PATH, SITE_URL } from '../../site.config.ts';
import { education } from '../../src/data/experience.ts';
import { NAME } from '../../src/data/identity.ts';
import { layers } from '../../src/data/layers.ts';
import { profile } from '../../src/data/profile.ts';
import { languages } from '../../src/data/skills.ts';
import { LOCALES } from '../../src/i18n/config.ts';
import {
  fillTemplate,
  type MetaKey,
  metaTemplates,
  pageMeta,
  socialCopy,
} from '../../src/i18n/meta.copy.ts';
import { ROUTE_KEYS } from '../../src/i18n/routes.ts';
import { caseStudyCard, notFoundCard, pageCard, siteLabel } from '../../src/lib/og/cards.ts';
import { hasPlaceholder } from '../../src/lib/placeholders.ts';
import {
  PERSON_ID,
  WEBSITE_ID,
  breadcrumbJsonLd,
  personJsonLd,
  websiteJsonLd,
} from '../../src/lib/structured-data.ts';
import { normalizeBase } from '../../src/lib/url.ts';
import type { WorkFrontmatter } from '../../src/schemas/work.ts';
import { datenschutzCopy } from '../../src/views/datenschutz/datenschutz.copy.ts';
import { impressumCopy } from '../../src/views/impressum/impressum.copy.ts';
import { legalCopy } from '../../src/views/legal/legal.copy.ts';
import { LEGAL_FEATURES, type LegalSection, visibleSections } from '../../src/views/legal/legal.ts';
import { WORK_DIR, readMdx, workFiles } from './helpers.ts';

const ROOT = `${SITE_URL.replace(/\/+$/, '')}${normalizeBase(BASE_PATH)}`;
const fullTitle = (title: string) => (title.includes(NAME) ? title : `${title} — ${NAME}`);
/** JSON round trip: no undefined values, functions or class instances in the output. */
const roundTrip = (value: unknown) => JSON.parse(JSON.stringify(value)) as unknown;

describe('JSON-LD builders', () => {
  for (const locale of LOCALES) {
    describe(locale, () => {
      const person = personJsonLd(locale);

      it('Person has the identity, role, links and coarse location', () => {
        expect(person).toMatchObject({
          '@context': 'https://schema.org',
          '@type': 'Person',
          '@id': `${ROOT}#person`,
          name: NAME,
          jobTitle: profile.role[locale],
          description: profile.positioning[locale],
          url: ROOT,
          email: `mailto:${profile.email}`,
          sameAs: [profile.links.linkedin, profile.links.github],
        });
        expect(person['@id']).toBe(PERSON_ID);
        expect(person.address).toEqual({
          '@type': 'PostalAddress',
          addressLocality: 'Tuttlingen',
          addressRegion: 'Baden-Württemberg',
          addressCountry: 'DE',
        });
        for (const url of person.sameAs as string[]) expect(url).toMatch(/^https:\/\//);
      });

      it('Person lists languages, skills and education from the data', () => {
        const spoken = person.knowsLanguage as Array<Record<string, string>>;
        expect(spoken).toHaveLength(languages.length);
        for (const [index, language] of languages.entries()) {
          expect(spoken[index]).toEqual({
            '@type': 'Language',
            name: language.name[locale],
            alternateName: language.id,
          });
        }
        const topics = person.knowsAbout as string[];
        expect(topics.length).toBeGreaterThan(10);
        expect(new Set(topics).size).toBe(topics.length);
        for (const skill of profile.coreStack) expect(topics).toContain(skill);
        expect(person.alumniOf).toEqual(
          education.map((entry) => ({
            '@type': 'CollegeOrUniversity',
            name: entry.institution[locale],
            address: entry.location[locale],
          })),
        );
      });

      it('Person never publishes a phone number, birth date, street address or Facebook', () => {
        const json = JSON.stringify(person).toLowerCase();
        for (const forbidden of [
          'telephone',
          'birthdate',
          'streetaddress',
          'postalcode',
          'facebook',
          'image',
        ]) {
          expect(json).not.toContain(forbidden);
        }
      });

      it('WebSite points at its author and covers both languages', () => {
        const site = websiteJsonLd(locale);
        expect(site).toEqual({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': WEBSITE_ID,
          name: NAME,
          description: profile.positioning[locale],
          url: ROOT,
          inLanguage: ['en', 'de'],
          author: { '@id': PERSON_ID },
          publisher: { '@id': PERSON_ID },
        });
        expect(WEBSITE_ID).toBe(`${ROOT}#website`);
      });

      it('BreadcrumbList localizes and absolutizes every crumb', () => {
        const crumbs = breadcrumbJsonLd(locale, [
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/work/' },
          { name: 'HAPP', path: '/work/happ/' },
        ]);
        const prefix = locale === 'en' ? ROOT : `${ROOT}de/`;
        expect(crumbs).toEqual({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: prefix },
            { '@type': 'ListItem', position: 2, name: 'Work', item: `${prefix}work/` },
            { '@type': 'ListItem', position: 3, name: 'HAPP', item: `${prefix}work/happ/` },
          ],
        });
      });

      it('every builder serialises to plain JSON', () => {
        for (const data of [
          person,
          websiteJsonLd(locale),
          breadcrumbJsonLd(locale, [{ name: 'Home', path: '/' }]),
        ]) {
          expect(roundTrip(data)).toEqual(data);
        }
      });
    });
  }
});

describe('page meta', () => {
  const keys = Object.keys(pageMeta.en) as MetaKey[];
  const indexable = keys.filter((key) => key !== 'notFound');

  it('covers every registered route plus the 404 page', () => {
    expect(keys.sort()).toEqual([...ROUTE_KEYS, 'notFound'].sort());
  });

  for (const locale of LOCALES) {
    for (const key of indexable) {
      it(`${locale}/${key}: title ≤ 60 characters with the name, description 110–160`, () => {
        const meta = pageMeta[locale][key];
        expect(fullTitle(meta.title).length).toBeLessThanOrEqual(60);
        expect(meta.description.length).toBeGreaterThanOrEqual(110);
        expect(meta.description.length).toBeLessThanOrEqual(160);
        expect(hasPlaceholder(meta.title) || hasPlaceholder(meta.description)).toBe(false);
      });
    }
  }

  it('titles and descriptions are unique across both locales', () => {
    const titles = LOCALES.flatMap((locale) => keys.map((key) => pageMeta[locale][key].title));
    const descriptions = LOCALES.flatMap((locale) =>
      keys.map((key) => pageMeta[locale][key].description),
    );
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it('templates use only the tokens the SEO component fills in', () => {
    for (const locale of LOCALES) {
      for (const template of Object.values(metaTemplates[locale])) {
        const tokens = [...template.matchAll(/\{(\w+)\}/g)].map((match) => match[1]);
        for (const token of tokens) expect(['title', 'name', 'role']).toContain(token);
      }
    }
    expect(fillTemplate('{title} — {name}', { title: 'CV', name: NAME })).toBe(`CV — ${NAME}`);
    expect(fillTemplate('{unknown}', {})).toBe('{unknown}');
  });

  it('case-study titles stay distinct between the locales and within 60 characters', () => {
    for (const file of workFiles('en')) {
      const titles = LOCALES.map((locale) => {
        const { data } = readMdx(join(WORK_DIR, locale, file));
        return fullTitle(
          fillTemplate(metaTemplates[locale].caseStudyTitle, { title: String(data.title) }),
        );
      });
      expect(new Set(titles).size).toBe(LOCALES.length);
      for (const title of titles) expect(title.length).toBeLessThanOrEqual(60);
    }
  });

  it('fallback descriptions for case studies are long enough and placeholder-free', () => {
    for (const locale of LOCALES) {
      const text = fillTemplate(metaTemplates[locale].caseStudyDescription, {
        title: 'Smart Humanoid Robot',
        name: NAME,
        role: profile.role[locale],
      });
      expect(text.length).toBeGreaterThanOrEqual(110);
      expect(text.length).toBeLessThanOrEqual(160);
      expect(hasPlaceholder(text)).toBe(false);
    }
  });
});

describe('social image cards', () => {
  it('every page and locale has a card without placeholders', () => {
    for (const locale of LOCALES) {
      for (const key of ROUTE_KEYS) {
        const card = pageCard(locale, key);
        expect(card.headline.trim()).not.toBe('');
        expect(card.kicker.label.trim()).not.toBe('');
        expect(card.kicker.index ?? '00').toMatch(/^\d{2}$/);
        for (const text of [card.headline, card.lede ?? '', card.kicker.label]) {
          expect(hasPlaceholder(text)).toBe(false);
        }
        expect(card.footer.site).toBe(siteLabel());
      }
    }
    expect(pageCard('en', 'home').headline).toBe(NAME);
    expect(pageCard('de', 'experience').kicker).toEqual({
      index: '02',
      label: socialCopy.de.cards.experience.label,
    });
  });

  it('the site label has no protocol and no trailing slash', () => {
    expect(siteLabel()).toBe(ROOT.replace(/^https?:\/\//, '').replace(/\/$/, ''));
  });

  const base: Pick<WorkFrontmatter, 'title' | 'summary' | 'outcome' | 'status' | 'scene'> = {
    title: 'HAPP',
    summary: 'A summary that is long enough to be a real one.',
    outcome: 'An outcome.',
    status: 'internal',
    scene: { shot: 'cam_work_happ', layer: 'layer_identity' },
  };

  it('case-study cards highlight the scene layer and print its legend', () => {
    const identity = layers.find((layer) => layer.id === 'identity');
    for (const locale of LOCALES) {
      const card = caseStudyCard(locale, base);
      expect(card.layer).toEqual({
        position: (identity?.index ?? 0) - 1,
        number: '05',
        legend: `${socialCopy[locale].layer} 05 — ${identity?.label[locale]}`,
      });
      expect(card.kicker.label).toContain(socialCopy[locale].caseStudy);
      expect(card.lede).toBe('An outcome.');
    }
  });

  it('case-study cards never print a placeholder', () => {
    const outcomeMissing = { ...base, outcome: '[TODO: one-line outcome]' };
    expect(caseStudyCard('en', outcomeMissing).lede).toBe(base.summary);
    const bothMissing = { ...outcomeMissing, summary: '[TODO: summary of the case study]' };
    expect(caseStudyCard('en', bothMissing).lede).toBeUndefined();
  });

  it('the 404 card is bilingual', () => {
    const card = notFoundCard();
    expect(card.headline).toBe(pageMeta.en.notFound.title);
    expect(card.lede).toContain(pageMeta.de.notFound.title);
  });
});

describe('legal pages', () => {
  const pages = { impressum: impressumCopy, datenschutz: datenschutzCopy };
  const textOf = (sections: LegalSection[]) => JSON.stringify(sections);

  it('the spatial-view section exists in both locales and stays hidden while its flag is off', () => {
    expect(LEGAL_FEATURES.spatialView).toBe(false);
    for (const locale of LOCALES) {
      const sections = datenschutzCopy[locale].sections;
      const spatial = sections.filter((section) => section.requires === 'spatialView');
      expect(spatial).toHaveLength(1);
      expect(visibleSections(sections)).toHaveLength(sections.length - 1);
      expect(visibleSections(sections, { spatialView: true })).toHaveLength(sections.length);
    }
  });

  it('the provider address is a set of placeholders until the owner supplies it', () => {
    for (const locale of LOCALES) {
      expect(legalCopy[locale].address.slice(0, 3)).toEqual([
        '[NAME: full legal name]',
        '[ADDRESS: street and house number]',
        '[ADDRESS: postcode and city]',
      ]);
      // The postal address appears only on the Impressum (owner rule); the privacy
      // policy names the controller and points to the Impressum for the address.
      const blocksOf = (copy: (typeof pages)[keyof typeof pages]) =>
        copy[locale].sections.flatMap((section) => section.blocks).map((block) => block.type);
      const impressum = blocksOf(pages.impressum);
      const datenschutz = blocksOf(pages.datenschutz);
      expect(impressum).toContain('address');
      expect(impressum).toContain('email');
      expect(datenschutz).not.toContain('address');
      expect(datenschutz).toEqual(expect.arrayContaining(['name', 'addressRef', 'email']));
    }
  });

  it('the binding German texts cite the legal bases they rely on', () => {
    expect(textOf(impressumCopy.de.sections)).toContain('§ 18 Abs. 2');
    expect(impressumCopy.de.lede).toContain('§ 5');
    const privacy = textOf(datenschutzCopy.de.sections);
    for (const basis of [
      'Art. 6 Abs. 1 lit. f DSGVO',
      'Art. 6 Abs. 1 lit. b DSGVO',
      'Art. 15 bis 21 DSGVO',
      'Art. 77 DSGVO',
      '§ 25 Abs. 2 Nr. 2 TDDDG',
      'Data Privacy Framework',
      'Baden-Württemberg',
    ]) {
      expect(privacy).toContain(basis);
    }
  });

  it('section ids are unique per page and external links use https', () => {
    for (const copy of Object.values(pages)) {
      for (const locale of LOCALES) {
        const ids = copy[locale].sections.map((section) => section.id);
        expect(new Set(ids).size).toBe(ids.length);
        for (const block of copy[locale].sections.flatMap((section) => section.blocks)) {
          if (block.type === 'link') expect(block.href).toMatch(/^https:\/\//);
        }
      }
    }
  });
});
