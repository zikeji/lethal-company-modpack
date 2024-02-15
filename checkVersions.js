const https = require('https');
const { readFile } = require("fs/promises");

/**
 * @returns {Promise<{name: string, owner: string, package_url: string versions: { version_number: string }[]}[]>}
 */
const getPackages = () => new Promise((resolve, reject) => {
    https.get('https://thunderstore.io/c/lethal-company/api/v1/package/', (res) => {
        const data = [];
        res.on('data', chunk => {
            data.push(chunk);
        });
        res.on('end', () => {
            resolve(JSON.parse(Buffer.concat(data).toString()));
        });
    }).on('error', err => {
        reject(err);
    });
});

(async () => {
    const manifest = JSON.parse(await readFile("./manifest.json", "utf-8"));
    const packages = await getPackages();
    let updates = 0;
    for (const dependency of manifest.dependencies) {
        const [owner, name, version] = dependency.split('-');
        const package = packages.find((obj) => obj.owner === owner && obj.name === name);
        if (!package) {
            console.error(`No package found for ${owner}-${name}!`);
            continue;
        }
        if (version !== package.versions[0].version_number) {
            updates += 1;
            console.log(`${name} by ${owner} is upgraded from ${version} to ${package.versions[0].version_number}`);
            console.log(package.package_url);
        }
    }
    if (updates === 0) {
        console.log("There were no packages with updates.");
    }
})();