import {InMemoryBackend} from "../backend/InMemoryBackend";
import {Visit} from "../model/Visit";

export class VisitService {
    constructor(private readonly backend: InMemoryBackend){}

    public addVisit(patientId: number, visit: Visit): Promise<Visit> {
        return this.backend.addVisit(patientId, visit);
    }
}
