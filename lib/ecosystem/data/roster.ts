/**
 * The certified women of Maltiti A. Enterprise Ltd.
 *
 * Authored here, and owned here. This repository is the source of truth for this
 * dataset — there is no sync from anywhere else, and nothing overwrites it.
 *
 * Transcribed from the company roster "Maltiti Total certified women"
 * (`.ai/context/map.jpeg`). Every subtotal and total on this page is **derived**
 * from `CENTRES` below rather than copied from that sheet, so the figures shown
 * can never drift from the rows they summarise. The sheet's own arithmetic was
 * checked against the derived values when this was written and agreed exactly:
 * 80 · 340 · 470 · 1,136 · 646 · 1,782 · 2,252.
 *
 * One correction to the source: Gizaa N-nabya is written `MPo3` there, with a
 * letter o where every sibling code uses a zero. Recorded as `MP03`.
 */

/** Whether a centre's Fairtrade certification is organic or conventional. */
export type Certification = 'organic' | 'conventional' | 'none';

/** What a centre does, which is also how the roster groups them. */
export type CentreRole = 'head-office' | 'processing-centre' | 'collector-community';

export interface Centre {
  readonly id: string;
  readonly name: string;
  readonly activity: string;
  /**
   * The code on the roster. `MP01`–`MP08` identify one centre each; `MCFC` and
   * `MOFC` are shared category codes — conventional and organic Fairtrade
   * collectors — so they repeat down the collector rows and are not identifiers.
   */
  readonly code: string;
  readonly people: number;
  readonly role: CentreRole;
  readonly certification: Certification;
}

export const CENTRES: readonly Centre[] = [
  {
    id: 'head-office',
    name: 'Maltiti head office',
    activity:
      'Aggregation, soap production, handling and packaging of products, administrative works',
    code: 'MP06',
    people: 50,
    role: 'head-office',
    certification: 'none',
  },

  // Processing centres — organic
  {
    id: 'gumo-gubdanda',
    name: 'Gumo Gubdanda shea butter processing centre',
    activity: 'Both organic and Fairtrade producers',
    code: 'MP04',
    people: 66,
    role: 'processing-centre',
    certification: 'organic',
  },
  {
    id: 'katariga-timtooni',
    name: 'Katariga Timtooni shea butter processing centre',
    activity: 'Both organic and Fairtrade producers',
    code: 'MP05',
    people: 14,
    role: 'processing-centre',
    certification: 'organic',
  },

  // Processing centres — conventional
  {
    id: 'chanzegu-behaguvela',
    name: 'Chanzegu Behaguvela shea butter processing centre',
    activity: 'Conventional Fairtrade producer',
    code: 'MP01',
    people: 94,
    role: 'processing-centre',
    certification: 'conventional',
  },
  {
    id: 'dulizugu-gubkatimal',
    name: 'Dulizugu Gubkatimal shea butter processing centre',
    activity: 'Conventional Fairtrade producer',
    code: 'MP02',
    people: 76,
    role: 'processing-centre',
    certification: 'conventional',
  },
  {
    id: 'gizaa-n-nabya',
    name: 'Gizaa N-nabya shea butter processing centre',
    activity: 'Conventional Fairtrade producer',
    code: 'MP03',
    people: 69,
    role: 'processing-centre',
    certification: 'conventional',
  },
  {
    id: 'salamba-maltiti',
    name: 'Salamba Maltiti shea butter processing centre',
    activity: 'Conventional Fairtrade producer',
    code: 'MP07',
    people: 39,
    role: 'processing-centre',
    certification: 'conventional',
  },
  {
    id: 'zugu-suglo-n-boribuni',
    name: 'Zugu Suglo N-boribuni shea butter processing centre',
    activity: 'Conventional Fairtrade producer',
    code: 'MP08',
    people: 62,
    role: 'processing-centre',
    certification: 'conventional',
  },

  // Collector communities — conventional
  {
    id: 'gburimani',
    name: 'Gburimani',
    activity: 'Conventional Fairtrade collectors',
    code: 'MCFC',
    people: 341,
    role: 'collector-community',
    certification: 'conventional',
  },
  {
    id: 'gburimani-tibogu',
    name: 'Gburimani Tibogu',
    activity: 'Conventional Fairtrade collectors',
    code: 'MCFC',
    people: 194,
    role: 'collector-community',
    certification: 'conventional',
  },
  {
    id: 'kpendua-nyobaliga',
    name: 'Kpendua and Nyobaliga',
    activity: 'Conventional Fairtrade collectors',
    code: 'MCFC',
    people: 445,
    role: 'collector-community',
    certification: 'conventional',
  },
  {
    id: 'nagbiligu',
    name: 'Nagbiligu',
    activity: 'Conventional Fairtrade collectors',
    code: 'MCFC',
    people: 156,
    role: 'collector-community',
    certification: 'conventional',
  },

  // Collector communities — organic
  {
    id: 'buiyili',
    name: 'Buiyili',
    activity: 'Organic Fairtrade collectors',
    code: 'MOFC',
    people: 98,
    role: 'collector-community',
    certification: 'organic',
  },
  {
    id: 'kagbal',
    name: 'Kagbal',
    activity: 'Organic Fairtrade collectors',
    code: 'MOFC',
    people: 144,
    role: 'collector-community',
    certification: 'organic',
  },
  {
    id: 'kpachiyili',
    name: 'Kpachiyili',
    activity: 'Organic Fairtrade collectors',
    code: 'MOFC',
    people: 158,
    role: 'collector-community',
    certification: 'organic',
  },
  {
    id: 'sinsina',
    name: 'Sinsina',
    activity: 'Organic Fairtrade collectors',
    code: 'MOFC',
    people: 60,
    role: 'collector-community',
    certification: 'organic',
  },
  {
    id: 'tibogunaayili',
    name: 'Tibogunaayili',
    activity: 'Organic Fairtrade collectors',
    code: 'MOFC',
    people: 145,
    role: 'collector-community',
    certification: 'organic',
  },
  {
    id: 'tiduriyili',
    name: 'Tiduriyili',
    activity: 'Organic Fairtrade collectors',
    code: 'MOFC',
    people: 41,
    role: 'collector-community',
    certification: 'organic',
  },
];

