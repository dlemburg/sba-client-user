export const logger = (name:string, data:any = false) => {
    if (data) console.log(`Here is the data for ${name}: `, data);
    else console.log(name);
}