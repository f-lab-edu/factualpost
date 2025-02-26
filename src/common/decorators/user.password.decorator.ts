import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { HaveSpecialChar } from '../validators/user.password.validator';

export function IsSpecialChar(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'IsSpecialChar',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: HaveSpecialChar,
        });
    };    
}