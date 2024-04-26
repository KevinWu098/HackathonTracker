import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// This is a server-only utility to read and parse a YAML file
export function readYaml(fileName: string) {
    const filePath = path.join(process.cwd(), 'public', fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContents);
}
