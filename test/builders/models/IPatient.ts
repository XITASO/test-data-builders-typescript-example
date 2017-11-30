import { IVisit } from './IVisit';

export interface IPatient {
    id?: number;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;

    visits?: IVisit[];
}
