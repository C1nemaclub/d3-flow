import z, { ZodError } from 'zod';

const textSchema = z.string().min(1).trim();
const numberSchema = z.number().min(200);

const typeValueBase = z.object({
  origin: z.literal('fixed'),
  isList: z.literal(false),
});

const arrayInternalValueBase = z.object({
  origin: z.literal('fixed'),
  id: z.string(),
});

const createUnionForFixedValues = (base: z.AnyZodObject) => {
  return z.discriminatedUnion('type', [
    base.extend({
      value: textSchema,
      type: z.literal('text'),
    }),
    base.extend({
      value: numberSchema,
      type: z.literal('number'),
    }),
  ]);
};

const fixedValueSchema = createUnionForFixedValues(typeValueBase);
const arrayIntervalValuesFixedValueSchema = createUnionForFixedValues(
  arrayInternalValueBase
);

const outputValueSchema = z.object({
  value: z.string().min(1).trim(),
  type: z.enum(['text', 'number']),
  origin: z.literal('output'),
  isList: z.boolean(),
});

const outputValueSchemaArray = z.object({
  value: z.string(),
  type: z.enum(['text', 'number']),
  origin: z.literal('output'),
  id: z.string(),
});

const fixedOutputUnion = z.union([fixedValueSchema, outputValueSchema]);
const arrayFixedOutputUnion = z.union([
  arrayIntervalValuesFixedValueSchema,
  outputValueSchemaArray,
]);

const arraySchema = z.object({
  type: z.enum(['text', 'number']),
  origin: z.literal('fixed'),
  isList: z.literal(true),
  value: z.array(arrayFixedOutputUnion),
});

const schema = z.union([arraySchema, fixedOutputUnion]);

try {
  schema.parse({
    // value: [
    //   {
    //     origin: 'fixed',
    //     value: '123',
    //     type: 'text',
    //     id: '1',
    //   },
    //   {
    //     origin: 'fixed',
    //     value: 123,
    //     type: 'number',
    //     id: '2',
    //   },
    //   {
    //     origin: 'output',
    //     value: '123',
    //     type: 'number',
    //     id: '3',
    //   },
    // ],
    value: null,
    type: 'number',
    origin: 'fixed',
    isList: false,
  });
  console.log('valid');
} catch (e) {
  if (e instanceof ZodError) {
    console.log(e.message);
  }
}
