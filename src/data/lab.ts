import { z } from 'astro/zod';
import { archiveProjectSchema, robotModuleSchema } from '../schemas/data.ts';

/**
 * Lab content (classic version). Source: the old site (medlkhl.github.io, "Projects").
 * Videos are linked out, never embedded (no third-party requests, brief §11).
 */

/** The featured robot demo video from the old site. */
export const ROBOT_DEMO_VIDEO = 'https://www.youtube.com/watch?v=uJDjwlhpj1g';

export const robotModules = z.array(robotModuleSchema).parse([
  {
    id: 'head-tracking',
    title: { en: 'Head tracking', de: 'Kopf-Tracking' },
    description: {
      en: 'OpenCV and Python detect a person’s head and track its position, so the robot can follow it accurately.',
      de: 'OpenCV und Python erkennen den Kopf einer Person und verfolgen seine Position, damit der Roboter ihm präzise folgt.',
    },
    stack: ['Python', 'OpenCV'],
    video: 'https://youtu.be/Tbja_HpTQHE',
  },
  {
    id: 'teleoperation',
    title: { en: 'Hand-imitation teleoperation', de: 'Teleoperation durch Handnachahmung' },
    description: {
      en: 'Kinect skeletal tracking and inverse kinematics carry the operator’s hand motions over to the robot’s hands.',
      de: 'Kinect-Skeletttracking und inverse Kinematik übertragen die Handbewegungen des Bedieners auf die Hände des Roboters.',
    },
    stack: ['Kinect', 'Skeletal tracking', 'Inverse kinematics'],
    video: 'https://youtu.be/_JGYox5_IY8',
  },
  {
    id: 'vr-head',
    title: { en: 'VR-driven head movement', de: 'VR-gesteuerte Kopfbewegung' },
    description: {
      en: 'Simulates human head movement on the robot from a virtual-reality headset, to operate it remotely at a distant event.',
      de: 'Überträgt menschliche Kopfbewegungen per VR-Headset auf den Roboter, um ihn bei einer entfernten Veranstaltung fernzusteuern.',
    },
    stack: ['Virtual reality', 'Remote operation'],
    video: ROBOT_DEMO_VIDEO,
  },
  {
    id: 'speech',
    title: { en: 'Speech interaction', de: 'Sprachinteraktion' },
    description: {
      en: 'Speech recognition with hotword detection, so people can talk to the robot.',
      de: 'Spracherkennung mit Hotword-Erkennung, damit Menschen mit dem Roboter sprechen können.',
    },
    stack: ['Speech recognition', 'Hotword detection'],
    video: 'https://youtu.be/j74jeWoHeEo',
  },
  {
    id: 'motion-control',
    title: { en: 'Upper-body motion control', de: 'Bewegungssteuerung des Oberkörpers' },
    description: {
      en: 'A motion-control interface for the robot’s upper body.',
      de: 'Eine Steuerungsoberfläche für die Bewegungen des Oberkörpers.',
    },
    stack: ['Motion control'],
    video: 'https://youtu.be/0VcOwU8_J2A',
  },
  {
    id: 'remote-app',
    title: { en: 'Remote-control desktop app', de: 'Desktop-App zur Fernsteuerung' },
    description: {
      en: 'A .NET desktop application that controls the robot over the internet through Firebase.',
      de: 'Eine .NET-Desktopanwendung, die den Roboter über das Internet mit Firebase steuert.',
    },
    stack: ['.NET', 'Firebase'],
  },
]);

/** Optional short archive of student projects (kept off every other page). */
export const studentArchive = z.array(archiveProjectSchema).parse([
  {
    id: 'project-management',
    title: { en: 'Project-management web app', de: 'Web-App für Projektmanagement' },
    description: {
      en: 'An ASP.NET application with a three-tier architecture.',
      de: 'Eine ASP.NET-Anwendung mit Drei-Schichten-Architektur.',
    },
    stack: ['ASP.NET'],
    video: 'https://youtu.be/QogNWMk4p6s',
  },
  {
    id: 'baby-care',
    title: { en: 'Baby-care device and app', de: 'Babypflege-Gerät mit App' },
    description: {
      en: 'Concept, design and prototype of a smart device and companion mobile app that keep the family informed about a baby’s health.',
      de: 'Konzept, Design und Prototyp eines smarten Geräts mit Mobile-App, das die Familie über die Gesundheit des Babys informiert.',
    },
    stack: ['Embedded', 'Mobile'],
  },
  {
    id: 'omniwheel',
    title: { en: 'OmniWheel shopping robot', de: 'OmniWheel-Einkaufsroboter' },
    description: {
      en: 'Study project: a basket robot that follows the customer, reads its contents over RFID and recommends products.',
      de: 'Studienprojekt: ein Korb-Roboter, der Kundinnen und Kunden folgt, den Inhalt per RFID erkennt und Produkte empfiehlt.',
    },
    stack: ['Robotics', 'RFID', 'Sensors'],
  },
  {
    id: 'smart-thief',
    title: { en: 'Smart Thief', de: 'Smart Thief' },
    description: {
      en: 'An educational game built around dynamic programming.',
      de: 'Ein Lernspiel rund um dynamische Programmierung.',
    },
    stack: ['Web'],
  },
  {
    id: 'ishried',
    title: { en: 'IShried', de: 'IShried' },
    description: {
      en: 'A rhythm game inspired by osu!.',
      de: 'Ein Rhythmusspiel nach dem Vorbild von osu!.',
    },
    stack: ['Web'],
  },
]);
