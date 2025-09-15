type VCardData = {
  prefix?: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  email?: string;
  company?: string; // Organization
  jobTitle?: string;
  street?: string;
  city?: string;
  region?: string;
  postcode?: string;
  country?: string;
  website?: string;
};

export function createVCard(data: VCardData): string {
  const {
    prefix,
    firstName,
    lastName,
    phone,
    email,
    company,
    jobTitle,
    street,
    city,
    region,
    postcode,
    country,
    website,
  } = data;

  let vCard = "BEGIN:VCARD\n";
  vCard += "VERSION:3.0\n";
  vCard += `N:${lastName || ''};${firstName};;${prefix || ''};\n`;
  vCard += `FN:${[prefix, firstName, lastName].filter(Boolean).join(' ')}\n`;
  
  if (company) {
    vCard += `ORG:${company}\n`;
  }
  if (jobTitle) {
    vCard += `TITLE:${jobTitle}\n`;
  }
  if (phone) {
    vCard += `TEL;TYPE=WORK,VOICE:${phone}\n`;
  }
  if (email) {
    vCard += `EMAIL:${email}\n`;
  }

  if (street || city || region || postcode || country) {
    const addressParts = [
        '', // pobox
        '', // extended-address
        street || '',
        city || '',
        region || '',
        postcode || '',
        country || ''
    ];
    vCard += `ADR;TYPE=WORK:${addressParts.join(';')}\n`;
  }

  if (website) {
    vCard += `URL:${website}\n`;
  }

  vCard += "END:VCARD";

  return vCard;
}
