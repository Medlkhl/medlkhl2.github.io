import { defineCopy } from '../../i18n/copy.ts';
import type { LegalPageCopy } from '../impressum/legal.ts';

/**
 * Datenschutzerklärung (brief §11). It describes what the site really does:
 * GitHub Pages hosting and its server logs, contact by email, no cookies, no
 * analytics, no third-party requests, local storage only for the visitor's own
 * theme and language choice, and plain external links. The spatial-view
 * section is written already and stays hidden until LEGAL_FEATURES.spatialView
 * is switched on (src/views/impressum/legal.ts).
 *
 * The German text is binding. Orientation, not legal advice: the owner has it
 * checked before launch (OPEN_QUESTIONS.md). Facts about GitHub and Google are
 * their own statements and are listed for the owner to verify.
 */
const GITHUB_PRIVACY =
  'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement';
const GOOGLE_PRIVACY = 'https://policies.google.com/privacy';
const LFDI_BW = 'https://www.baden-wuerttemberg.datenschutz.de/';

export const datenschutzCopy = defineCopy<LegalPageCopy>({
  en: {
    title: 'Privacy policy',
    lede: 'This website is built to collect as little as possible: no cookies, no analytics, no tracking and no content from third parties.',
    sections: [
      {
        id: 'controller',
        title: 'Controller',
        blocks: [
          {
            type: 'p',
            text: 'The controller responsible for processing personal data on this website under the General Data Protection Regulation (GDPR) is:',
          },
          { type: 'address' },
          { type: 'email' },
        ],
      },
      {
        id: 'at-a-glance',
        title: 'At a glance',
        blocks: [
          {
            type: 'list',
            items: [
              'No cookies, no analytics, no tracking and no advertising.',
              'Fonts and all other files come from this website itself; nothing is loaded from third parties.',
              'GitHub, the host, processes technical access data (server logs) to deliver the pages.',
              'If you email me, I use your message only to reply to you.',
              'Your choice of theme and language stays in your own browser.',
            ],
          },
        ],
      },
      {
        id: 'hosting',
        title: 'Hosting on GitHub Pages',
        blocks: [
          {
            type: 'p',
            text: 'This website is hosted on GitHub Pages, a service of GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA (“GitHub”). When you open a page, GitHub processes the data your browser sends in order to deliver the page, and records it in server log files:',
          },
          {
            type: 'list',
            items: [
              'your IP address',
              'the date and time of the request',
              'the requested page (URL)',
              'the referrer, that is the page you came from',
              'your user agent (browser and operating system)',
            ],
          },
          {
            type: 'p',
            text: 'This processing is necessary to deliver the website and to keep it secure and stable. The legal basis is Art. 6(1)(f) GDPR; my legitimate interest is a secure and reliably available website.',
          },
          {
            type: 'p',
            text: 'GitHub is based in the USA. GitHub states that it participates in the EU-U.S. Data Privacy Framework, for which the European Commission has adopted an adequacy decision (Art. 45 GDPR). GitHub decides how long the log data is kept.',
          },
          { type: 'link', label: 'GitHub General Privacy Statement', href: GITHUB_PRIVACY },
        ],
      },
      {
        id: 'email',
        title: 'Contact by email',
        blocks: [
          {
            type: 'p',
            text: 'If you email me, I process your email address, your name if you give it, and the content of your message in order to reply. If your enquiry concerns a contract or steps towards one, such as a job offer or a project, the legal basis is Art. 6(1)(b) GDPR; otherwise it is Art. 6(1)(f) GDPR, my legitimate interest in answering enquiries.',
          },
          {
            type: 'p',
            text: 'I delete your message as soon as it is no longer needed for this purpose, unless a statutory retention period applies.',
          },
          {
            type: 'p',
            text: 'My mailbox is provided by Google (Gmail), so your message is also processed on Google’s servers.',
          },
          { type: 'link', label: 'Google Privacy Policy', href: GOOGLE_PRIVACY },
        ],
      },
      {
        id: 'cookies',
        title: 'No cookies, no analytics',
        blocks: [
          {
            type: 'p',
            text: 'This website sets no cookies and uses no analytics, tracking or advertising services. It embeds no content from other providers, such as videos or maps: videos open on YouTube only when you follow a link.',
          },
        ],
      },
      {
        id: 'local-storage',
        title: 'Your settings in local storage',
        blocks: [
          {
            type: 'p',
            text: 'When you switch the colour theme or the language, your browser saves that choice in its local storage, so it is still there on your next visit. Only these settings are stored, for example “pref:theme” with the value “paper”.',
          },
          {
            type: 'p',
            text: 'They are written only when you use the switch, stay on your device and are never transmitted to me or anyone else. This storage is strictly necessary for the function you asked for (§ 25(2) no. 2 TDDDG). You can delete it at any time in your browser settings.',
          },
        ],
      },
      {
        id: 'external-links',
        title: 'Links to other websites',
        blocks: [
          {
            type: 'p',
            text: 'This website links to other services, such as LinkedIn, GitHub and YouTube. These are plain links: nothing from these services is embedded, and no data is transferred to them unless you click a link. After that, the privacy policy of the provider in question applies.',
          },
        ],
      },
      {
        id: 'spatial-view',
        title: 'Spatial view (camera)',
        requires: 'spatialView',
        blocks: [
          {
            type: 'p',
            text: 'The spatial view in the Lab is optional. It starts only when you switch it on with a click, and your browser asks for permission to use the camera first.',
          },
          {
            type: 'p',
            text: 'It uses your camera to estimate the position of your head and adjusts the perspective of the drawing. The camera images are processed only in your browser: they are never stored and never sent to me or anyone else. One click stops the camera.',
          },
        ],
      },
      {
        id: 'your-rights',
        title: 'Your rights',
        blocks: [
          {
            type: 'p',
            text: 'Under Articles 15 to 21 GDPR you have the right of access, rectification, erasure, restriction of processing and data portability, and the right to object to processing based on Art. 6(1)(f) GDPR. An email to me is enough to exercise them.',
          },
          {
            type: 'p',
            text: 'You also have the right to lodge a complaint with a data protection supervisory authority (Art. 77 GDPR). The authority responsible for me is the State Commissioner for Data Protection and Freedom of Information of Baden-Württemberg (LfDI).',
          },
          { type: 'link', label: 'LfDI Baden-Württemberg', href: LFDI_BW },
        ],
      },
      {
        id: 'changes',
        title: 'Changes to this policy',
        blocks: [
          {
            type: 'p',
            text: 'I update this policy whenever the website or the law changes.',
          },
          { type: 'version' },
        ],
      },
    ],
  },
  de: {
    // The soft hyphen (U+00AD) breaks the long compound correctly on narrow screens.
    title: 'Datenschutz\u00aderklärung',
    lede: 'Diese Website ist so gebaut, dass möglichst wenige Daten anfallen: keine Cookies, keine Analyse, kein Tracking und keine Inhalte von Drittanbietern.',
    sections: [
      {
        id: 'verantwortlicher',
        title: 'Verantwortlicher',
        blocks: [
          {
            type: 'p',
            text: 'Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:',
          },
          { type: 'address' },
          { type: 'email' },
        ],
      },
      {
        id: 'ueberblick',
        title: 'Das Wichtigste in Kürze',
        blocks: [
          {
            type: 'list',
            items: [
              'Keine Cookies, keine Analyse, kein Tracking und keine Werbung.',
              'Schriften und alle übrigen Dateien liefert diese Website selbst aus; es werden keine Inhalte Dritter geladen.',
              'GitHub verarbeitet als Hoster technische Zugriffsdaten (Server-Logs), um die Seiten auszuliefern.',
              'Wenn Sie mir schreiben, nutze ich Ihre Nachricht nur, um Ihnen zu antworten.',
              'Ihre Wahl von Farbschema und Sprache bleibt in Ihrem eigenen Browser.',
            ],
          },
        ],
      },
      {
        id: 'hosting',
        title: 'Hosting bei GitHub Pages',
        blocks: [
          {
            type: 'p',
            text: 'Diese Website wird bei GitHub Pages gehostet, einem Dienst der GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA („GitHub“). Wenn Sie eine Seite aufrufen, verarbeitet GitHub die Daten, die Ihr Browser dabei übermittelt, um die Seite auszuliefern, und speichert sie in Server-Logdateien:',
          },
          {
            type: 'list',
            items: [
              'Ihre IP-Adresse',
              'Datum und Uhrzeit des Zugriffs',
              'die aufgerufene Seite (URL)',
              'den Referrer, also die Seite, von der Sie kommen',
              'den User-Agent (Browser und Betriebssystem)',
            ],
          },
          {
            type: 'p',
            text: 'Diese Verarbeitung ist erforderlich, um die Website auszuliefern und ihre Sicherheit und Stabilität zu gewährleisten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; mein berechtigtes Interesse liegt in einer sicheren und zuverlässig erreichbaren Website.',
          },
          {
            type: 'p',
            text: 'GitHub hat seinen Sitz in den USA. Nach eigenen Angaben nimmt GitHub am EU-U.S. Data Privacy Framework teil, für das die Europäische Kommission einen Angemessenheitsbeschluss erlassen hat (Art. 45 DSGVO). Wie lange die Logdaten gespeichert werden, legt GitHub fest.',
          },
          {
            type: 'link',
            label: 'Datenschutzerklärung von GitHub (auf Englisch)',
            href: GITHUB_PRIVACY,
          },
        ],
      },
      {
        id: 'e-mail',
        title: 'Kontakt per E-Mail',
        blocks: [
          {
            type: 'p',
            text: 'Wenn Sie mir eine E-Mail schreiben, verarbeite ich Ihre E-Mail-Adresse, Ihren Namen (falls angegeben) und den Inhalt Ihrer Nachricht, um Ihre Anfrage zu beantworten. Zielt Ihre Anfrage auf einen Vertrag oder vorvertragliche Maßnahmen, etwa ein Stellenangebot oder ein Projekt, ist Art. 6 Abs. 1 lit. b DSGVO die Rechtsgrundlage; im Übrigen Art. 6 Abs. 1 lit. f DSGVO, mein berechtigtes Interesse an der Beantwortung von Anfragen.',
          },
          {
            type: 'p',
            text: 'Ich lösche Ihre Nachricht, sobald sie für diesen Zweck nicht mehr erforderlich ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.',
          },
          {
            type: 'p',
            text: 'Mein E-Mail-Postfach stellt Google (Gmail) bereit; Ihre Nachricht wird daher auch auf Servern von Google verarbeitet.',
          },
          { type: 'link', label: 'Datenschutzerklärung von Google', href: GOOGLE_PRIVACY },
        ],
      },
      {
        id: 'cookies',
        title: 'Keine Cookies, keine Analyse',
        blocks: [
          {
            type: 'p',
            text: 'Diese Website setzt keine Cookies und nutzt keine Analyse-, Tracking- oder Werbedienste. Sie bettet keine Inhalte anderer Anbieter ein, etwa Videos oder Karten: Videos öffnen sich erst auf YouTube, wenn Sie einem Link folgen.',
          },
        ],
      },
      {
        id: 'lokaler-speicher',
        title: 'Ihre Einstellungen im lokalen Speicher',
        blocks: [
          {
            type: 'p',
            text: 'Wenn Sie das Farbschema oder die Sprache umschalten, speichert Ihr Browser diese Wahl in seinem lokalen Speicher (Local Storage), damit sie beim nächsten Besuch erhalten bleibt. Gespeichert werden nur diese Einstellungen, zum Beispiel „pref:theme“ mit dem Wert „paper“.',
          },
          {
            type: 'p',
            text: 'Sie werden erst geschrieben, wenn Sie den jeweiligen Schalter benutzen, bleiben auf Ihrem Gerät und werden weder an mich noch an Dritte übertragen. Diese Speicherung ist für die von Ihnen gewünschte Funktion unbedingt erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG). Sie können die Einträge jederzeit in den Einstellungen Ihres Browsers löschen.',
          },
        ],
      },
      {
        id: 'externe-links',
        title: 'Links auf andere Websites',
        blocks: [
          {
            type: 'p',
            text: 'Diese Website verlinkt auf andere Dienste wie LinkedIn, GitHub und YouTube. Es sind einfache Links: Von diesen Diensten wird nichts eingebettet, und es werden keine Daten an sie übertragen, solange Sie keinen Link anklicken. Danach gilt die Datenschutzerklärung des jeweiligen Anbieters.',
          },
        ],
      },
      {
        id: 'raeumliche-ansicht',
        title: 'Räumliche Ansicht (Kamera)',
        requires: 'spatialView',
        blocks: [
          {
            type: 'p',
            text: 'Die räumliche Ansicht im Lab ist freiwillig. Sie startet erst, wenn Sie sie per Klick einschalten, und Ihr Browser fragt vorher um Erlaubnis für die Kamera.',
          },
          {
            type: 'p',
            text: 'Sie nutzt Ihre Kamera, um die Position Ihres Kopfes zu schätzen, und passt die Perspektive der Zeichnung daran an. Die Kamerabilder werden ausschließlich in Ihrem Browser verarbeitet: Sie werden weder gespeichert noch an mich oder Dritte übertragen. Ein Klick beendet die Kamera.',
          },
        ],
      },
      {
        id: 'ihre-rechte',
        title: 'Ihre Rechte',
        blocks: [
          {
            type: 'p',
            text: 'Nach Art. 15 bis 21 DSGVO haben Sie das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit sowie das Recht, einer Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO zu widersprechen. Dafür genügt eine E-Mail an mich.',
          },
          {
            type: 'p',
            text: 'Außerdem können Sie sich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO). Für mich zuständig ist der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg (LfDI).',
          },
          { type: 'link', label: 'LfDI Baden-Württemberg', href: LFDI_BW },
        ],
      },
      {
        id: 'aenderungen',
        title: 'Änderungen dieser Erklärung',
        blocks: [
          {
            type: 'p',
            text: 'Ich passe diese Datenschutzerklärung an, sobald sich die Website oder die Rechtslage ändert.',
          },
          { type: 'version' },
        ],
      },
    ],
  },
});
