import { InMemoryBackend } from '../../src/backend/InMemoryBackend';
import { BackendManager } from '../../src/backend/BackendManager';

export class BuilderUtils {
    public readonly backend: InMemoryBackend = BackendManager.get();

    public resolvedPromise<T>(value?: T): Promise<T> {
        return Promise.resolve(value);
    }
}
