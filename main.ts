import { config, oakCors, Application } from './deps.ts';
import router from './routes/index.ts';

const app = new Application();

const REGEX_ORIGIN = Deno.env.get('REGEX_ORIGIN') || config()['REGEX_ORIGIN'];

app.use(
  oakCors({
    origin: new RegExp(REGEX_ORIGIN),
  })
);
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
