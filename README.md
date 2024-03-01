# Zikeji's Convenience Modpack

I got tired of sending my friends a list of mods and all that fun stuff, so here we go.

## Attribution

- flushedhead.cosmetics - [inacraft cosmetics megapack](https://thunderstore.io/c/lethal-company/p/broiiler/inacraft_cosmetics_megapack/)  
- electricyellowcichlid.cosmetics - [Free3D](https://free3d.com/3d-model/electric-yellow-cichlid-v1--199868.html)
- kitty.cosmetics - [SketchFab](https://sketchfab.com/3d-models/kitty-70483b20fb9646dab796135f06ac531d)

## Forking

If you'd like to fork this modpack and make your own, feel free to! I have a few utility scripts that help with releases but the GitHub action does alot of the heavy lifting. I would recommend just creating a new repo and copying my files over so you don't get my commit history.

### Instructions

1. If you don't have one already, go to Thunderstore and [create a team](https://thunderstore.io/settings/teams/create/).
2. Now go to "Service Accounts" for your team and click "Add service account", fill it out, submit, and copy that API token.
3. In your GitHub repository, you'll want to go to "Settings" then "Secrets" and create the secret `THUNDERSTORE_TOKEN` with the value being that API token you just made.
4. Now you'll want to update `.github/workflows/publish.yml`, line 27, change the value of `namespace` to the name of your team.
5. Update the manifest.json with the details of your modpack
    * change "website_url" to match your GitHub repository's link, or the link to your Discord server, or whatever.
    * change "version_number" to 1.0.0 or whatever you want your initial version to be (0.0.69?).
    * change "name" to whatever you want the modpack to be named, keep in mind this name is fairly strict, so avoid special characters, spaces, etc.
    * add a little description to the "description"
    * update the dependencies with your new modpack's dependencies
    You can go to Settings -> Modpacks -> Show Dependency Strings in r2modman to grab the list, then surround it with quotes and commas to match the JSON format.
6. clear out the `config` folder and add any config overrides you want
    * if you don't want any, delete the config folder and update line 15 in `.github/workflows/publish.yml` to remove the publish.yml file
7. CHANGE THE ICON.PNG
9. Clear out the CHANGELOG.md file and add your initial release info, moving forward after your first release you can use my script to make it easier.
10. You should be done, make your first commit and push it up - now go to your repo and watch the action. If anything got messed up the error there will clarify. Otherwise, you should expect your modpack published shortly.

### Other Notes

In the action `publish.yml` we package the modpack into a ZIP, if you need to add a folder to that ZIP be sure to update line 15 with that new folder (such as audio for custom boomboxes). If you want to change other details, such as the category, you can do so in `publish.yml` as well.

### Script Notes

The scripts `checkVersions.js` and `generateChanges.js` require NodeJS.

### Update Instructions

1) Start by running `node ./checkVersions.js`, this file will check all the versions of your current dependencies and update the manifest with changes if necessary.
2) If you're just updating dependencies, skip steps 3 thru 5.
3) Add any dependency strings to the dependencies for mods you want to add.
4) Remove any dependency strings from the dependencies for mods you want to remove.
5) Copy any updated configs from your r2modman profile to the config folder in the repo.
6) Update the version in the manifest. For me if I add/remove a mod I change the minor version (middle number), if I just updated dependencies or changed a config I update the patch version (last number).
7) Run `node ./generateChanges.js`, this will generate your CHANGELOG.md template. If I go back to step 3 for some reason I'll just discard my changes to CHANGELOG.md so I can run this script again.
8) Open CHANGELOG.md and add any additional details as necessary.
9) Stage changes and commit (I usually just use the new version number as the message)
10) Push and wait for it to go live! Watch your GitHub action though, if something went wrong it'll make note of it there.