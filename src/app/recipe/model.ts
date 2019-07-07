
export interface ingrediant {
    ingrediantname:string;
}
export interface step {
    
    description: string,
    time?:number,
    photo?:string,
    photoData?: string
    video?:string
}
 
export class Recipe {
    constructor(
    public _id:number,
    public name:string,
    public overview:string,
    public ingrediants:ingrediant[],
    public steps:step[]){}
}  
