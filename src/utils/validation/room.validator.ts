import { isPositiveInteger, isNonEmptyString } from '@/utils/validators';
export const roomValidators = {
    roomNo: isPositiveInteger,
    price: isPositiveInteger,
    capacity: isPositiveInteger,
    type: isNonEmptyString,
    description: isNonEmptyString,
};