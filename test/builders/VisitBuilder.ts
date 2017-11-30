import { IVisit } from './models/IVisit';
import { BuilderUtils } from './BuilderUtils';
import { isNullOrUndefined } from 'util';
import { IExam } from './models/IExam';
import { ExamBuilder } from './ExamBuilder';

export class VisitBuilder {
    public static create(visitData: IVisit) {
        return new VisitBuilder(visitData);
    }

    private readonly utils: BuilderUtils;
    private visitData: IVisit;
    private accumulator: Promise<any>;
    private readonly examBuilderList: ExamBuilder[] = [];

    private constructor(visitData: IVisit) {
        this.utils = new BuilderUtils();
        this.initialize(visitData);
    }

    private initialize(visitData: IVisit) {
        this.visitData = visitData;
        this.visitData.dateTime = this.visitData.dateTime || new Date();

        this.accumulator = this.utils.resolvedPromise();

        this.accumulator = this.accumulator.then(() =>
            this.utils.backend.addVisit(this.visitData.patientId, this.visitData as any)
                .then((visit) => {
                    this.visitData = visit;
                })
        );
    }

    public addExam(examData?: IExam, builderCallback?: (builder: ExamBuilder) => void): VisitBuilder {
        this.accumulator = this.accumulator.then(() => {
            const newExam = examData || {};
            newExam.visitId = this.visitData.id;
            newExam.name = newExam.name || 'Stethoscopy';

            const examBuilder = ExamBuilder.create(newExam);
            if (builderCallback) {
                builderCallback(examBuilder);
            }

            this.examBuilderList.push(examBuilder); // remember for cleanup

            return examBuilder.resolve().then((exam) => {
                if (this.visitData.examList) {
                    this.visitData.examList.push(exam);
                } else {
                    this.visitData.examList = [ exam ];
                }
            });
        });

        return this;
    }

    public resolve(): Promise<IVisit> {
        return this.accumulator.then(() => this.visitData);
    }

    public cleanup(): Promise<void> {
        if (isNullOrUndefined(this.visitData) ||
            isNullOrUndefined(this.visitData.id)) {
            // nothing to do
            return this.utils.resolvedPromise();
        }

        return Promise.all(this.examBuilderList.map((eb) => eb.cleanup()))
            .then(() => {
                const visitId = this.visitData.id;
                delete this.visitData;
                return this.utils.backend.deleteVisit(visitId);
            });
    }
}
