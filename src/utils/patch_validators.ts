type validators = (value: any) => {success: boolean, message: string}
export const validatePatch=(
    body: Record<string, any>,
    validators: Record<string, validators>
)=>{
    for (const key in body){
        if (!validators[key]){
            return {success: false, message: `Invalid field: ${key}`}
        }
        const result= validators[key](body[key])
        if (!result.success){
            return result
        }
    }
    return {success: true, message: ""}
}