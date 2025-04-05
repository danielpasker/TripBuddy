import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm } from "react-hook-form";
import { ZodObject, ZodRawShape, z } from "zod";

export const useValidatedForm = <SchemaType extends ZodRawShape>(
    schema: ZodObject<SchemaType>,
    defaultValues?: DefaultValues<z.infer<typeof schema>>
) => {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    return form;
};