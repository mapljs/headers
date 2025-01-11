# `@mapl/headers`
Parsing stuff for Mapl.

## CORS
CORS header parser for Mapl.
```ts
import { headers as cors } from '@mapl/headers/cors';

app.headers(cors({
  // A list of allowed headers or a single header (optional)
  allowHeaders: ...,
  // A list of allowed methods or a single methods (optional)
  allowMethods: ...,
  // A list of headers or a single header to expose (optional)
  exposeHeaders: ...,
  // A max age (optional)
  maxAge: ...,
  // Whether to allow credentials (optional)
  allowCredentials: ...
}));
```
