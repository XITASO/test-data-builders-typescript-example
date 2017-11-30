import { IPatient } from './models/IPatient';
import { BuilderUtils } from './BuilderUtils';
import { isNullOrUndefined } from 'util';
import { IVisit } from './models/IVisit';
import { VisitBuilder } from './VisitBuilder';

export class PatientBuilder {
    public static create(patientData?: IPatient) {
        return new PatientBuilder(patientData);
    }

    private readonly utils: BuilderUtils;
    private patientData: IPatient;
    private accumulator: Promise<any>;
    private visitBuilderList: VisitBuilder[] = [];

    private constructor(patientData?: IPatient) {
        this.utils = new BuilderUtils();
        this.initialize(patientData);
    }

    private initialize(patientData?: IPatient) {
        this.patientData = patientData || {};
        this.patientData.lastName = this.patientData.lastName || 'Smith';
        this.patientData.firstName = this.patientData.firstName || 'Mary';

        this.accumulator = this.utils.resolvedPromise();

        this.accumulator = this.accumulator.then(() =>
            this.utils.backend.addPatient(this.patientData as any)
                .then((patient) => {
                    this.patientData = patient;
                })
        );
    }

    public addVisit(visitData: IVisit, builderCallback?: (builder: VisitBuilder) => void): PatientBuilder {
        this.accumulator = this.accumulator.then(() => {
            const newVisit = visitData || {};
            newVisit.patientId = this.patientData.id;

            const visitbuilder = VisitBuilder.create(newVisit);

            if (builderCallback) {
                builderCallback(visitbuilder);
            }

            this.visitBuilderList.push(visitbuilder); // remember for cleanup

            return visitbuilder.resolve().then((visit) => {
                if (this.patientData.visits) {
                    this.patientData.visits.push(visit);
                } else {
                    this.patientData.visits = [ visit ];
                }
            });
        });

        return this;
    }

    public resolve(onSuccess?: (patient: IPatient) => void): Promise<void> {
        return this.accumulator.then(() => {
            if (onSuccess) {
                onSuccess(this.patientData);
            }
        });
    }

    public cleanup(): Promise<void> {
        if (isNullOrUndefined(this.patientData) ||
            isNullOrUndefined(this.patientData.id)) {
            // nothing to do
            return this.utils.resolvedPromise();
        }

        return Promise.all(this.visitBuilderList.map((vb) => vb.cleanup()))
            .then(() => {
                const patientId = this.patientData.id;
                delete this.patientData;
                return this.utils.backend.deletePatient(patientId);
            });
    }
}
