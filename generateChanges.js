const { exec } = require("child_process");
const { readFileSync } = require("fs");

const objectify = (data) => {
    const obj = {};
    for (const dep of data) {
        const parts = dep.split("-");
        if (parts.length !== 3) {
            process.stdout.write(`Malformatted dependency? "${dep}"\n`);
            process.exit(-1);
        }
        const [author, name, version] = parts;
        obj[`${author}-${name}`] = version;
    }
    return obj;
}

exec("git show HEAD:manifest.json", (_, stdout) => {
    let oldManifest = {};
    try {
        oldManifest = JSON.parse(stdout);
        oldManifest = objectify(oldManifest.dependencies);
    } catch (e) {
        process.stdout.write("Unable to parse HEAD manifest.json.\n");
        process.exit(-1);
    }
    let newManifestRaw = '';
    try {
        newManifestRaw = readFileSync("./manifest.json", "utf-8");
    } catch (e) {
        process.stdout.write("Unable to open manifest.json.\n");
        process.exit(-1);
    }
    let newVersion = '';
    let newManifest = {};
    try {
        newManifest = JSON.parse(newManifestRaw);
        newVersion = newManifest.version_number;
        newManifest = objectify(newManifest.dependencies);
    } catch (e) {
        process.stdout.write("Unable to parse manifest.json.\n");
        process.exit(-1);
    }
    const changelog = {
        added: [],
        updated: [],
        removed: []
    }
    for (const key of Object.keys(oldManifest)) {
        if (!newManifest[key]) {
            changelog.removed.push(key);
            delete oldManifest[key];
            continue;
        }
        if (oldManifest[key] !== newManifest[key]) {
            changelog.updated.push(`[${key.split('-')[1]}](https://thunderstore.io/c/lethal-company/p/${key.split('-')[0]}/${key.split('-')[1]}/) updated to ${newManifest[key]}`);
        }
        delete oldManifest[key];
        delete newManifest[key];
    }
    for (const key of Object.keys(newManifest)) {
        changelog.added.push(key);
    }
    changelog.added.sort();
    changelog.updated.sort();
    changelog.removed.sort();
    const text = [`# ${newVersion}`, ''];
    if (changelog.added.length > 0) {
        text.push('### Additions');
        text.push('');
        for (const added of changelog.added) {
            const [author, name] = added.split('-');
            text.push(`#### [${name}](https://thunderstore.io/c/lethal-company/p/${author}/${name}/)`);
            text.push('');
        }
    }
    if (changelog.updated.length > 0) {
        text.push('### Updates');
        text.push('');
        if (changelog.updated.length === 1) {
            text.push(`Updated ${changelog.updated[0]}.`);
        } else if (changelog.updated.length === 2) {
            text.push(`Updated ${changelog.updated[0]} and ${changelog.updated[0]}.`);
        } else {
            const last = changelog.updated.pop();
            text.push(`Updated ${changelog.updated.join(', ')}, and ${last}.`)
        }
        text.push('');
    }
    if (changelog.removed.length > 0) {
        text.push('### Removals');
        text.push('');
        for (const removed of changelog.removed) {
            const [author, name] = removed.split('-');
            text.push(`#### [${name}](https://thunderstore.io/c/lethal-company/p/${author}/${name}/)`);
            text.push('');
        }
    }
    console.log(text.join("\n"));
});