import { createConnection, getConnectionOptions } from 'typeorm';

async function createConnectionFin(){
  const defaultOptions = await getConnectionOptions();

  if(process.env.NODE_ENV === 'test'){
    Object.assign(defaultOptions, { database: 'fin_api_test', host: 'localhost' })
  }


  return createConnection(defaultOptions);
}

export { createConnectionFin }
