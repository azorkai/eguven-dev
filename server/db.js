
import Datastore from 'nedb-promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFactory = (fileName) => Datastore.create({
    filename: path.join(__dirname, 'data', fileName),
    autoload: true,
    timestampData: true,
});

const db = {
    posts: dbFactory('posts.db'),
};

export default db;
