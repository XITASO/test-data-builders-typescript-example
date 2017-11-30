import { IExam } from './IExam';

export interface IVisit {
    id?: number;
    dateTime?: Date;
    patientId?: number;

    examList?: IExam[];
}
