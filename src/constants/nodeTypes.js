/** Typy ośrodków na mapie intrygi */
export const NODE_TYPES = {
  hero: {
    id: 'hero',
    label: 'Bohaterowie graczy',
    icon: '⚔️',
    color: '#c9a227',
  },
  event: {
    id: 'event',
    label: 'Wydarzenia',
    icon: '📜',
    color: '#8b4513',
  },
  place: {
    id: 'place',
    label: 'Miejsca',
    icon: '🏰',
    color: '#2d5016',
  },
  item: {
    id: 'item',
    label: 'Przedmioty',
    icon: '🗝️',
    color: '#5c4033',
  },
  leader: {
    id: 'leader',
    label: 'Przywódcy',
    icon: '👑',
    color: '#8b0000',
  },
  monster: {
    id: 'monster',
    label: 'Potwory',
    icon: '🐉',
    color: '#4a1942',
  },
  organization: {
    id: 'organization',
    label: 'Organizacje',
    icon: '🏛️',
    color: '#1e3a5f',
  },
  group: {
    id: 'group',
    label: 'Grupy',
    icon: '👥',
    color: '#3d5c3d',
  },
  contract: {
    id: 'contract',
    label: 'Kontrakty',
    icon: '📋',
    color: '#5c4a2e',
  },
};

export const NODE_TYPE_OPTIONS = Object.entries(NODE_TYPES).map(([key, val]) => ({
  value: key,
  ...val,
}));
