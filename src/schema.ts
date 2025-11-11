import z from 'zod';

const schm = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('active'),
    value: z.string(),
  }),
  z.object({
    type: z.literal('inactive'),
    value: z.number(),
  }),
  z.object({
    type: z.null(),
    value: z.null(),
  }),
]);

type FormType = z.infer<typeof schm>;

const form: FormType = {
  type: null,
  value: '123',
};

console.log(form);
