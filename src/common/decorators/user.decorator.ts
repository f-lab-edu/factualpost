import { registerDecorator, ValidationOptions } from 'class-validator';
import { RangeValidator } from '../validators/user.range.validator';

export function IsInRange(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'IsInRange',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: RangeValidator,
        });
    };    
}