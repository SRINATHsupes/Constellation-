export type BackgroundStyle =
  | 'cosmic'
  | 'ocean'
  | 'forest'
  | 'sunset'
  | 'midnight';

export type RoomCustomization = {
  background: string;
  secondaryBackground: string;
  accent: string;
  backgroundStyle: BackgroundStyle;
  objectSet: string;
  musicEnabled: boolean;
};

export const DEFAULT_CUSTOMIZATION: RoomCustomization = {
  background: '#070B2A',
  secondaryBackground: '#32105E',
  accent: '#BFA2FF',
  backgroundStyle: 'cosmic',
  objectSet: 'default',
  musicEnabled: false,
};

export const CUSTOMIZATION_PRESETS: Record<
  BackgroundStyle,
  RoomCustomization
> = {
  cosmic: {
    background: '#070B2A',
    secondaryBackground: '#32105E',
    accent: '#BFA2FF',
    backgroundStyle: 'cosmic',
    objectSet: 'cosmic',
    musicEnabled: false,
  },

  ocean: {
    background: '#031B2E',
    secondaryBackground: '#075B78',
    accent: '#62E8FF',
    backgroundStyle: 'ocean',
    objectSet: 'ocean',
    musicEnabled: false,
  },

  forest: {
    background: '#031812',
    secondaryBackground: '#096048',
    accent: '#9EF2B5',
    backgroundStyle: 'forest',
    objectSet: 'forest',
    musicEnabled: false,
  },

  sunset: {
    background: '#2A1020',
    secondaryBackground: '#8A3D42',
    accent: '#FFD166',
    backgroundStyle: 'sunset',
    objectSet: 'sunset',
    musicEnabled: false,
  },

  midnight: {
    background: '#05050D',
    secondaryBackground: '#25204A',
    accent: '#C8B6FF',
    backgroundStyle: 'midnight',
    objectSet: 'midnight',
    musicEnabled: false,
  },
};
