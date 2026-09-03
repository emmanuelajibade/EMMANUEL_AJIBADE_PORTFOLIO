import type { SocialLink } from "@/types/content";

export const publicPhone = "+234 9067502619";
export const publicFacebookUrl = "https://web.facebook.com/profile.php?id=61573178008542";
export const publicGithubUrl = "https://emmanuelajibade.github.io";
export const publicWhatsappUrl = "https://wa.me/2349067502619";
export const publicTelegramUrl = "https://t.me/+2349067502619";

const canonicalSocialLinks: SocialLink[] = [
  { platform: "Facebook", url: publicFacebookUrl },
  { platform: "GitHub", url: publicGithubUrl },
];

export function normalizePublicSocialLinks(links: SocialLink[] = []): SocialLink[] {
  const customLinks = links.filter(
    (link) =>
      link.platform.toLowerCase() !== "linkedin" &&
      !canonicalSocialLinks.some(
        (canonicalLink) => canonicalLink.platform.toLowerCase() === link.platform.toLowerCase()
      )
  );

  return [...canonicalSocialLinks, ...customLinks];
}
