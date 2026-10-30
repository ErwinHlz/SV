export type SponsorInquiry = {
  name: string;
  email: string;
  company: string;
  interest: string;
  message: string;
};

export const buildSponsorMailto = (to: string, inquiry: SponsorInquiry) => {
  const subject = `Sponsoring-Anfrage${inquiry.interest ? ` - ${inquiry.interest}` : ""}`;
  const body = [
    `Name: ${inquiry.name}`,
    `E-Mail: ${inquiry.email}`,
    `Unternehmen: ${inquiry.company || "-"}`,
    `Interesse: ${inquiry.interest || "-"}`,
    "",
    "Nachricht:",
    inquiry.message,
  ].join("\n");

  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
