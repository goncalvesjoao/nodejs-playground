import { spawn } from 'node:child_process';

const forwardedArgs = process.argv.slice(2);
const testTargets = forwardedArgs.length > 0 ? forwardedArgs : ['test/**/*.test.ts'];

process.env.APP_ENV = 'test';

const child = spawn(
  process.execPath,
  ['--import', 'tsx', '--test', ...testTargets],
  {
    stdio: 'inherit',
    env: process.env,
  },
);

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
