export interface FeedbackItemConfig {
  code: string;
  label: string;
  thresholds: {
    high: number;
    medium: number;
  };
  labels: {
    high: string;
    medium: string;
    low: string;
  };
}

export const FEEDBACK_ITEM_CONFIGS: FeedbackItemConfig[] = [
  {
    code: 'm-activity',
    label: 'Aktivnost na sastanku',
    thresholds: { high: 3, medium: 2 },
    labels: { high: 'Visoka', medium: 'Umerena', low: 'Niska' }
  },
  {
    code: 'm-knowledge',
    label: 'Razumevanje materije',
    thresholds: { high: 2.2, medium: 1.5 },
    labels: { high: 'Visoko', medium: 'Umereno', low: 'Nisko' }
  },
  {
    code: 'm-communication',
    label: 'Sposobnost komunikacije',
    thresholds: { high: 2.2, medium: 1.5 },
    labels: { high: 'Visoka', medium: 'Umerena', low: 'Niska' }
  },
  {
    code: 'm-teamwork',
    label: 'Timski duh',
    thresholds: { high: 3, medium: 2 },
    labels: { high: 'Visok', medium: 'Umeren', low: 'Nizak' }
  },
  {
    code: 'm-emotion',
    label: 'Podnošenje stresa',
    thresholds: { high: 3, medium: 2 },
    labels: { high: 'Visoko', medium: 'Umereno', low: 'Nisko' }
  },
  {
    code: 'm-motivation',
    label: 'Interesovanje za struku',
    thresholds: { high: 2.2, medium: 1.5 },
    labels: { high: 'Visoko', medium: 'Umereno', low: 'Nisko' }
  },
  {
    code: 't-learning',
    label: 'Kvalitet učenja',
    thresholds: { high: 2.2, medium: 1.5 },
    labels: { high: 'Visok', medium: 'Umeren', low: 'Nizak' }
  },
  {
    code: 't-effort',
    label: 'Trud tokom školovanja',
    thresholds: { high: 2.2, medium: 1.5 },
    labels: { high: 'Visok', medium: 'Umeren', low: 'Nizak' }
  },
  {
    code: 't-tasks',
    label: 'Kvaliteta softvera',
    thresholds: { high: 3, medium: 2 },
    labels: { high: 'Visok', medium: 'Umeren', low: 'Nizak' }
  }
];

export const GROUP_TITLES = [
  'Utisak pri početku',
  'Utisak na sredini',
  'Utisak u završnici'
];
