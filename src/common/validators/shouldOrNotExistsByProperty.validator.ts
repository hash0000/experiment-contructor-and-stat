import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function ShouldOrNotExistsByProperty(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'shouldOrNotExistsByProperty',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      async: false,
      validator: {
        validate(value: string, args: ValidationArguments): boolean {
          const [property] = args.constraints;
          const relatedProperty: any = (args.object as object)[property];

          if (relatedProperty && !value) {
            return false;
          }
          if (!relatedProperty && value) {
            return false;
          }

          return true;
        },
      },
    });
  };
}
