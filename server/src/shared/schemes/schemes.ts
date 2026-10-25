import z from 'zod';

const id = z
    .string({ error: 'ID должен быть строкой.' })
    .refine(
        (value) => /^\d+$/.test(value) && Number.isSafeInteger(Number(value)) && Number(value) > 0,
        { error: 'ID должен быть положительным целым числом.' }
    );

const integerQuery = (min: number, max = Number.MAX_SAFE_INTEGER) =>
    z.string({ error: 'Параметр должен быть строкой.' }).refine(
        (value) => {
            const number = Number(value);
            return (
                /^\d+$/.test(value) &&
                Number.isSafeInteger(number) &&
                number >= min &&
                number <= max
            );
        },
        { error: `Укажите целое число от ${min} до ${max}.` }
    );

const priority = z.int().min(1).max(5);

export const projectParamsSchema = z.object({ projectId: id });
export const taskParamsSchema = z.object({ projectId: id, taskId: id });

export const projectsQuerySchema = z.object({
    limit: integerQuery(1, 100).optional(),
    offset: integerQuery(0).optional(),
});

export const projectInputSchema = z.strictObject({
    name: z.string().trim().min(1).max(120),
    budget_kopecks: z.int().nonnegative().max(999999999999),
    start_date: z.iso.date(),
    priority,
});

export const taskInputSchema = z.strictObject({
    title: z.string().trim().min(1).max(160),
    effort_minutes: z.int().nonnegative().max(2147483647),
    end_date: z.iso.date(),
    priority,
});

export const loginSchema = z.strictObject({
    username: z.string().min(1).max(60),
    password: z.string().min(1).max(256),
});
