export type HeaderValues = string[] | ('*' | (string & {}));

export interface Options {
  allowHeaders?: HeaderValues;
  allowMethods?: HeaderValues;
  exposeHeaders?: HeaderValues;
  maxAge?: number;
  allowCredentials?: boolean;
}

/**
 * Headers that allow all origins
 */
export const allowAllOrigins: [string, string][] = [['Access-Control-Allow-Origin', '*']];
export const varyOrigin: [string, string] = ['Vary', 'Origin'];

/**
 * Allow a single origin
 */
export const allowOrigin = (origin: string): [string, string][] => [['Access-Control-Allow-Origin', origin], varyOrigin];

/**
 * CORS headers parser
 */
export const headers = (o: Options): [string, string][] => Object.entries(o).map(([x, y]) => [
  // eslint-disable-next-line
  'Access-Control-' + x[0].toUpperCase() + x.slice(1).replace(/[a-z][A-Z]/g, '$1-$2'),
  // eslint-disable-next-line
  '' + y
]);
