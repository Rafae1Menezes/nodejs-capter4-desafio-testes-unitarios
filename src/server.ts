import { app } from './app';
import { createConnectionFin } from './database';

createConnectionFin();
app.listen(3333, () => { console.log('Server is running') });
