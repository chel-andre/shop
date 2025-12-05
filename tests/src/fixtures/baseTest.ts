import { test as base, expect } from '@playwright/test';
import { App } from './app';

export const test = base.extend<{
    app: App;
}>({
    app: async ({ page }, use) => {
        const app = new App(page);
        await use(app);
    },
});

export { expect };
