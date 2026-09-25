interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

const canonicalHost = 'africanaipolicy.org';

const legacyRedirects = new Map<string, string>([
  ['/home', '/'],
  ['/about-us', '/about/'],
  ['/what-we-do', '/programs/'],
  ['/african-ai-economic-index', '/research/ai-economy-work-innovation/'],
  ['/donor-dashboard', '/campaign/gsu-ai-risk-conference/'],
  ['/donation-confirmation', '/donation-thank-you/'],
  ['/impact', '/about/'],
  ['/take-action', '/get-involved/'],
  ['/training-services', '/programs/'],
  ['/donate-now', '/campaign/gsu-ai-risk-conference/'],
  ['/causes', '/get-involved/'],
  ['/social-support', '/get-involved/'],
  ['/host-an-event', '/get-involved/'],
  ['/volunteer', '/get-involved/'],
  ['/join', '/get-involved/'],
  ['/research/state-of-ai-in-africa', '/research/ai-economy-work-innovation/'],
  ['/research/ai-governance-in-africa', '/research/ai-governance-institutions/'],
  ['/research/data-for-development', '/research/ai-infrastructure-sovereignty/'],
  ['/research/ai-skills-for-the-future', '/research/ai-economy-work-innovation/'],
  ['/campaign', '/campaign/gsu-ai-risk-conference/'],
]);

const retiredWordPressPaths = new Set([
  '/category/blog-single',
  '/portfolio/the-portraits',
  '/portfolio-category/masonry',
  '/portfolio-category/branding',
  '/portfolio-category/custom-print',
  '/portfolio/nike-shopping',
  '/portfolio/photo-retouching',
  '/portfolio/kontrast',
  '/portfolio/mercedez-benz-coupe',
  '/utilizing-mobile-technology-in-the-field',
  '/covid-19-guidelines',
  '/success-story-businessman-in-harlem',
  '/tackle-climate-change',
  '/author/devafricanaipolicy-org/page/2',
]);

const canonicalPagePaths = new Set([
  '/about',
  '/campaign/gsu-ai-risk-conference',
  '/contact',
  '/donation-thank-you',
  '/get-involved',
  '/insights',
  '/observatory',
  '/privacy',
  '/programs',
  '/research',
  '/research/ai-economy-work-innovation',
  '/research/ai-governance-institutions',
  '/research/ai-infrastructure-sovereignty',
  '/research/ai-rights-safety-society',
  '/terms',
  '/thank-you',
]);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    const shouldCanonicalizeHost = url.hostname === `www.${canonicalHost}` || url.hostname.endsWith('.workers.dev');
    if (shouldCanonicalizeHost) {
      url.protocol = 'https:';
      url.hostname = canonicalHost;
      url.port = '';
    }

    const normalizedPath = url.pathname !== '/' ? url.pathname.replace(/\/+$/, '') : '/';
    const legacyTarget = legacyRedirects.get(normalizedPath.toLowerCase());
    if (legacyTarget) {
      url.pathname = legacyTarget;
      url.search = '';
      url.hash = '';
      return Response.redirect(url.toString(), 301);
    }

    if (normalizedPath === '/sitemap.xml') {
      url.pathname = '/sitemap-index.xml';
      url.search = '';
      url.hash = '';
      return Response.redirect(url.toString(), 301);
    }

    if (retiredWordPressPaths.has(normalizedPath.toLowerCase())) {
      return new Response('Gone', {
        status: 410,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Robots-Tag': 'noindex',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    if (canonicalPagePaths.has(normalizedPath) && !url.pathname.endsWith('/')) {
      url.pathname = `${normalizedPath}/`;
      return Response.redirect(url.toString(), 301);
    }

    if (shouldCanonicalizeHost) {
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
