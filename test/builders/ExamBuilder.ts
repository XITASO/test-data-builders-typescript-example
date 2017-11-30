import { BuilderUtils } from './BuilderUtils';
import { IExam } from './models/IExam';
import { isNullOrUndefined } from 'util';

export class ExamBuilder {
    public static create(examData: IExam) {
        return new ExamBuilder(examData);
    }

    private readonly utils: BuilderUtils;
    private examData: IExam;
    private accumulator: Promise<any>;

    private constructor(examData: IExam) {
        this.utils = new BuilderUtils();
        this.initialize(examData);
    }

    private initialize(examData: IExam) {
        this.examData = examData;
        this.examData.name = this.examData.name || '';

        this.accumulator = this.utils.resolvedPromise();

        this.accumulator = this.accumulator.then(() =>
            this.utils.backend.addExam(this.examData.visitId, this.examData as any)
        );
    }

    public resolve(): Promise<IExam> {
        return this.accumulator.then(() => this.examData);
    }

    public cleanup(): Promise<void> {
        if (isNullOrUndefined(this.examData) ||
            isNullOrUndefined(this.examData.id)) {
            // nothing to do
            return this.utils.resolvedPromise();
        }

        const examId = this.examData.id;
        delete this.examData;
        return this.utils.backend.deleteExam(examId);
    }
}
