
const bumps = {
    minor: "feat",
    patch: "fix",
}

export function extractBumpParams(commit) {
    let header = commit.split(':')[0];
    // console.log(`header: ${header}`);

    const bangIndex = header.indexOf('!');
    const hasBang = bangIndex != -1;
    if (hasBang) {
        header = header.split('!')[0];
    }

    header = header.split('(')[0];
    // console.log(`commit type: ${header}`);

    return { bang: hasBang, headerType: `${header}` };
}

export function getBumpType(hasBang, headerType) {

    // console.log(`header type at bump: ${headerType}`)
    if (hasBang && (headerType === bumps.minor || headerType === bumps.patch)) {
        return "major";
    } else {
        switch (headerType) {
            case bumps.minor:
                return "minor";
            case bumps.patch:
                return "patch";
            default:
                return null;
        }
    }
}

