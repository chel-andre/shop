import { PlaywrightTestConfig, devices, defineConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    //reporter: [['./lib/reporter.ts']],
    reporter: [['html', { outputFolder: '../playwright-report' }]],
    testMatch: '**/*.spec.ts',
    use: {
        headless: false,
        viewport: { width: 1920, height: 1080 },
        ignoreHTTPSErrors: true,
        baseURL: 'http://localhost:3000/',
        screenshot: 'only-on-failure',
        actionTimeout: 60000,
    },                            
    projects: [  
        {   
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                launchOptions: {
                    args: ['--start-fullscreen'],
                },  
            }, 
        },
    ],

    timeout: 60000,
    retries: 0,  
};

export default defineConfig(config);