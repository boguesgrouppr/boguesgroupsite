type ServiceSection = {
  title: string;
  tagline?: string;
  description: string;
};

type ServiceContent = {
  tagline: string;
  introduction: string[];
  sections: ServiceSection[];
  deliverables?: string[];
  closingTitle?: string;
  closing?: string;
  process?: ServiceSection[];
};

const serviceContent: Record<string, ServiceContent> = {
  "public-relations": {
    tagline: "Earned media that drives ROI",
    introduction: [
      "Build trust, shape perception, and keep your brand at the center of the conversation. Our PR strategies help organizations earn credibility through thoughtful communications, strong media relationships, and proactive reputation management.",
    ],
    sections: [
      { title: "Strategy & Planning", tagline: "Every great campaign starts with a plan.", description: "Intentional communication starts with a strategy, not a press release. We develop customized communications plans that align with your business goals, identify key audiences, uncover opportunities, and provide a clear roadmap for building visibility and long-term brand credibility." },
      { title: "Messaging & Positioning", tagline: "Say the right thing to the right audience.", description: "The way your organization communicates shapes how it's perceived. We refine your messaging, define your brand voice, and develop positioning that clearly communicates your value, differentiates you from competitors, and resonates with the audiences you want to reach." },
      { title: "Media Relations", tagline: "Build relationships. Earn attention.", description: "Meaningful media coverage starts with meaningful stories. We leverage strong media relationships, craft compelling pitches and press materials, and secure earned coverage that strengthens your reputation, expands your reach, and keeps your organization top of mind." },
      { title: "Crisis Management", tagline: "Prepare before it matters most.", description: "When the unexpected happens, every message matters. We help organizations prepare for and navigate challenging situations with strategic communications that protect their reputation, maintain stakeholder trust, and keep teams aligned before, during, and after a crisis." },
    ],
  },
  marketing: {
    tagline: "Marketing that moves brands forward.",
    introduction: [
      "Today's marketing is more than creating content, it's about building meaningful connections that inspire action. At Bogues Group, we develop integrated marketing strategies that combine data, creativity, and storytelling to help organizations increase visibility, strengthen their brand, and achieve measurable business results.",
      "Whether you're launching a campaign, growing your digital presence, or building long-term brand awareness, our team creates customized solutions designed around your goals and your audience.",
    ],
    sections: [
      { title: "Brand Strategy", tagline: "Build with intention.", description: "A strong brand starts with a clear strategy. We help organizations define their positioning, refine their messaging, and create a foundation that guides every campaign, customer interaction, and marketing decision." },
      { title: "Campaign Strategy", tagline: "Strategy that drives action.", description: "Every campaign should have a purpose. We develop integrated marketing campaigns that combine creative storytelling with data-driven insights to increase awareness, generate engagement, and support measurable business objectives." },
      { title: "Content Marketing", tagline: "Tell stories that build trust.", description: "Content should educate, inspire, and create value, not just fill a content calendar. We develop blogs, newsletters, articles, thought leadership, email campaigns, and long-form content that positions your organization as an industry leader while supporting your overall marketing strategy." },
      { title: "Social Media Marketing", tagline: "Create conversations that matter.", description: "Your audience expects more than consistent posting. They expect authentic engagement. We develop platform-specific social media strategies, create compelling content, manage online communities, and analyze performance to help brands grow with purpose." },
      { title: "Influencer & Creator Partnerships", tagline: "Build authentic connections.", description: "The right partnerships build credibility. We identify creators and influencers who align with your brand, manage collaborations from start to finish, and develop campaigns that expand your reach through trusted voices and authentic storytelling." },
      { title: "Content Creation", tagline: "Bring your brand to life.", description: "Powerful marketing starts with high-quality creative. From photography and video production to graphic design, copywriting, and short-form content, we create assets that elevate your brand and perform across every platform." },
      { title: "Digital Marketing", tagline: "Reach the right audience.", description: "We help brands maximize their digital presence through email marketing, search engine optimization (SEO), paid advertising, website content, and performance reporting, ensuring every marketing effort supports long-term growth." },
    ],
  },
  "crisis-management": {
    tagline: "Protect your reputation before, during, and after a crisis.",
    introduction: ["A crisis can unfold in minutes, but its impact can last for years. At Bogues Group, we help organizations prepare for the unexpected through strategic planning, rapid-response communications, and experienced counsel. Whether responding to a public issue, organizational challenge, or high-profile event, we help leaders communicate with clarity, protect stakeholder trust, and navigate complex situations with confidence."],
    sections: [
      { title: "Crisis Planning", tagline: "Prepare before it matters most.", description: "The most effective crisis response begins long before a crisis occurs. We work with organizations to identify potential risks, develop customized crisis communication plans, establish response protocols, and ensure leadership teams are prepared to act quickly when every decision matters." },
      { title: "Crisis Communications", tagline: "Respond with confidence.", description: "During a crisis, every message shapes public perception. We develop timely, strategic communications for employees, customers, media, partners, and stakeholders that provide clarity, maintain trust, and ensure consistent messaging across every communication channel." },
      { title: "Media Response", tagline: "Manage the conversation.", description: "Media attention can escalate quickly during a crisis. We prepare official statements, coordinate media inquiries, develop key messaging, and work alongside leadership to ensure your organization's voice remains credible, consistent, and strategic." },
      { title: "Executive Communications", tagline: "Lead with clarity.", description: "Leadership communication is often the difference between uncertainty and confidence. We coach executives and spokespersons to communicate effectively under pressure, deliver difficult messages with transparency, and represent their organizations with confidence." },
      { title: "Reputation Recovery", tagline: "Rebuild trust.", description: "Recovery doesn't end when the headlines fade. We help organizations restore confidence through proactive communications, stakeholder engagement, media relations, and strategic storytelling that reinforces credibility and strengthens long-term reputation." },
    ],
    closingTitle: "Why Organizations Choose Bogues Group",
    closing: "Every crisis is different, but the need for trusted guidance remains the same. Our team combines strategic communications, public relations expertise, and rapid-response planning to help organizations make informed decisions, communicate effectively, and protect the reputation they've worked hard to build.",
    process: [
      { title: "Identify", description: "Assess the situation, understand the risks, and gather the facts." },
      { title: "Plan", description: "Develop strategic messaging, response protocols, and communication priorities." },
      { title: "Respond", description: "Communicate quickly, consistently, and confidently with every audience." },
      { title: "Recover", description: "Rebuild trust through thoughtful reputation management and ongoing stakeholder engagement." },
    ],
  },
  "media-relations": {
    tagline: "Turn meaningful stories into meaningful coverage.",
    introduction: ["Strong media relationships are built on trust, strategy, and stories worth telling. At Bogues Group, we help organizations connect with journalists, producers, editors, and industry publications to secure earned media coverage that builds credibility, strengthens reputation, and keeps your brand part of the conversations that matter most."],
    sections: [
      { title: "Media Strategy", tagline: "Every story deserves a strategy.", description: "Successful media relations start long before the pitch. We identify newsworthy opportunities, develop key messaging, and create media strategies that align with your business objectives while positioning your organization as a trusted industry resource." },
      { title: "Press Outreach", tagline: "Get your story in the right hands.", description: "Our team develops compelling press releases, media advisories, and customized pitches designed to capture journalists' attention. Through strategic outreach and trusted media relationships, we secure earned coverage that increases visibility and reinforces your organization's credibility." },
      { title: "Media Training", tagline: "Speak with confidence.", description: "Whether preparing for a television interview, podcast appearance, press conference, or keynote presentation, we help executives and spokespersons communicate with confidence, stay on message, and represent their organization effectively under pressure." },
      { title: "Thought Leadership", tagline: "Position your expertise.", description: "Industry leaders don't wait for opportunities, they create them. We help executives and organizations build credibility through bylined articles, expert commentary, speaking engagements, award submissions, and proactive media opportunities that elevate their voice within the industry." },
      { title: "Relationship Building", tagline: "Relationships create opportunities.", description: "Media relations is about more than sending pitches. We build and maintain relationships with journalists, editors, producers, influencers, and industry publications to create opportunities for meaningful, long-term media engagement." },
      { title: "Press Events & Media Coordination", tagline: "Create moments that earn attention.", description: "From press conferences and media tours to product launches and community events, we coordinate media logistics, manage press attendance, and ensure every event is positioned for maximum visibility and meaningful coverage." },
    ],
    closingTitle: "Why Media Relations Matters",
    closing: "Earned media remains one of the most trusted forms of communication because it builds credibility that advertising alone cannot. A strategic media relations program helps organizations increase brand awareness, strengthen public trust, establish thought leadership, and generate meaningful visibility through authentic third-party endorsements.",
    deliverables: ["Strategic media planning", "Press releases & media advisories", "Journalist & producer outreach", "Media training for executives", "Thought leadership strategy", "Press conference coordination", "Interview preparation", "Award & speaking opportunity support"],
  },
  "digital-marketing": {
    tagline: "Turn digital strategy into measurable growth.",
    introduction: ["A strong digital presence is more than having a website or running ads. It's about creating a connected strategy that attracts the right audience, generates qualified leads, and delivers measurable business results. At Bogues Group, we combine data, creativity, and performance marketing to help organizations increase visibility, improve engagement, and grow with confidence."],
    sections: [
      { title: "Search Engine Optimization (SEO)", tagline: "Get found by the right audience.", description: "Your customers are already searching for the products and services you offer. We optimize your website through keyword strategy, technical SEO, on-page optimization, and content development to improve search rankings, increase organic traffic, and drive long-term visibility." },
      { title: "Paid Digital Advertising", tagline: "Reach the people most likely to convert.", description: "Digital advertising allows you to reach highly targeted audiences with measurable precision. From Google Ads to paid social campaigns, we develop advertising strategies that maximize your budget, increase qualified traffic, and generate meaningful business results." },
      { title: "Email Marketing", tagline: "Stay connected beyond the first click.", description: "Email remains one of the most effective tools for nurturing customer relationships. We create strategic email campaigns that educate, engage, and convert while keeping your brand top of mind throughout the customer journey." },
      { title: "Website Strategy & Optimization", tagline: "Turn visitors into customers.", description: "Your website should be your hardest-working marketing tool. We optimize user experience, website content, messaging, and calls to action to create a seamless digital experience that supports lead generation and growth." },
      { title: "Analytics & Performance Reporting", tagline: "Measure what matters.", description: "Every successful campaign starts with meaningful insights. We track key performance indicators, analyze customer behavior, and provide actionable reporting that helps refine strategy and improve marketing performance over time." },
      { title: "Digital Campaign Strategy", tagline: "Every click should have a purpose.", description: "Successful digital marketing isn't about running isolated campaigns. It's about building a connected strategy. We integrate SEO, paid advertising, email marketing, website optimization, and analytics into cohesive campaigns that work together to support your business objectives." },
    ],
    deliverables: ["Search Engine Optimization (SEO)", "Google Ads & Paid Media", "Website Strategy & Optimization", "Email Marketing", "Digital Campaign Planning", "Analytics & Performance Reporting", "Audience Targeting", "Conversion Optimization"],
    closingTitle: "Why Choose Bogues Group?",
    closing: "Digital marketing should do more than generate clicks, it should drive meaningful business growth. By combining strategic planning with performance-driven execution, we help organizations reach the right audiences, make informed decisions through data, and build digital marketing programs that deliver measurable, long-term results.",
  },
  "strategy-planning": {
    tagline: "Build a communications strategy with purpose.",
    introduction: ["Successful communications don't happen by chance, they're built on a clear strategy. At Bogues Group, we partner with organizations to develop research-driven communications plans that align with business objectives, define clear messaging, and create a roadmap for meaningful engagement. Every recommendation is grounded in insight, designed to support your goals, and built to deliver measurable impact."],
    sections: [
      { title: "Research & Discovery", tagline: "Insight drives every decision.", description: "Every successful strategy begins with understanding the landscape. We evaluate your organization, industry, competitors, stakeholders, and communications environment to identify opportunities, anticipate challenges, and build a strong strategic foundation." },
      { title: "Communications Strategy", tagline: "Align your message with your mission.", description: "Your communications strategy should support every business objective. We develop customized strategic plans that define priorities, establish key messages, identify communication channels, and create a clear roadmap for reaching your audiences effectively." },
      { title: "Audience & Stakeholder Planning", tagline: "Reach the audiences that matter most.", description: "Understanding who you're trying to reach is just as important as what you're trying to say. We identify key audiences, analyze stakeholder needs, and develop targeted communication strategies that foster stronger relationships and meaningful engagement." },
      { title: "Campaign Planning", tagline: "Turn strategy into action.", description: "A great strategy only works when it's executed effectively. We translate planning into actionable communications campaigns that integrate public relations, media outreach, digital communications, events, and community engagement into one cohesive approach." },
      { title: "Measurement & Optimization", tagline: "Refine through results.", description: "Communications strategies should evolve alongside your organization. We establish measurable goals, evaluate campaign performance, and use insights to optimize future communications, ensuring every effort continues to support your business objectives." },
    ],
    deliverables: ["Strategic communications planning", "Communications audits", "Audience and stakeholder analysis", "Competitive research", "Messaging frameworks", "Campaign planning", "Communications roadmaps", "Performance measurement & reporting"],
    closingTitle: "Why Strategy Matters",
    closing: "The strongest communications programs start with a plan. By combining research, strategic thinking, and thoughtful execution, we help organizations communicate with greater purpose, build stronger relationships, and achieve lasting business results.",
  },
  "branding-and-website-design": {
    tagline: "Build a brand that people recognize, trust, and remember.",
    introduction: ["Your brand is more than a logo or a website, it serves as the experience people have every time they interact with your organization. At Bogues Group, we combine strategic brand development, creative design, and user-focused digital experiences to help organizations build brands that are memorable, authentic, and positioned for long-term growth.", "From defining your brand identity to designing high-performing websites, we create cohesive experiences that strengthen your presence both online and offline."],
    sections: [
      { title: "Brand Strategy", tagline: "Start with a strong foundation.", description: "Every successful brand begins with a clear strategy. We work with organizations to define their mission, positioning, target audiences, and brand personality, creating a strategic foundation that guides every communication and customer interaction." },
      { title: "Logo & Visual Identity", tagline: "Design with purpose.", description: "A logo is only one part of a larger visual identity. We create cohesive brand systems, including logos, typography, color palettes, imagery, and graphic elements, communicating who you are and creating lasting recognition across every platform." },
      { title: "Brand Messaging", tagline: "Give your brand a voice.", description: "How your brand sounds is just as important as how it looks. We develop messaging frameworks, key messages, taglines, and brand voice guidelines that ensure every conversation reflects your organization's personality and values." },
      { title: "Website Design", tagline: "Create a digital experience that performs.", description: "Your website should work as a strategic business tool, not just be visually appealing. We design websites that prioritize user experience, accessibility, performance, and conversion while accurately reflecting your brand." },
      { title: "Website Optimization & SEO", tagline: "Build for people and search engines.", description: "Beautiful websites deserve to be discovered. We develop SEO-friendly website architecture, optimize content, improve site performance, and implement best practices that help your business rank higher in search results while delivering an exceptional user experience." },
      { title: "Brand Activation", tagline: "Bring your brand to life.", description: "A brand is strongest when people experience it firsthand. We develop strategic brand activations, community events, partnerships, experiential marketing campaigns, and launch initiatives that create meaningful connections between your organization and your audience. Whether you're introducing a new brand, launching a product, or building long-term awareness, we create experiences that inspire engagement and strengthen brand loyalty." },
      { title: "Brand Management", tagline: "Stay consistent as you grow.", description: "As your organization evolves, consistency becomes even more important. We provide ongoing creative support, brand governance, and design resources to ensure your messaging and visual identity remain cohesive across every touchpoint." },
    ],
    deliverables: ["Brand Strategy", "Brand Positioning", "Logo Design", "Visual Identity Systems", "Brand Guidelines", "Messaging Frameworks", "Website Design", "Website Copywriting", "SEO Optimization", "UX & Conversion Strategy", "Brand Activations", "Creative Asset Development"],
    closingTitle: "Why Branding Matters",
    closing: "A strong brand creates confidence before a conversation ever begins. When your strategy, messaging, design, and digital experience work together, your organization becomes more recognizable, more credible, and more memorable. At Bogues Group, we build brands that don't just look great, but communicate purpose, inspire trust, and support long-term growth.",
  },
  "experiential-marketing-and-events": {
    tagline: "Create experiences that people remember.",
    introduction: ["Today's audience expects more than advertising. They crave authentic and memorable experiences. At Bogues Group, we design and execute experiential marketing campaigns and events that bring brands to life, foster meaningful connections, and inspire action. Whether launching a new product, activating a sponsorship, or engaging a local community, we create experiences that align with your goals and leave a lasting impact."],
    sections: [
      { title: "Event Strategy", tagline: "Every experience starts with a purpose.", description: "Successful events don't happen by chance. We work with organizations to define clear objectives, understand target audiences, and develop strategic event concepts that align with business goals while creating memorable attendee experiences." },
      { title: "Brand Activations", tagline: "Bring your brand to life.", description: "Experiential marketing allows people to interact with your brand in meaningful ways. We create immersive brand activations, product launches, pop-up experiences, and interactive campaigns that spark curiosity, encourage participation, and strengthen brand awareness." },
      { title: "Event Planning & Production", tagline: "From concept to execution.", description: "Our team manages every stage of the event process, from planning and logistics to vendor coordination and on-site execution. Whether it's a corporate event, community festival, ribbon cutting, conference, or sporting event, we ensure every detail supports a seamless experience." },
      { title: "Sponsorship & Partnership Activations", tagline: "Maximize every partnership.", description: "A sponsorship is only valuable if people experience it. We help organizations activate sponsorships through creative experiences, branded installations, community engagement, and integrated campaigns that extend the impact of every partnership." },
      { title: "Community Engagement", tagline: "Build relationships beyond the event.", description: "The strongest brands become part of the communities they serve. We create events and engagement initiatives that encourage participation, strengthen relationships, and build lasting trust with customers, partners, and stakeholders." },
      { title: "Event Promotion", tagline: "Build momentum before, during, and after.", description: "An event's success depends on more than what happens on event day. We develop integrated promotional strategies including public relations, social media, influencer partnerships, email marketing, and digital campaigns, maximizing attendance, increasing engagement, and extending the life of every activation." },
    ],
    deliverables: ["Experiential Marketing Campaigns", "Brand Activations", "Event Strategy & Planning", "Event Production & Logistics", "Sponsorship Activations", "Community Engagement Programs", "Corporate Events & Conferences", "Product Launches", "Grand Openings & Ribbon Cuttings", "Event Marketing & Promotion", "Vendor & Partner Coordination", "Post-Event Measurement & Reporting"],
    closingTitle: "Why Experiential Marketing Matters",
    closing: "The most successful brands create experiences. Experiential marketing transforms audiences from passive observers into active participants, building stronger emotional connections, increasing brand awareness, and creating memorable moments that inspire long-term loyalty. At Bogues Group, we design experiences that connect people to brands in ways that traditional marketing simply can't.",
  },
};

export function getServiceContent(slug: string): string | undefined {
  const service = serviceContent[slug];
  if (!service) return undefined;

  const sections = service.sections.map(({ title, tagline, description }) => `
    <section>
      <h3>${title}</h3>
      ${tagline ? `<p><strong>${tagline}</strong></p>` : ""}
      <p>${description}</p>
    </section>`).join("");
  const deliverables = service.deliverables ? `<section><h2>What We Deliver</h2><ul>${service.deliverables.map((item) => `<li>${item}</li>`).join("")}</ul></section>` : "";
  const closing = service.closing && service.closingTitle ? `<section><h2>${service.closingTitle}</h2><p>${service.closing}</p></section>` : "";
  const process = service.process ? `<section><h2>Process Map</h2><p><strong>Identify -&gt; Plan -&gt; Respond -&gt; Recover</strong></p>${service.process.map(({ title, description }) => `<h3>${title}</h3><p>${description}</p>`).join("")}</section>` : "";

  return `<h2>${service.tagline}</h2>${service.introduction.map((paragraph) => `<p>${paragraph}</p>`).join("")}${sections}${deliverables}${closing}${process}`;
}
