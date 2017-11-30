import { Patient } from '../model/Patient';
import { InMemoryBackend } from '../backend/InMemoryBackend';

export class PatientService {
    constructor(private readonly backend: InMemoryBackend) {
    }

    public addPatient(patient: Patient): Promise<Patient> {
        return this.backend.addPatient(patient);
    }

    getAllPatients(): Promise<Patient[]> {
        return this.backend.getPatients();
    }
}