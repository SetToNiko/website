import { execSync } from 'child_process';
import { extractBumpParams, getBumpType } from './bumpingFunctions.js';

const commit = execSync('git log -1 --format=%s').toString().trim();

let params = extractBumpParams(commit);
const bumpType = getBumpType(params.bang, params.headerType);

if (bumpType !== null) {
    bumpVersion(bumpType);
} else {
    console.log("No version bump.");
}

function bumpVersion(bumpType) {
    console.log("in bumpVersion");
    const command = `npm version ${bumpType} -m "version: ${bumpType} bump %s"`;
    // console.log(command);
    try {
        const result = execSync(command).toString();
        console.log(result)
    } catch (e) {
        console.error(`Error: ${e.message}`);
    }
}
