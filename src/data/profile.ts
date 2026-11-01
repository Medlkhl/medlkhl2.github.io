import { profileSchema } from '../schemas/data.ts';
import { EMAIL, LINKS, NAME } from './identity.ts';

/**
 * Profile: the facts behind the hero, the quick-facts card, the CV header and
 * the Person JSON-LD. Sources: current Lebenslauf (primary), owner brief.
 * Never publish birth date, phone number or street address here.
 */
export const profile = profileSchema.parse({
  name: NAME,
  role: { en: 'Senior Software Engineer', de: 'Senior-Softwareentwickler' },
  /** One config value; alternatives are logged in DECISIONS.md. */
  positioning: {
    en: 'I turn complex enterprise requirements into fast, secure mobile and web apps.',
    de: 'Ich setze komplexe Unternehmensanforderungen in schnelle, sichere Mobile- und Web-Apps um.',
  },
  summary: {
    en: 'I am a senior software engineer with full-stack depth who has led development projects. My focus is ASP.NET REST APIs, cross-platform .NET MAUI and Xamarin apps, and secure authentication and authorisation with Keycloak (OIDC, OAuth2). I have migrated an existing app to a new platform, made projects more stable, and mentored the development team through code reviews and coaching, always aiming for software that stays maintainable.',
    de: 'Ich bin Senior-Softwareentwickler mit Full-Stack-Erfahrung und habe Entwicklungsprojekte geleitet. Mein Schwerpunkt liegt auf ASP.NET-REST-APIs, plattformübergreifenden Apps mit .NET MAUI und Xamarin sowie sicherer Authentifizierung und Autorisierung mit Keycloak (OIDC, OAuth2). Ich habe eine bestehende App auf eine neue Plattform migriert, die Stabilität von Projekten verbessert und das Entwicklungsteam durch Code-Reviews und Coaching begleitet – mit dem Anspruch, Software hochwertig und wartbar zu halten.',
  },
  cvSummary: {
    en: 'Senior software engineer with full-stack expertise and experience leading development projects. Specialised in ASP.NET REST APIs, cross-platform .NET MAUI and Xamarin apps, and secure authentication and authorisation with Keycloak (OIDC, OAuth2). Track record in platform migration and in improving project stability. Mentors the team through code reviews and coaching. Committed to high-quality, maintainable software.',
    de: 'Erfahrener Senior-Softwareentwickler mit umfassender Expertise in der Full-Stack-Entwicklung und der Leitung von Entwicklungsprojekten. Spezialisiert auf ASP.NET-REST-APIs, plattformübergreifende Apps mit .NET MAUI und Xamarin sowie sichere Authentifizierung und Autorisierung mit Keycloak (OIDC, OAuth2). Erfolgreich in der Migration von Plattformen und der Optimierung der Projektstabilität. Unterstützt das Team als technischer Mentor durch Code-Reviews und Coaching. Engagiert für hochwertige, wartbare Softwarelösungen.',
  },
  location: {
    city: 'Tuttlingen',
    region: 'Baden-Württemberg',
    countryCode: 'DE',
    label: {
      en: 'Tuttlingen, Baden-Württemberg, Germany',
      de: 'Tuttlingen, Baden-Württemberg, Deutschland',
    },
  },
  email: EMAIL,
  links: LINKS,
  yearsOfExperience: { value: '5+', label: { en: '5+ years', de: '5+ Jahre' } },
  coreStack: ['.NET MAUI', 'Xamarin', 'ASP.NET Core', 'Blazor'],
  // Last role ended 12.2025. Kept as data, hidden from the quick-facts card until confirmed.
  availability: { value: null, confirmed: false },
  workMode: { value: null, confirmed: false },
  interests: [
    { en: 'Problem solving', de: 'Problemlösung' },
    { en: 'Reading', de: 'Lesen' },
    { en: 'Video games', de: 'Videospiele' },
    { en: 'Design', de: 'Design' },
  ],
});
