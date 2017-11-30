export class Treatment {
    public id?: number;
    public description: string;
    public startDate: Date;
    public endDate?: Date;

    public diagnosisIdList?: number[];
    public visitIdList?: number[];

    constructor(fields?: Partial<Treatment>) {
        Object.assign(this, fields);
    }
}