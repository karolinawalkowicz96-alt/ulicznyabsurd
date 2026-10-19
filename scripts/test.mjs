import {spawnSync} from 'node:child_process';
const run=spawnSync(process.execPath,['--import','tsx','--test','tests/unit.test.ts','tests/integration.test.ts'],{stdio:'inherit'});process.exit(run.status??1);
