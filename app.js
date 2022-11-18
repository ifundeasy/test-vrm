import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fastify = Fastify({
  logger: true
})

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public')
})

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'node_modules'),
  prefix: '/node_modules/',
  decorateReply: false // the reply decorator has been added by the first plugin registration
})

export default fastify
