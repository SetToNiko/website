import { extractBumpParams, getBumpType } from "../bumpingFunctions.js";

let test_cases = [
    { commit: 'feat(ui)!: test', bump: 'major' },
    { commit: 'feat!: test', bump: 'major' },
    { commit: 'feat: test', bump: 'minor' },
    { commit: 'feat(ui): test', bump: 'minor' },
    { commit: 'fix(ui): test', bump: "patch" },
    { commit: 'fix: test', bump: "patch" },
    { commit: 'fix(ui)!: test', bump: "major" },
    { commit: 'fix!: test', bump: "major" },
    { commit: 'docs(ui): test', bump: null },
    { commit: 'docs(ui)!: test', bump: null },
    { commit: 'docs!: test', bump: null },
    { commit: 'version: patch bump 0.0.7', bump: null },
    { commit: 'Merge branch \'dev\'', bump: null },
    { commit: 'fixup! feat: x', bump: null },
];

testBumps(test_cases);

function testBumps(testCases) {
    let results = [];
    testCases.forEach((element) => {
        // console.log(`commit: ${element.commit}`);

        let params = extractBumpParams(element.commit);
        // console.log(`extracted params: ${params.bang} ${params.headerType}`);

        const bumpType = getBumpType(params.bang, params.headerType);
        // console.log(`bump type: ${bumpType}`);

        if (bumpType !== element.bump) {
            results.push(`case: ${element.commit}, expected: ${element.bump}, got: ${bumpType}`)
        }
    });
    if (results.length != 0) {
        console.log("Some tests failed: ");
        console.log(results);
    } else {
        console.log("All tests passed!");
    }
}

