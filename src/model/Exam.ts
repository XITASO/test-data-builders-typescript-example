
import {Diagnosis} from "./Diagnosis";

export class Exam {
    public id?: number;
    public name: string;
    public description: string;
    public visitId?: number;

    public diagnosisList?: Diagnosis[];

    constructor(fields?: Partial<Exam>){
        Object.assign(this, fields);
    }
}