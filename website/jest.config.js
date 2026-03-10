/** @type {import('jest').Config} */
module.exports = {
  projects: [
    '<rootDir>/apps/easemind-web',
    '<rootDir>/apps/mfe-tasks',
  ],
  collectCoverageFrom: [
    'apps/**/src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
};
