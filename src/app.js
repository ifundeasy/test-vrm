import dotenv from 'dotenv'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import fastifyView from '@fastify/view'
import ejs from 'ejs';

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');
const availableModel = fs.readdirSync(`${publicDir}/assets/models`)
  .filter(el => el.indexOf('.vrm') === el.length - 4)
  .map(el => el.substring(0, el.length - 4).toLowerCase());

const fastify = Fastify({
  logger: true
})

fastify.register(fastifyStatic, {
  root: publicDir,
  prefix: '/public/',
})

fastify.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'node_modules'),
  prefix: '/node_modules/',
  decorateReply: false // the reply decorator has been added by the first plugin registration
})

fastify.register(fastifyView, {
  engine: { ejs },
  root: path.join(__dirname, 'views'),
  propertyName: 'render', // The template can now be rendered via `reply.render()` and `fastify.render()`
  defaultContext: {
    ENV: process.env.NODE_ENV
  },
});

fastify.get('/:character', (req, reply) => {
  const { character } = req.params;
  if (availableModel.indexOf(character) === -1) return reply.redirect(`/${availableModel[0]}`)
  return reply.render('index.ejs');
});

export default fastify
