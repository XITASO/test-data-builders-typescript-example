
export class Diagnosis {
    public id?: number;
    public description: string;
    public timeStamp: Date;
    public examId?: number;
    public treatmentId?: number;

    constructor(fields?: Partial<Diagnosis>){
        Object.assign(this, fields);
    }
}