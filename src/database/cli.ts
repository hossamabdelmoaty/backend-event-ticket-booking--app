import { initializeSchema, dropSchema } from './data-source';

const command = process.argv[2];

async function run() {
  try {
    switch (command) {
      case 'schema:create':
        await initializeSchema();
        break;
      case 'schema:drop':
        await dropSchema();
        break;
      default:
        console.error('Unknown command. Available commands: schema:create, schema:drop');
        process.exit(1);
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run(); 