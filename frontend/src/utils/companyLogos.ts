/**
 * Smart Official Brand Logo Resolver for Companies
 * Resolves exact official logo vector/PNGs from company domain/websites.
 */

const BRAND_DOMAIN_MAP: Record<string, string> = {
  'google': 'google.com',
  'microsoft': 'microsoft.com',
  'amazon': 'amazon.com',
  'tcs': 'tcs.com',
  'tata consultancy services': 'tcs.com',
  'infosys': 'infosys.com',
  'wipro': 'wipro.com',
  'hcl': 'hcltech.com',
  'hcltech': 'hcltech.com',
  'cognizant': 'cognizant.com',
  'tech mahindra': 'techmahindra.com',
  'accenture': 'accenture.com',
  'ibm': 'ibm.com',
  'adobe': 'adobe.com',
  'oracle': 'oracle.com',
  'salesforce': 'salesforce.com',
  'zomato': 'zomato.com',
  'swiggy': 'swiggy.com',
  'paytm': 'paytm.com',
  'flipkart': 'flipkart.com',
  'uber': 'uber.com',
  'cred': 'cred.club',
  'razorpay': 'razorpay.com',
  'jio': 'jio.com',
  'reliance': 'ril.com',
  'airtel': 'airtel.in',
  'ola': 'olacabs.com',
  'byju': 'byjus.com',
  'unacademy': 'unacademy.com',
  'deloitte': 'deloitte.com',
  'ey': 'ey.com',
  'ernst & young': 'ey.com',
  'kpmg': 'kpmg.com',
  'pwc': 'pwc.com',
  'pricewaterhousecoopers': 'pwc.com',
  'meta': 'meta.com',
  'facebook': 'meta.com',
  'apple': 'apple.com',
  'netflix': 'netflix.com',
  'nvidia': 'nvidia.com',
  'samsung': 'samsung.com',
  'phonepe': 'phonepe.com',
  'meesho': 'meesho.com',
  'zepto': 'zepto.com',
  'blinkit': 'blinkit.com',
  'urban company': 'urbancompany.com',
  'nykaa': 'nykaa.com',
  'policybazaar': 'policybazaar.com',
  'makemytrip': 'makemytrip.com',
  'make my trip': 'makemytrip.com',
  'goibibo': 'goibibo.com',
  'dream11': 'dream11.com',
  'lendingkart': 'lendingkart.com',
  'sharechat': 'sharechat.com',
  'postman': 'postman.com',
  'hasura': 'hasura.io',
  'freshworks': 'freshworks.com',
  'chargebee': 'chargebee.com',
  'browserstack': 'browserstack.com'
};

export function getExactCompanyLogoUrl(companyName: string, websiteUrl?: string, existingLogoUrl?: string): string {
  // If valid external brand URL already provided
  if (existingLogoUrl && existingLogoUrl.startsWith('http') && !existingLogoUrl.includes('unsplash')) {
    return existingLogoUrl;
  }

  const name = (companyName || '').toLowerCase().trim();

  // 1. Direct Brand Lookup
  for (const [key, domain] of Object.entries(BRAND_DOMAIN_MAP)) {
    if (name.includes(key)) {
      return `https://logo.clearbit.com/${domain}`;
    }
  }

  // 2. Extract domain from official website URL if provided
  if (websiteUrl) {
    try {
      const url = new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`);
      const host = url.hostname.replace(/^www\./, '');
      if (host && !host.includes('example.com') && !host.includes('demo')) {
        return `https://logo.clearbit.com/${host}`;
      }
    } catch {}
  }

  // 3. Clean company name into standard domain string
  const cleanName = name.replace(/[^a-z0-9]/g, '');
  if (cleanName.length > 2) {
    return `https://logo.clearbit.com/${cleanName}.com`;
  }

  return '';
}

export function getBackupGoogleFaviconUrl(companyName: string, websiteUrl?: string): string {
  const name = (companyName || '').toLowerCase().trim();
  for (const [key, domain] of Object.entries(BRAND_DOMAIN_MAP)) {
    if (name.includes(key)) {
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    }
  }

  if (websiteUrl) {
    try {
      const url = new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`);
      const host = url.hostname.replace(/^www\./, '');
      if (host && !host.includes('example.com')) {
        return `https://www.google.com/s2/favicons?domain=${host}&sz=128`;
      }
    } catch {}
  }

  const cleanName = name.replace(/[^a-z0-9]/g, '');
  return `https://www.google.com/s2/favicons?domain=${cleanName}.com&sz=128`;
}
