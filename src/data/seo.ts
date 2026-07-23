export interface PageSeo {
  seoTitle: string;
  description: string;
  keywords: string[];
  pageType?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage';
  additionalSchemas?: Record<string, unknown>[];
}

export const pageSeo: Record<string, PageSeo> = {
  home: {
    seoTitle: 'African Institute for Artificial Intelligence Policy | AIAIP',
    description: "Independent African research advancing responsible AI governance and ensuring African perspectives shape global artificial intelligence policy.",
    keywords: [
      'African AI policy research',
      'artificial intelligence governance Africa',
      'AI policy institute Africa',
      'African technology policy',
      'AI governance framework Africa',
      'African AI strategy',
      'AI regulation Africa',
      'AI policy advisory Africa',
    ],
  },
  about: {
    seoTitle: 'About AIAIP | Mission, Leadership & African AI Policy',
    description: "Learn about AIAIP, an independent African AI policy research institute producing evidence and policy tools for responsible governance across the continent.",
    keywords: [
      'African AI policy research institute',
      'AIAIP mission',
      'African AI governance',
      'AI policy experts Africa',
      'African technology policy leadership',
      'AI policy think tank Africa',
    ],
    pageType: 'AboutPage',
  },
  programs: {
    seoTitle: 'AI Policy Research, Advisory & Capacity Development | AIAIP',
    description: 'AIAIP provides independent AI policy research, institutional advisory, capacity development and policy dialogue for African decision-makers.',
    keywords: [
      'AI policy research Africa',
      'African AI strategy development',
      'AI governance advisory Africa',
      'African AI capacity building',
      'government AI advisory Africa',
      'AI regulatory framework Africa',
    ],
    additionalSchemas: [
      {
        '@type': 'OfferCatalog',
        name: 'AIAIP Policy and Research Capabilities',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Policy Research', category: 'AI Policy Research' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Policy Advisory', category: 'Institutional Advisory' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Capacity Development', category: 'Training and Development' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Convening and Dialogue', category: 'Policy Dialogue' } },
        ],
      },
    ],
  },
  getInvolved: {
    seoTitle: 'Work With AIAIP | African AI Policy Partnerships',
    description: "Partner with AIAIP to strengthen independent African AI policy research, institutional capability, public-interest networks and policy dialogue.",
    keywords: [
      'African AI research partnerships',
      'fund African AI governance',
      'collaborate AI policy Africa',
      'partner with AIAIP',
      'support African AI research',
      'AI research sponsorship Africa',
    ],
  },
  contact: {
    seoTitle: 'Contact AIAIP | African AI Policy Institute in Abuja',
    description: 'Contact AIAIP in Abuja for AI policy research partnerships, institutional advisory, media enquiries and general information.',
    keywords: [
      'contact AIAIP',
      'African AI policy institute contact',
      'AIAIP research partnerships',
      'AI policy advisory Africa contact',
      'AIAIP Abuja',
      'African AI research consultation',
    ],
    pageType: 'ContactPage',
  },
};
