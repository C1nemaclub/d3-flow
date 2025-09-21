import z, { ZodError } from 'zod';

const textSchema = z.string();
const numberSchema = z.number();

const typeValueBase = z.object({
  origin: z.literal('fixed'),
  isList: z.literal(false),
});

const fixedValueSchema = z.discriminatedUnion('type', [
  typeValueBase.extend({
    value: textSchema,
    type: z.literal('text'),
  }),
  typeValueBase.extend({
    value: numberSchema,
    type: z.literal('number'),
  }),
]);

const outputValueSchema = z.object({
  value: z.string(),
  type: z.enum(['text', 'number']),
  origin: z.literal('output'),
  isList: z.literal(false),
});

const fixedOutputUnion = z.union([fixedValueSchema, outputValueSchema]);

const arraySchema = z.object({
  type: z.enum(['text', 'number']),
  origin: z.literal('fixed'),
  isList: z.literal(true),
  value: z.array(fixedOutputUnion),
});

const schema = z.union([arraySchema, fixedOutputUnion]);

try {
  schema.parse({
    type: 'number',
    value: [
      {
        origin: 'fixed',
        value: '123',
        type: 'text',
        isList: false,
      },
      {
        origin: 'fixed',
        value: 123,
        type: 'number',
        isList: false,
      },
      {
        origin: 'output',
        value: '123',
        type: 'number',
        isList: false,
      },
    ],
    origin: 'fixed',
    isList: true,
  });
  console.log('valid');
} catch (e) {
  if (e instanceof ZodError) {
    console.log(e.message);
  }
}
