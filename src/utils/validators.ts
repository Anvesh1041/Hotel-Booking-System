    export function isPositiveInteger(value: number) {
        return ( Number.isInteger(value) && value > 0)
        ? {success:true, message: ""} 
        : {success:false, message: "Value must be a positive integer"}
    }
    export function isNonEmptyString(value: string) {
        return (typeof value === 'string' && value.trim().length > 0)
        ? {success:true, message: ""} 
        : {success:false, message: "Value must be a non-empty string"}
    }