const sum = (centres: readonly Centre[]): number =>
  centres.reduce((total, centre) => total + centre.people, 0);

const where = (predicate: (centre: Centre) => boolean): readonly Centre[] =>
  CENTRES.filter(predicate);

export const processingCentres = where((c) => c.role === 'processing-centre');
export const collectorCommunities = where((c) => c.role === 'collector-community');
export const headOffice = CENTRES.find((c) => c.role === 'head-office')!;

/**
 * The roll-up, in the shape the roster itself uses.
 *
 * Note that the head office sits in `producersAndWorkers` but in neither
 * producer subtotal — it is administration, soap and packaging rather than a
 * certified producer group, and the source sheet counts it exactly this way.
 */
export const TOTALS = {
  organicProducers: sum(
    where((c) => c.role === 'processing-centre' && c.certification === 'organic'),
  ),
  conventionalProducers: sum(
    where((c) => c.role === 'processing-centre' && c.certification === 'conventional'),
  ),
  producersAndWorkers: sum(where((c) => c.role !== 'collector-community')),

  conventionalCollectors: sum(
    where((c) => c.role === 'collector-community' && c.certification === 'conventional'),
  ),
  organicCollectors: sum(
    where((c) => c.role === 'collector-community' && c.certification === 'organic'),
  ),
  collectors: sum(collectorCommunities),

  certifiedWomen: sum(CENTRES),
  centres: CENTRES.length,
} as const;

/** The part-to-whole split of every certified woman, in roster order. */
export interface RosterBand {
  readonly id: string;
  readonly label: string;
  readonly people: number;
  readonly certification: Certification;
}

export const BANDS: readonly RosterBand[] = [
  {
    id: 'conventional-collectors',
    label: 'Conventional collectors',
    people: TOTALS.conventionalCollectors,
    certification: 'conventional',
  },
  {
    id: 'organic-collectors',
    label: 'Organic collectors',
    people: TOTALS.organicCollectors,
    certification: 'organic',
  },
  {
    id: 'conventional-producers',
    label: 'Conventional producers',
    people: TOTALS.conventionalProducers,
    certification: 'conventional',
  },
  {
    id: 'organic-producers',
    label: 'Organic producers',
    people: TOTALS.organicProducers,
    certification: 'organic',
  },
  {
    id: 'head-office',
    label: 'Head office',
    people: headOffice.people,
    certification: 'none',
  },
];

export const CERTIFICATION_LABELS: Record<Certification, string> = {
  conventional: 'Conventional Fairtrade',
  organic: 'Organic Fairtrade',
  none: 'Head office',
};
