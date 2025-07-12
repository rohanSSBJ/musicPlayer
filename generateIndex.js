// generateIndex.js
const fs = require("fs");
const path = require("path");

const songsDir = path.join(__dirname, "public", "songs");
const index = {};

// Loop through all folders inside /songs
fs.readdirSync(songsDir).forEach(folder => {
    const folderPath = path.join(songsDir, folder);
    if (fs.statSync(folderPath).isDirectory()) {
        const files = fs.readdirSync(folderPath).filter(file => file.endsWith(".m4a") || file.endsWith(".mp3"));
        index[folder] = files;
    }
});

// Write to public/songs/index.json
fs.writeFileSync(
    path.join(songsDir, "index.json"),
    JSON.stringify(index, null, 2)
);

console.log("✅ index.json generated at public/songs/index.json");
