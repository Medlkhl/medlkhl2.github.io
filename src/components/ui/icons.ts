/** Paths for the inline SVG icon set (24×24 grid, drawn as 1.5px strokes). */
export type IconName =
  | 'arrow-right'
  | 'arrow-up-right'
  | 'arrow-down'
  | 'download'
  | 'copy'
  | 'check'
  | 'mail'
  | 'sun'
  | 'moon'
  | 'menu'
  | 'close'
  | 'pin'
  | 'play';

export const ICON_PATHS: Record<IconName, string> = {
  'arrow-right': 'M4 12h15M13 6l6 6-6 6',
  'arrow-up-right': 'M7 17L17 7M8 7h9v9',
  'arrow-down': 'M12 4v15M6 13l6 6 6-6',
  download: 'M12 4v11M7 10l5 5 5-5M5 19h14',
  copy: 'M9 9h10v10H9zM5 15V5h10',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8L6 18M18 6l1.8-1.8',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  pin: 'M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21zM12 7.5a2.3 2.3 0 1 0 0 4.6 2.3 2.3 0 0 0 0-4.6z',
  play: 'M8 5.5v13l10.5-6.5z',
};
