import Svg, { Path } from 'react-native-svg';

/**
 * The app's one icon set: thin rounded lines on a 24-point grid, the same weight as the tab bar, so buttons,
 * menus and section titles all look like they belong together. Names ending in "Full" are the filled version.
 */
const PATHS = {
  book: 'M4 5.5C4 4.7 4.7 4 5.5 4H10c1.1 0 2 .9 2 2v13c0-.8-.7-1.5-1.5-1.5H4zM20 5.5c0-.8-.7-1.5-1.5-1.5H14c-1.1 0-2 .9-2 2v13c0-.8.7-1.5 1.5-1.5H20z',
  books: 'M4 4h4v16H4zM10 4h4v16h-4zM15.5 5.2l3.6-1 3 14.8-3.6.9zM4 8h4M10 8h4',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0012 3z',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z',
  star: 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z',
  bookmark: 'M6.5 4.8A1.8 1.8 0 018.3 3h7.4a1.8 1.8 0 011.8 1.8V21l-5.5-3.6L6.5 21z',
  share: 'M12 15V3M7.5 7.5L12 3l4.5 4.5M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
  pencil: 'M4 20l4-1 10.5-10.5a2.1 2.1 0 00-3-3L5 16l-1 4zM14 7l3 3',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3',
  speaker: 'M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15.5 9a4 4 0 010 6M18 6.5a7.5 7.5 0 010 11',
  stop: 'M7 7h10v10H7z',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z',
  inbox: 'M4 13l2.4-7.2A1.2 1.2 0 017.5 5h9a1.2 1.2 0 011.1.8L20 13v5a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 18zM4 13h4.5l1 2h5l1-2H20',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 017 0v3',
  download: 'M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14',
  gift: 'M4 10h16v4H4zM5.5 14h13v6h-13zM12 10v10M12 10c-1.5-3.5-5-4-5-1.5S12 10 12 10zM12 10c1.5-3.5 5-4 5-1.5S12 10 12 10z',
  mic: 'M9 6a3 3 0 016 0v5a3 3 0 01-6 0zM5.5 11a6.5 6.5 0 0013 0M12 17.5V21',
  flame: 'M12 21c-3.6 0-6-2.4-6-5.6 0-3.6 3-5.4 3.6-9.4 2.4 1.4 3.4 3.4 3.2 5.2 1-.6 1.7-1.6 1.9-2.8 2 1.6 3.3 4 3.3 6.6C18 18.6 15.6 21 12 21z',
  bolt: 'M13 3L5 13.5h6L10 21l8-10.5h-6z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  checkCircle: 'M12 3a9 9 0 100 18 9 9 0 000-18zM8 12.3l2.8 2.8L16.2 9.5',
  brain:
    'M12 5.2c-.8-1.3-2.2-1.9-3.6-1.6-1.6.3-2.7 1.7-2.7 3.3-1.4.4-2.3 1.7-2.2 3.1 0 .8.3 1.5.8 2-.6.6-.9 1.4-.8 2.3.1 1.5 1.3 2.7 2.8 2.9.4 1.5 1.8 2.6 3.4 2.5.9 0 1.7-.5 2.3-1.1.6.6 1.4 1.1 2.3 1.1 1.6.1 3-1 3.4-2.5 1.5-.2 2.7-1.4 2.8-2.9.1-.9-.2-1.7-.8-2.3.5-.5.8-1.2.8-2 .1-1.4-.8-2.7-2.2-3.1 0-1.6-1.1-3-2.7-3.3-1.4-.3-2.8.3-3.6 1.6zM12 5.2v14.1',
  columns: 'M3.5 9L12 4l8.5 5zM5.5 9v8.5M10 9v8.5M14 9v8.5M18.5 9v8.5M3.5 20h17',
  sprout: 'M12 21v-9M12 12C12 8 9 5.5 4.5 5.5 4.5 9.5 7.5 12 12 12zM12 14.5c0-3.5 2.6-6 6.5-6 0 3.5-2.6 6-6.5 6z',
  feather: 'M5 19L15 9M7.5 16.5h6.5c3.5-1.5 6-6 6-12.5-6.5 0-11 2.5-12.5 6z',
  globe: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3.5 12h17M12 3c2.4 2.5 3.6 5.5 3.6 9s-1.2 6.5-3.6 9c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3z',
  telescope: 'M4 13.5l11-5.5 2 4-11 5.5zM15 8l3.5-1.7 2 4L17 12M9.5 15.5L7 21M11 15l2.5 6',
  compass: 'M12 3a9 9 0 100 18 9 9 0 000-18zM15.3 8.7l-1.9 4.7-4.7 1.9 1.9-4.7z',
  teddy: 'M8 5a2 2 0 10-2.8 2.8M16 5a2 2 0 112.8 2.8M12 4.5a6 6 0 016 6c0 3.5-2.7 6-6 6s-6-2.5-6-6a6 6 0 016-6zM10 12.5c.6.6 1.3.9 2 .9s1.4-.3 2-.9M9.8 9.5h.1M14.1 9.5h.1M8 16l-1 4.5h10L16 16',
  users: 'M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5M16 4.3a3.5 3.5 0 010 6.4M18 14.8c2 .7 3.2 2.5 3.5 5.2',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM16.2 16.2L20 20',
  plus: 'M12 5v14M5 12h14',
  close: 'M6 6l12 12M18 6L6 18',
  more: 'M6 12h.01M12 12h.01M18 12h.01',
  chevronRight: 'M9.5 6l6 6-6 6',
  chevronLeft: 'M14.5 6l-6 6 6 6',
  list: 'M8.5 6.5H20M8.5 12H20M8.5 17.5H20M4 6.5h.01M4 12h.01M4 17.5h.01',
  sun: 'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2.5v2M12 19.5v2M4.6 4.6L6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4',
  moon: 'M19.5 14.5A8 8 0 019.5 4.5a8 8 0 1010 10z',
  play: 'M7.5 5v14l11.5-7z',
  pause: 'M7 5h3.5v14H7zM13.5 5H17v14h-3.5z',
  skipBack: 'M18 6v12l-8.5-6zM6 6v12',
  skipForward: 'M6 6v12l8.5-6zM18 6v12',
  rotateCcw: 'M4 5v5h5M4.6 14.5A8 8 0 104.4 9.8',
  rotateCw: 'M20 5v5h-5M19.4 14.5A8 8 0 1119.6 9.8',
  timer: 'M12 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM12 10v3.5l2.2 1.4M10 2.5h4',
  chevronDown: 'M6 9.5l6 6 6-6',
  arrowDown: 'M12 5v14M6.5 13.5L12 19l5.5-5.5',
  clock: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7.5V12l3 2',
  headphones: 'M4.5 15v-3a7.5 7.5 0 0115 0v3M4.5 14.5h3v6h-1.5a1.5 1.5 0 01-1.5-1.5zM19.5 14.5h-3v6h1.5a1.5 1.5 0 001.5-1.5z',
  quote: 'M10 7H6.5A1.5 1.5 0 005 8.5V12h4.5v1c0 1.7-1 3-3 3.5M19 7h-3.5A1.5 1.5 0 0014 8.5V12h4.5v1c0 1.7-1 3-3 3.5',
  article: 'M5 4h14v16H5zM8.5 8h7M8.5 12h7M8.5 16h4',
  video: 'M4 6.5h11v11H4zM15 10.5l5-3v9l-5-3z',
  podcast: 'M12 11a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM12 14v6.5M8 15.5a5 5 0 118 0M5.5 18a8.5 8.5 0 1113 0',
} as const;

export type IconName = keyof typeof PATHS | 'heartFull' | 'starFull' | 'bookmarkFull' | 'playFull' | 'pauseFull';

export function Icon({ name, size = 20, color, strokeWidth = 1.8 }: { name: IconName; size?: number; color: string; strokeWidth?: number }) {
  const full = name.endsWith('Full');
  const base = (full ? name.slice(0, -4) : name) as keyof typeof PATHS;
  // App colours are CSS variables on the web; SVG attributes can't read those, so they go through currentColor.
  const paint = color.startsWith('var(') ? 'currentColor' : color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={paint === 'currentColor' ? ({ color } as object) : undefined} fill={full ? paint : 'none'} stroke={paint} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d={PATHS[base]} />
    </Svg>
  );
}
