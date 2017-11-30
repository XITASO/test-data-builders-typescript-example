import { isNullOrUndefined } from 'util';
import { Patient } from '../model/Patient';
import { Visit } from '../model/Visit';
import { Exam } from '../model/Exam';

type StoragePatient = Patient & { visitIdList: number[] };
type StorageVisit = Visit & {
    examIdList: number[];
    discussedTreatmentIdList: number[];
};
type StorageExam = Exam & {
    diagnosisIdList: number[];
};

function randomInt(min: number, max: number): number {
    min = Math.ceil(min || 0);
    max = Math.floor(max || 0);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

class AutoIncrementingStorage<T extends { id?: number }> {
    private _nextId: number;
    private storage: Map<number, T>;

    constructor() {
        this._nextId = randomInt(0, 10000);
        this.storage = new Map();
    }

    private getNextId(): number {
        return this._nextId++;
    }

    public add(object: T): Promise<{ id: number }> {
        return new Promise(resolve => {
            if (!isNullOrUndefined(object.id)) {
                throw new Error(`Object already has an ID: ${object}`);
            }

            const id = this.getNextId();
            object.id = id;
            this.storage.set(id, object);
            resolve({ id });
        });
    }

    public get(id: number): Promise<T | undefined> {
        return new Promise(resolve => {
            if (isNullOrUndefined(id)) {
                throw new Error(`Cannot look up object without ID`);
            }

            resolve(this.storage.get(id));
        });
    }

    public getAll(): Promise<T[]> {
        return Promise.resolve(Array.from(this.storage.values()));
    }

    public delete(id: number): Promise<void> {
        return new Promise(resolve => {
            this.storage.delete(id);
            resolve();
        });
    }
}

export class InMemoryBackend {
    private readonly patientStorage = new AutoIncrementingStorage<StoragePatient>();
    private readonly visitStorage = new AutoIncrementingStorage<StorageVisit>();
    private readonly examStorage = new AutoIncrementingStorage<StorageExam>();

    addPatient(patient: Patient): Promise<Patient> {
        return Promise.resolve(Object.assign({ visitIdList: [] }, patient))
            .then((storagePatient: StoragePatient) => {
                delete storagePatient.visits;
                patient = storagePatient;
                return this.patientStorage.add(storagePatient);
            })
            .then(() => {
                return new Patient(patient);
            });
    }

    getPatients(): Promise<Patient[]> {
        return this.patientStorage.getAll()
            .then((patients) => patients.map(p => new Patient(p)));
    }

    deletePatient(id: number): Promise<void> {
        return this.patientStorage.delete(id);
    }

    addVisit(patientId: number, visit: Visit): Promise<Visit> {
        return this.patientStorage.get(patientId)
            .then((patient: StoragePatient) => {
                if (isNullOrUndefined(patient)) {
                    throw new Error('Can only add visits for existing patients');
                }

                const storageVisit = Object.assign({
                    examIdList: [],
                    discussedTreatmentIdList: []
                }, visit, { patientId: patient.id });
                delete storageVisit.examList;
                delete storageVisit.discussedTreatmentList;
                visit = storageVisit;

                return Promise.all([
                    patient,
                    this.visitStorage.add(storageVisit)
                ]);
            })
            .then(([ patient, { id } ]) => {
                patient.visitIdList.push(id);
                return new Visit(visit);
            });
    }

    deleteVisit(id: number): Promise<void> {
        return this.visitStorage.delete(id);
    }

    addExam(visitId: number, exam: Exam): Promise<Exam> {
        return this.visitStorage.get(visitId)
            .then((visit: StorageVisit) => {
                if (isNullOrUndefined(visit)) {
                    throw new Error('Can only add exams for existing visits');
                }

                const storageExam = Object.assign({
                    diagnosisIdList: []
                }, exam, { visitId: visit.id });
                delete storageExam.diagnosisList;
                exam = storageExam;

                return Promise.all([
                    visit,
                    this.examStorage.add(storageExam)
                ])
            })
            .then(([ visit, { id }]) => {
                visit.examIdList.push(id);
                return new Exam(exam);
            });
    }

    deleteExam(id: number): Promise<void> {
        return this.examStorage.delete(id);
    }
}
