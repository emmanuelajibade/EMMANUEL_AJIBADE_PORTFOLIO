// Public identity constants (edit these if values change)
export const publicPhone = "+234 9067502619";
export const publicWhatsappUrl = "https://wa.me/2349067502619";
export const publicTelegramUrl = "https://t.me/emmanuelajibade";
export const publicFacebookUrl = "https://facebook.com/emmanuelajibade";
export const publicGithubUrl = "https://github.com/emmanuelajibade";

// Normalize social links to only include the allowed public platforms
export function normalizePublicSocialLinks(
  links: { platform: string; url: string }[]
): { platform: string; url: string }[] {
  const allowed = ["GitHub", "LinkedIn", "Facebook", "Telegram", "WhatsApp"];
  return links.filter((link) => allowed.includes(link.platform));
}