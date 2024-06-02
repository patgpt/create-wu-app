import dotenv from 'dotenv';
import fs from 'fs-extra';
import path from 'path';
dotenv.config();

const projectPath = path.resolve(__dirname, process.cwd());
const envFilePath = path.join(projectPath, '.env');
if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath });
}
