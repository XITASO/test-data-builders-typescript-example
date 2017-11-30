import { DemoTest } from './tdb-demo/DemoTest';
import { BackendManager } from '../src/backend/BackendManager';

async function runTests() {
    BackendManager.initialize();

    const demoTest = new DemoTest();
    try {
        await demoTest.beforeEach();
        await demoTest.demoTest();
    } finally {
        await demoTest.afterEach();
    }
}

runTests().catch(console.error);
