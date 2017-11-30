
import { Visit } from "./Visit";

export class Patient {
    public id?: number;
    public firstName: string;
    public lastName: string;
    public dateOfBirth: Date;

    public visits?: Visit[];

    constructor(fields?: Partial<Patient>){
        Object.assign(this, fields);
    }
}
