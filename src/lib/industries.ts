export interface Industry {
  name: string;
  blurb: string;      // short — used on homepage preview
  longBlurb: string;  // longer — used on /industries page
}

export const industries: Industry[] = [
  {
    name: "Pharma",
    blurb: "Regulated manufacturing, quality, and compliance.",
    longBlurb:
      "Regulated manufacturing, quality systems, and compliance workflows where mistakes have real consequences. Our engineering practices are built around audit and validation from the start.",
  },
  {
    name: "Life Sciences",
    blurb: "Research, clinical, and lab operations at scale.",
    longBlurb:
      "Deep familiarity with research and lab operations, where data integrity and traceability aren't optional. We build AI systems that respect the rigor this field demands.",
  },
  {
    name: "Financial Services",
    blurb: "Regulatory reporting, risk, and transaction systems under strict compliance demands.",
    longBlurb:
      "Regulatory reporting, risk management, and transaction processing where compliance and auditability aren't optional. We build AI systems your risk and compliance teams can actually sign off on.",
  },
  {
    name: "Insurance",
    blurb: "Underwriting, claims, and risk operations.",
    longBlurb:
      "Underwriting, claims, and risk operations where accuracy and explainability matter as much as speed. We help teams apply AI without compromising the controls the business relies on.",
  },
  {
    name: "Retail",
    blurb: "Store systems, e-commerce, and supply chain operations.",
    longBlurb:
      "25 years of experience keeping store systems, e-commerce platforms, and supply chains running at scale. We know how AI has to fit around peak-season traffic and razor-thin tolerance for downtime.",
  },
  {
    name: "Cybersecurity",
    blurb: "Threat operations and secure-by-design engineering.",
    longBlurb:
      "Threat operations and secure-by-design engineering are in our background, not an afterthought. Every system we build is engineered with security as a first-class requirement.",
  },
  {
    name: "Hospitality",
    blurb: "Operations, safety, and logistics under tight margins.",
    longBlurb:
      "Operations, safety, and logistics under tight margins and constant operational pressure. We design AI support that fits real-world operational tempo, not a lab environment.",
  },
];
