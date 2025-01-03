import { adminLinks } from "./adminLinks";

interface Link {
  title: string;
  url: string;
  icon: React.ComponentType;
  isActive?: boolean;
  items?: Link[];
  permissions?: string[];
}
export const getSidebarLinks = (role: string) => {
  return filterLinksByPermissions(adminLinks, role);
};

const filterLinksByPermissions = (links: Link[], role: string): Link[] => {
  return links
    .filter((link) => !link.permissions || link.permissions.includes(role))
    .map((link) => {
      const filteredLink = { ...link };
      if (link.items) {
        const filteredItems = filterLinksByPermissions(link.items, role);
        if (filteredItems.length > 0) {
          filteredLink.items = filteredItems;
        } else {
          delete filteredLink.items;
        }
      }
      return filteredLink;
    });
};
