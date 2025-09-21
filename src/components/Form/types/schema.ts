import * as z from 'zod';
import type { ActionInputs } from './types';

const getSchema = (inputs?: ActionInputs) => {
  const baseSchema = z.object({
    type: z.enum(['text', 'number']),
    origin: z.literal('fixed'),
    isList: z.literal(false),
  });

  const itemValueUnion = z.discriminatedUnion('type', [
    baseSchema.extend({
      type: z.literal('text'),
      value: z.string(),
    }),
    baseSchema.extend({
      type: z.literal('number'),
      value: z.number(),
    }),
  ]);

  const outputSchema = z.object({
    type: z.enum(['text', 'number']),
    origin: z.literal('output'),
    value: z.string(),
  });

  const valUnion = z.union([itemValueUnion, outputSchema]);

  const arrayItemSchema = z.object({
    id: z.string(),
    value: z.string(),
    type: z.string(),
    origin: z.string(),
  });

  const smh = z.union([
    valUnion,
    z.object({
      isList: z.literal(true),
      type: z.string(),
      // value: z.array(arrayItemSchema),
      value: z.array(itemValueUnion),
      origin: z.string(),
    }),
  ]);

  const schema = z.discriminatedUnion('isList', [
    // z.object({
    //   isList: z.literal(false),
    //   type: z.enum(['text', 'number']),
    //   value: itemValueUnion,
    //   origin: z.literal('fixed'),
    // }),
    z.object({
      isList: z.literal(true),
      type: z.string(),
      value: z.array(arrayItemSchema),
      origin: z.string(),
    }),
  ]);
  return [schema, itemValueUnion, smh];
};

const [schm, unionSchema, smh] = getSchema();
try {
  //   schm.parse({
  //     isList: true,
  //     type: 'text',
  //     value: [],
  //     origin: 'fixed',
  //   });
  //   console.log('valid!');
  // unionSchema.parse({
  //   origin: 'fixed',
  //   type: 'number',
  //   value: 123,
  // });
  smh.parse({
    type: 'number',
    value: [
      {
        type: 'number',
        origin: 'fixed',
        value: 123,
        isList: false,
      },
    ],
    // value: 123,
    isList: true,
    origin: 'fixed',
  });
  console.log('Valid');
} catch (e) {
  if (e instanceof z.ZodError) {
    console.log(e.message);
  }
}



