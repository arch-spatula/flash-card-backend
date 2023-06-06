import { Application } from 'https://deno.land/x/oak@v12.4.0/mod.ts';
import router from './routes/index.ts';
import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';
import { config } from 'https://deno.land/x/dotenv@v3.2.2/mod.ts';

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
