import { getGoogleDriveDirectLink } from "./src/lib/google-drive";

const url = "https://drive.google.com/file/d/1f5LGNLRKclaFyF49ARTGSwbc3cuwq9/view?usp=sharing";
const directLink = getGoogleDriveDirectLink(url);

console.log(`Original URL: ${url}`);
console.log(`Direct Link: ${directLink}`);
