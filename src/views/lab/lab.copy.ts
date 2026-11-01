import { defineCopy } from '../../i18n/copy.ts';

/**
 * Copy of the Lab page (/lab/ and /de/lab/). Robot modules, the demo video
 * and the student archive come from src/data/lab.ts; the HoloBox facts are the
 * owner's (same as the case study). Anything not built yet is labelled as planned.
 * Placeholders in braces ({org}, {year}, {title}, {name}) are filled in by the view.
 * The German is written for German readers, not translated line by line.
 */
export const labCopy = defineCopy({
  en: {
    header: {
      label: 'Lab',
      title: 'Prototypes, experiments and an archive',
      intro:
        'A preview of HoloBox, the archive of my humanoid robot with its demo videos, and the experiments that will live here next. Videos open on YouTube; nothing is embedded, so this page loads nothing from third parties.',
    },
    holobox: {
      label: 'Preview',
      title: 'HoloBox',
      paragraphs: [
        'A flat screen shows a conversational 3D avatar as if it stood inside a physical volume, using head-tracked off-axis projection. You speak, a local language model answers, and the avatar replies aloud with lip-sync.',
        'It is a .NET MAUI Blazor Hybrid app with Three.js and MediaPipe in its WebView and a local Gemma model running in-process through LLamaSharp (GGUF), so it works offline with low latency, Windows first.',
      ],
      spatial: {
        title: 'Spatial view',
        text: 'A head-tracked spatial view will demonstrate the same technique on this page: the scene follows your head through the webcam, as if the screen were a window. It is designed to be opt-in: the camera starts only after a click, the video never leaves your device, and mouse or tilt parallax is the fallback.',
      },
    },
    robot: {
      label: 'Archive',
      title: 'The humanoid robot',
      intro:
        'My graduation project at {org} ({year}): the modules that let a humanoid robot sense its environment and act on its own. Most modules link to a demo video on YouTube.',
      demoTitle: 'Main demo video',
      demoText: 'The featured video of the robot, as shown on my earlier portfolio.',
      modulesLabel: 'Modules',
      stackLabel: 'Stack',
      organisation: 'Organisation',
      period: 'Period',
    },
    experiments: {
      label: 'Coming next',
      title: 'Experiments coming',
      intro:
        'Small, self-contained demos planned for this page. None of them is built yet; they are listed so you know what to expect.',
      items: [
        {
          title: 'HoloBox spatial view',
          text: 'The head-tracked view described above: opt-in, and processed entirely on your device.',
        },
        {
          title: 'Small WebGPU experiments',
          text: 'Focused three.js studies on WebGPU, written with TSL node materials and falling back to WebGL 2 where WebGPU is missing.',
        },
        {
          title: 'C# in the browser',
          text: 'A small C# module compiled to WebAssembly: a live .NET demo running right on this page.',
        },
      ],
    },
    archive: {
      label: 'Student archive',
      intro: 'Earlier student projects, kept short.',
    },
  },
  de: {
    header: {
      label: 'Lab',
      title: 'Prototypen, Experimente und ein Archiv',
      intro:
        'Ein Ausblick auf HoloBox, das Archiv meines humanoiden Roboters mit seinen Demovideos und die Experimente, die hier als Nächstes entstehen. Videos öffnen sich auf YouTube; eingebettet ist nichts, die Seite lädt also nichts von Drittanbietern.',
    },
    holobox: {
      label: 'Vorschau',
      title: 'HoloBox',
      paragraphs: [
        'Ein flacher Bildschirm zeigt einen 3D-Avatar, mit dem Sie sprechen können, als stünde er in einem echten Raum hinter dem Glas – möglich macht das eine kopfgekoppelte Off-Axis-Projektion. Sie sprechen, ein lokales Sprachmodell antwortet, und der Avatar spricht die Antwort lippensynchron aus.',
        'Technisch ist HoloBox eine .NET-MAUI-Blazor-Hybrid-App mit Three.js und MediaPipe in der WebView und einem lokalen Gemma-Modell, das über LLamaSharp (GGUF) direkt im App-Prozess läuft – offline, mit geringer Latenz und zuerst für Windows.',
      ],
      spatial: {
        title: 'Räumliche Ansicht',
        text: 'Eine kopfgekoppelte räumliche Ansicht wird dieselbe Technik auf dieser Seite vorführen: Die Szene folgt per Webcam Ihrem Kopf, als wäre der Bildschirm ein Fenster. Sie ist als Opt-in geplant: Die Kamera startet erst nach einem Klick, das Video verlässt Ihr Gerät nie, und ohne Kamera übernimmt eine Parallaxe per Maus oder Neigung.',
      },
    },
    robot: {
      label: 'Archiv',
      title: 'Der humanoide Roboter',
      intro:
        'Mein Abschlussprojekt bei {org} ({year}): die Module, mit denen ein humanoider Roboter seine Umgebung wahrnimmt und selbstständig handelt. Zu den meisten Modulen gibt es ein Demovideo auf YouTube.',
      demoTitle: 'Zentrales Demovideo',
      demoText:
        'Das Hauptvideo des Roboters, wie es schon in meinem früheren Portfolio zu sehen war.',
      modulesLabel: 'Module',
      stackLabel: 'Technologien',
      organisation: 'Organisation',
      period: 'Zeitraum',
    },
    experiments: {
      label: 'Als Nächstes',
      title: 'Kommende Experimente',
      intro:
        'Kleine, in sich geschlossene Demos, die für diese Seite geplant sind. Noch ist keine davon gebaut; die Liste zeigt, was Sie hier erwarten können.',
      items: [
        {
          title: 'Räumliche Ansicht für HoloBox',
          text: 'Die oben beschriebene kopfgekoppelte Ansicht: nur auf Wunsch aktiv und vollständig auf Ihrem Gerät verarbeitet.',
        },
        {
          title: 'Kleine WebGPU-Experimente',
          text: 'Kompakte three.js-Studien auf WebGPU, geschrieben mit TSL-Node-Materialien und mit WebGL 2 als Rückfallebene, wo WebGPU fehlt.',
        },
        {
          title: 'C# im Browser',
          text: 'Ein kleines C#-Modul, nach WebAssembly kompiliert: eine Live-Demo mit .NET direkt auf dieser Seite.',
        },
      ],
    },
    archive: {
      label: 'Studienprojekte',
      intro: 'Frühere Studienprojekte, kurz gehalten.',
    },
  },
});

export type LabCopy = (typeof labCopy)['en'];
