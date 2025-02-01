import type { RouterPlugin, Router } from '@mapl/app';
import { setMinimumHolders } from '@mapl/app/compiler/middleware.js';
import type { MacroFunc } from '@mapl/app/macro.js';

type HeaderValue = '*' | (string & {}) | [string, string, ...string[]];

export interface Options {
  allowHeaders?: HeaderValue;
  allowMethods?: HeaderValue;
  exposeHeaders?: HeaderValue;
  maxAge?: number;
  allowCredentials?: boolean;
}

const corsMacro: MacroFunc<Exclude<HeaderValue, string>> = (options, ctx, state) => {
  setMinimumHolders(ctx, 1);

  // eslint-disable-next-line
  const originList = 'f' + state.externalValues.push(options);
  ctx[0] += `${compilerConstants.HOLDER_0}=${compilerConstants.ORIGIN_VAL};${compilerConstants.HEADERS}.push(['Access-Control-Allow-Origin',${originList}.includes(${compilerConstants.HOLDER_0})?${compilerConstants.HOLDER_0}:${originList}[0]]);`;
};

export default ((app, origins, options) => {
  // Optimized for code size
  const headers: [string, string][] = options == null
    ? []
    : Object.entries(options).map(([x, y]) => [
      // eslint-disable-next-line
      'Access-Control-' + x[0].toUpperCase() + x.slice(1).replace(/([a-z])([A-Z])/g, '$1-$2'),
      // eslint-disable-next-line
      '' + y
    ]);

  // When one specific or multiple origins are specified
  if (origins !== '*') {
    headers.push(['Vary', 'Origin']);

    // Handle multiple origins
    if (Array.isArray(origins)) {
      return app
        .headers(headers)
        .macro({
          loadSource: corsMacro,
          options: origins
        });
    }
  }

  // Decide right away
  headers.push(['Access-Control-Allow-Origin', origins]);
  return app.headers(headers);
}) as RouterPlugin<Router, [origins: HeaderValue] | [origins: HeaderValue, options?: Options]>;
