
import {Exam} from "./Exam";
import {Treatment} from "./Treatment";

export class Visit {
    public id?: number;
    public dateTime: Date;
    public patientId?: number;

    public examList?: Exam[];
    public discussedTreatmentList?: Treatment[];

    constructor(fields?: Partial<Visit>){
        Object.assign(this, fields);
    }
}
