import { InMemoryBackend } from './InMemoryBackend';
import { isNullOrUndefined } from 'util';

export class BackendManager {
    private static backend: InMemoryBackend;

    public static initialize(): void {
        BackendManager.backend = new InMemoryBackend();
    }

    public static get(): InMemoryBackend {
        if (isNullOrUndefined(BackendManager.backend))
            throw new Error('Not initialized');
        return BackendManager.backend;
    }
}
