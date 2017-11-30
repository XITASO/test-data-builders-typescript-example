import { PatientBuilder } from '../builders/PatientBuilder';
import { IPatient } from '../builders/models/IPatient';

export class DemoTest {
    private patientBuilder: PatientBuilder;
    private patientData: IPatient;

    /** Test preparation */
    async beforeEach(): Promise<void> {
        this.patientBuilder = PatientBuilder.create({ lastName: 'Miller' })
            .addVisit(
                { dateTime: new Date(2017, 8, 15) },
                (visitBuilder) => {
                    visitBuilder
                        .addExam() // uses default value
                        .addExam({ name: 'X-Ray' });
                }
            )
            .addVisit(
                { dateTime: new Date() },
                (visitBuilder) => {
                    visitBuilder.addExam({ name: 'Eye Exam' });
                });

        return this.patientBuilder.resolve((data) => {
            this.patientData = data;
        });
    }

    /** Test cleanup */
    async afterEach(): Promise<void> {
        if (this.patientBuilder) {
            await this.patientBuilder.cleanup();
        }
    }

    /** Actual test */
    async demoTest(): Promise<void> {
        prettyPrint(this.patientData);

        // assertions would go here
    }
}

function prettyPrint(obj: any): void {
    console.log(JSON.stringify(obj, null, 2));
}
