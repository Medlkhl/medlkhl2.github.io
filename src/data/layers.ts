import { z } from 'astro/zod';
import { LAYER_IDS, type LayerId, layerSchema } from '../schemas/data.ts';

/**
 * The exploded architecture stack, top (UI) to bottom (CI/CD).
 * One data file drives the classic-mode SVG and its HTML mirror today, and the
 * Phase 3 scene (mesh names layer_<id>, label anchors lbl_<id>) later.
 * Links only point at case studies and skills that genuinely involve the layer.
 */
export const layers = z
  .array(layerSchema)
  .length(LAYER_IDS.length)
  .parse([
    {
      id: 'ui',
      index: 1,
      label: { en: 'UI', de: 'UI' },
      description: {
        en: 'Cross-platform interfaces for iOS and Android, Blazor web UIs and 3D rendered in a WebView.',
        de: 'Plattformübergreifende Oberflächen für iOS und Android, Blazor-Web-UIs und 3D-Darstellung in einer WebView.',
      },
      skills: [
        { name: '.NET MAUI', capability: 'cross-platform' },
        { name: 'Xamarin', capability: 'cross-platform' },
        { name: 'Blazor', capability: 'cross-platform' },
        { name: 'Razor', capability: 'cross-platform' },
      ],
      work: ['happ', 'holobox', 'humanoid-robot'],
      scene: { mesh: 'layer_ui', anchor: 'lbl_ui' },
    },
    {
      id: 'viewmodels',
      index: 2,
      label: { en: 'View models (MVVM)', de: 'View-Models (MVVM)' },
      description: {
        en: 'Presentation logic kept out of the views, so screens stay thin and behaviour stays testable.',
        de: 'Präsentationslogik außerhalb der Views, damit Oberflächen schlank und Verhalten testbar bleiben.',
      },
      skills: [
        { name: 'MVVM', capability: 'cross-platform' },
        { name: 'C#', capability: 'backend' },
      ],
      work: ['happ'],
      scene: { mesh: 'layer_viewmodels', anchor: 'lbl_viewmodels' },
    },
    {
      id: 'domain',
      index: 3,
      label: { en: 'Domain', de: 'Domäne' },
      description: {
        en: 'Business rules at the centre of a Clean Architecture, independent of UI and infrastructure.',
        de: 'Geschäftsregeln im Kern einer Clean Architecture, unabhängig von UI und Infrastruktur.',
      },
      skills: [
        { name: 'C#', capability: 'backend' },
        { name: '.NET', capability: 'backend' },
      ],
      work: ['happ', 'holobox'],
      scene: { mesh: 'layer_domain', anchor: 'lbl_domain' },
    },
    {
      id: 'api',
      index: 4,
      label: { en: 'APIs', de: 'APIs' },
      description: {
        en: 'ASP.NET REST APIs that connect the apps to company systems, documented with OpenAPI.',
        de: 'ASP.NET-REST-APIs, die die Apps mit Unternehmenssystemen verbinden, dokumentiert mit OpenAPI.',
      },
      skills: [
        { name: 'ASP.NET REST APIs', capability: 'backend' },
        { name: 'OpenAPI/Swagger', capability: 'backend' },
        { name: 'Entity Framework', capability: 'backend' },
      ],
      work: ['happ'],
      scene: { mesh: 'layer_api', anchor: 'lbl_api' },
    },
    {
      id: 'identity',
      index: 5,
      label: { en: 'Identity (OIDC/Keycloak)', de: 'Identität (OIDC/Keycloak)' },
      description: {
        en: 'Sign-in and access control with Keycloak over OpenID Connect and OAuth2, hardened against audit findings.',
        de: 'Anmeldung und Zugriffskontrolle mit Keycloak über OpenID Connect und OAuth2, gehärtet anhand von Auditbefunden.',
      },
      skills: [
        { name: 'Keycloak', capability: 'security' },
        { name: 'OIDC', capability: 'security' },
        { name: 'OAuth2', capability: 'security' },
      ],
      work: ['happ'],
      scene: { mesh: 'layer_identity', anchor: 'lbl_identity' },
    },
    {
      id: 'data',
      index: 6,
      label: { en: 'Data', de: 'Daten' },
      description: {
        en: 'Relational databases and Firebase, from enterprise data to remote control of a robot.',
        de: 'Relationale Datenbanken und Firebase – von Unternehmensdaten bis zur Fernsteuerung eines Roboters.',
      },
      skills: [
        { name: 'PostgreSQL', capability: 'data' },
        { name: 'MySQL', capability: 'data' },
        { name: 'Firebase', capability: 'data' },
      ],
      work: ['humanoid-robot'],
      scene: { mesh: 'layer_data', anchor: 'lbl_data' },
    },
    {
      id: 'cicd',
      index: 7,
      label: { en: 'CI/CD', de: 'CI/CD' },
      description: {
        en: 'Pipelines, deployment environments and the review practice that keeps releases predictable.',
        de: 'Pipelines, Bereitstellungsumgebungen und eine Review-Praxis, die Releases planbar macht.',
      },
      skills: [
        { name: 'GitLab CI/CD', capability: 'delivery' },
        { name: 'Deployment environments', capability: 'delivery' },
        { name: 'Code reviews', capability: 'delivery' },
      ],
      work: ['happ'],
      scene: { mesh: 'layer_cicd', anchor: 'lbl_cicd' },
    },
  ]);

export function getLayer(id: LayerId) {
  const layer = layers.find((entry) => entry.id === id);
  if (!layer) throw new Error(`Unknown layer "${id}"`);
  return layer;
}
