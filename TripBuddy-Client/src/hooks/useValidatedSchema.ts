import {DefaultValues, useForm} from 'react-hook-form';
import {ZodObject, ZodRawShape, z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

export const useValidatedForm = <SchemaType extends ZodRawShape>(
  schema: ZodObject<SchemaType>,
  defaultValues?: DefaultValues<z.infer<typeof schema>>
) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    // shouldUnregister: true,
    defaultValues,
  });

  return form;
};
