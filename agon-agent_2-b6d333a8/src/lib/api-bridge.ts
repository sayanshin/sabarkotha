// Small bridge so components can import youtube helpers and shared types
// from a single place without touching the API client module.
export { youtubeId, ytThumb, ytEmbed } from './youtube';
export type { Playable } from './api';
