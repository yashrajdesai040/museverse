import { z } from 'zod';

export const EntityCategorySchema = z.enum([
  'Fossil',
  'Artifact',
  'Antiquity',
  'Relic',
  'Coin',
  'Statue',
]);

export const ConditionSchema = z.enum(['Excellent', 'Good', 'Fair', 'Fragmentary']);
export const AuthenticitySchema = z.enum(['Authentic', 'Replica']);

export const BaseEntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  category: EntityCategorySchema,
  periodLabel: z.string(),
  yearsAgo: z.number(),
  currentLocation: z.string(),
  significance: z.string(),
  images: z.array(z.string()),
  references: z.array(z.string()),
  modelUrl: z.string().optional(),
  material: z.string().optional(),
  dimensions: z.string().optional(),
  condition: ConditionSchema.optional(),
  authenticity: AuthenticitySchema.optional(),
  provenance: z.string().optional(),

  // Award-level v2 schema fields
  hook: z.string().optional(),
  story: z.string().optional(),
  facts: z.array(z.string()).optional(),
  whyItMatters: z.string().optional(),
  stageIds: z.array(z.enum([
    '01-hadean-archean',
    '02-proterozoic',
    '03-paleozoic',
    '04-mesozoic',
    '05-cenozoic'
  ])).optional(),
  ageMa: z.number().optional(),
  model: z.string().optional(),
  image: z.string().optional(),
  source: z.string().optional(),
  license: z.string().optional(),
});

export const CulturalArtifactSchema = BaseEntitySchema.extend({
  type: z.enum(['cultural', 'artifact']),
  creator: z.string().optional(),
  origin: z.string().optional(),
  commissionedBy: z.string().optional(),
  originalOwner: z.string().optional(),
  discoverer: z.string().optional(),
  discoveryDate: z.string().optional(),
  placeOfDiscovery: z.string().optional(),
});

export const FossilSpecimenSchema = BaseEntitySchema.extend({
  type: z.literal('fossil'),
  ageMa: z.number().optional(),
  species: z.string(),
  geologicalPeriod: z.string(),
  excavatedBy: z.string().optional(),
  discoveryDate: z.string().optional(),
  placeOfDiscovery: z.string().optional(),
});

export const MuseumEntitySchema = z.discriminatedUnion('type', [
  CulturalArtifactSchema,
  FossilSpecimenSchema,
]);

export function validateEntities(data: unknown[]) {
  const result = z.array(MuseumEntitySchema).safeParse(data);
  if (!result.success) {
    console.error('Entity validation error:', result.error.format());
    throw new Error('Malformed entity data detected! See console for details.');
  }
  return result.data;
}
