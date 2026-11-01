import { z } from 'astro/zod';
import { capabilitySchema, languageSchema } from '../schemas/data.ts';

/** Skills from the current Lebenslauf, grouped as capabilities. */
export const capabilities = z.array(capabilitySchema).parse([
  {
    id: 'cross-platform',
    title: { en: 'Cross-platform apps', de: 'Plattformübergreifende Apps' },
    summary: {
      en: 'iOS and Android apps from a shared .NET codebase, structured with MVVM; web UIs with Blazor and Razor.',
      de: 'iOS- und Android-Apps aus einer gemeinsamen .NET-Codebasis, strukturiert mit MVVM; Web-Oberflächen mit Blazor und Razor.',
    },
    skills: ['.NET MAUI', 'Xamarin', 'Blazor', 'Razor', 'MVVM', 'Native iOS', 'Android'],
    layers: ['ui', 'viewmodels'],
  },
  {
    id: 'backend',
    title: { en: 'Backend and APIs', de: 'Backend und APIs' },
    summary: {
      en: 'Scalable ASP.NET REST APIs in C#, documented with OpenAPI and backed by Entity Framework.',
      de: 'Skalierbare ASP.NET-REST-APIs in C#, dokumentiert mit OpenAPI und angebunden über Entity Framework.',
    },
    skills: [
      'C#',
      '.NET',
      '.NET Framework',
      'ASP.NET REST APIs',
      'OpenAPI/Swagger',
      'Entity Framework',
    ],
    layers: ['domain', 'api'],
  },
  {
    id: 'security',
    title: { en: 'Security and identity', de: 'Sicherheit und Identität' },
    summary: {
      en: 'Authentication and authorisation with Keycloak over OIDC and OAuth2, and fixes for the findings of security audits.',
      de: 'Authentifizierung und Autorisierung mit Keycloak über OIDC und OAuth2 sowie das Beheben von Befunden aus Sicherheitsaudits.',
    },
    skills: ['Keycloak', 'OAuth2', 'OIDC', 'Authentication', 'Authorisation', 'Audit fixes'],
    layers: ['identity'],
  },
  {
    id: 'delivery',
    title: { en: 'Delivery', de: 'Auslieferung' },
    summary: {
      en: 'CI/CD with GitLab, maintained deployment environments, structured code reviews and Agile/Scrum with Jira.',
      de: 'CI/CD mit GitLab, gepflegte Bereitstellungsumgebungen, strukturierte Code-Reviews und Agile/Scrum mit Jira.',
    },
    skills: ['GitLab CI/CD', 'Deployment environments', 'Code reviews', 'Agile/Scrum', 'Jira'],
    layers: ['cicd'],
  },
  {
    id: 'data',
    title: { en: 'Data', de: 'Daten' },
    summary: {
      en: 'Relational databases and Firebase.',
      de: 'Relationale Datenbanken und Firebase.',
    },
    skills: ['PostgreSQL', 'MySQL', 'Firebase'],
    layers: ['data'],
  },
]);

/** Languages with levels from the current Lebenslauf. */
export const languages = z.array(languageSchema).parse([
  {
    id: 'ar',
    name: { en: 'Arabic', de: 'Arabisch' },
    level: { en: 'Native', de: 'Muttersprache' },
  },
  {
    id: 'en',
    name: { en: 'English', de: 'Englisch' },
    level: { en: 'Advanced', de: 'Fortgeschritten' },
  },
  {
    id: 'de',
    name: { en: 'German', de: 'Deutsch' },
    level: { en: 'Intermediate', de: 'Mittelstufe' },
  },
  {
    id: 'fr',
    name: { en: 'French', de: 'Französisch' },
    level: { en: 'Intermediate', de: 'Mittelstufe' },
  },
]);
