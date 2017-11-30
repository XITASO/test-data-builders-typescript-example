import { Patient } from './model/Patient';
import { InMemoryBackend } from './backend/InMemoryBackend';
import { PatientService } from './api-services/PatientService';
import { VisitService } from './api-services/VisitService';
import { Visit } from './model/Visit';
import { BackendManager } from './backend/BackendManager';

BackendManager.initialize();
const backend = BackendManager.get();
const patientService = new PatientService(backend);
const visitService = new VisitService(backend);

async function main() {

    const p = await patientService.addPatient(new Patient({
        firstName: 'Jane',
        lastName: 'Doe',
        visits: []}));
    console.log(p);
    const v = await visitService.addVisit(p.id, new Visit());
    console.log(v);
    console.log(p);

    const ps = await patientService.getAllPatients();
    console.log(ps);

    return '\nDone.'
}

main().then(console.log, console.error);
