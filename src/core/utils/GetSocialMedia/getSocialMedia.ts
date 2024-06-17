export const getSocialMedia = (
  link: Record<string, string>
): Record<string, string> => {
  const socialMediaMap: { [key: string]: string } = {};
  Object.values(link).forEach((url: string) => {
    if (typeof url === "string") {
      const lowercaseUrl = url.toLowerCase();
      const start = lowercaseUrl.indexOf(".") + 1;
      const end = lowercaseUrl.indexOf(".com");
      if (start !== -1 && end !== -1) {
        return (socialMediaMap[lowercaseUrl.substring(start, end)] = url);
      }
    }
  });

  return socialMediaMap;
};
