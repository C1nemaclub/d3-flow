import { z } from 'zod';

/**
 * A rule that applies conditional validation to one field of the object.
 * - `field` is the name of the field to validate conditionally.
 * - `predicate` receives the whole parsed object and returns boolean.
 * - `then` is the schema to validate `field` with when predicate === true.
 * - `otherwise` (optional) is the schema to validate `field` with when predicate === false.
 */
type ConditionalRule<S extends z.ZodRawShape> = {
  field: keyof z.infer<z.ZodObject<S>>;
  predicate: (obj: z.infer<z.ZodObject<S>>) => boolean;
  then?: z.ZodTypeAny;
  otherwise?: z.ZodTypeAny;
};

/**
 * Wraps a base object schema and returns a new schema that also applies
 * conditional rules. The returned schema keeps the original parsing result
 * (no automatic transformation) but adds validation issues when conditional
 * schemas fail.
 */
export function zConditionalObject<S extends z.ZodRawShape>(
  shape: S,
  rules: ConditionalRule<S>[]
) {
  const base = z.object(shape);

  return base.superRefine((data, ctx) => {
    for (const rule of rules) {
      try {
        const shouldApply = rule.predicate(data);
        const schemaToUse = shouldApply ? rule.then : rule.otherwise;
        if (!schemaToUse) continue; // nothing to validate for this branch

        // validate the field value with the conditional schema
        const value = (data as any)[String(rule.field)];
        const result = schemaToUse.safeParse(value);

        if (!result.success) {
          // convert inner errors to issues on the object context
          for (const err of result.error.errors) {
            // err.path is path *inside* the field; we want full path [field, ...err.path]
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              // Use the original message from the inner issue if present
              message: err.message ?? 'Invalid value',
              path: [String(rule.field), ...err.path],
            });
          }
        }
      } catch (e) {
        // defensively report unexpected errors as issues
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: (e as Error)?.message ?? 'Conditional validation error',
          path: [],
        });
      }
    }
  });
}

const baseShape = {
  contactMethod: z.enum(['email', 'phone']),
  email: z.string().email().optional(),
  phone: z.string().optional(),
};

const schema = zConditionalObject(baseShape, [
  {
    field: 'email',
    predicate: (obj) => obj.contactMethod === 'email',
    then: z.string().email(),
    otherwise: z.string().optional(),
  },
  {
    field: 'phone',
    predicate: (obj) => obj.contactMethod === 'phone',
    then: z
      .string()
      .min(7, { message: 'Phone is required when contactMethod is phone' }),
    otherwise: z.string().optional(),
  },
]);

// Usage:
schema.parse({
  contactMethod: 'email',
  email: 'svm@email.com', // -> will produce an error on email
  phone: '1231232',
});
