/**
 * This is free and unencumbered software released into the public domain.
 * 
 * Anyone is free to copy, modify, publish, use, compile, sell, or
 * distribute this software, either in source code form or as a compiled
 * binary, for any purpose, commercial or non-commercial, and by any
 * means.
 * 
 * In jurisdictions that recognize copyright laws, the author or authors
 * of this software dedicate any and all copyright interest in the
 * software to the public domain. We make this dedication for the benefit
 * of the public at large and to the detriment of our heirs and
 * successors. We intend this dedication to be an overt act of
 * relinquishment in perpetuity of all present and future rights to this
 * software under copyright law.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * 
 * For more information, please refer to <https://unlicense.org>
 */

const https = require('https');
const { readFile } = require("fs/promises");

/**
 * @typedef {Object} ThunderstorePackage
 * @property {string} name
 * @property {string} full_name
 * @property {string} owner
 * @property {string} package_url
 * @property {{version_number: string}[]} versions
 */

/**
 * @returns {Promise<ThunderstorePackage[]>}
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

const main =  async () => {
    /** @type {{name: string, version_number: string}} */
    const { name, version_number } = JSON.parse(await readFile("./manifest.json", "utf-8"));
    process.stdout.write(`Checking general availablility of ${name} version ${version_number}`);
    while (true) {
        const packages = await getPackages();
        const package = packages.find((p) => p.name === name);
        if (!package) {
            process.stdout.write("\n");
            console.error(`Package ${name} not found!`);
            process.exit(-1);
        }
        if (package.versions.some((p) => p.version_number === version_number)) {
            process.stdout.write("\n");
            console.log(`${name} version ${version_number} is available.`);
        }
        process.stdout.write(".");
        await new Promise((resolve) => setTimeout(resolve, 30000));
    }
};

main();