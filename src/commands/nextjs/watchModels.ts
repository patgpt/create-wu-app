import chokidar from 'chokidar';
import { log } from '../../utils/logger';

export const startWatchingModels = (modelsDir: string) => {
  chokidar.watch(modelsDir).on('all', (event, path) => {
    log(`File ${path} has been ${event}`, 'info');
    // Handle model synchronization with Contentful here
    // Generate SDK and Types here
  });
};
