interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

const canonicalHost = 'africanaipolicy.org';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === `www.${canonicalHost}` || url.hostname.endsWith('.workers.dev')) {
      url.protocol = 'https:';
      url.hostname = canonicalHost;
      url.port = '';
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
