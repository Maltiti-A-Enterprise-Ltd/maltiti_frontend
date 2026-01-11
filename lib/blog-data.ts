export type BlogCategory =
  | 'Shea Butter'
  | 'Organic Products'
  | 'Traditional Knowledge'
  | 'Empowerment'
  | 'Sustainability'
  | 'Processing';

export type BlogPost = {
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  category: BlogCategory;
  tags: string[];
  featuredImage: string;
  author: string;
  publishDate: string;
  readingTime: number; // in minutes
  content: BlogContent[];
};

export type BlogContent =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3 | 4; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'list'; items: string[]; ordered?: boolean };

export const blogPosts: BlogPost[] = [
  {
    slug: 'yellow-shea-butter-borututu-traditional-processing',
    title: 'Yellow Shea Butter: The Role of Borututu in Traditional Shea Processing',
    subtitle: 'Discovering the ancient wisdom behind naturally colored shea butter',
    excerpt:
      'Learn how borututu bark transforms shea butter into its rich yellow form while preserving all its natural benefits and quality.',
    category: 'Traditional Knowledge',
    tags: ['Shea Butter', 'Borututu', 'Traditional Methods', 'African Medicine'],
    featuredImage: '/blog/yellow-shea-butter-borututu.webp',
    author: 'Maltiti Team',
    publishDate: '2026-01-03',
    readingTime: 5,
    content: [
      {
        type: 'paragraph',
        text: 'For centuries, communities across West Africa have perfected the art of shea butter processing, passing down invaluable knowledge from generation to generation. One of the most fascinating aspects of this tradition is the use of borututu bark to create naturally yellow shea butter—a product that embodies both cultural heritage and natural beauty.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'What is Borututu?',
      },
      {
        type: 'paragraph',
        text: 'Borututu is a traditional African medicine produced from the Cochlospermum angolense tree. Common in various regions of Angola and West Africa, it is known by different names across the continent. In Angola, it is referred to as "mburututu" in Chokwe and Kimbundu languages, while in Ghana, the bark is locally known as "pagajawu."',
      },
      {
        type: 'paragraph',
        text: 'This remarkable plant has been valued in traditional medicine for generations, primarily for its believed liver-supporting and cleansing properties. Today, borututu bark is widely used in herbal teas and natural health supplements across West Africa and increasingly in international markets.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'The Traditional Coloring Process',
      },
      {
        type: 'paragraph',
        text: 'In Ghana, borututu bark plays a unique role in the traditional shea butter processing method. When the bark is carefully added during the boiling stage of shea butter production, it imparts a rich, golden-yellow color to the butter. This transformation is purely natural and visual—a beautiful example of how nature provides its own palette.',
      },
      {
        type: 'paragraph',
        text: 'What makes this process particularly remarkable is its gentleness. Borututu does not alter the chemical composition of shea butter. Since the bark is completely edible and natural, its role is exclusively that of a natural colorant. The butter retains all its nourishing properties, beneficial fatty acids, and skin-loving vitamins—nothing is diminished or removed.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Yellow Shea Butter vs. White Shea Butter',
      },
      {
        type: 'paragraph',
        text: 'The primary difference between yellow shea butter and white shea butter lies in appearance, not composition. Both varieties offer the same moisturizing benefits, rich nutrient profile, and skin protection. The white variety is simply shea butter in its natural state after processing, while the yellow variety has been enhanced with borututu for aesthetic purposes.',
      },
      {
        type: 'paragraph',
        text: 'Some communities prefer yellow shea butter for its warm, inviting appearance, while others favor the pure, ivory tone of white shea butter. Both are authentic, high-quality products rooted in tradition.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Health and Wellness Connections',
      },
      {
        type: 'paragraph',
        text: 'Beyond its use in shea butter processing, borututu bark has earned respect in traditional medicine. It is commonly brewed into herbal teas believed to support liver health and promote internal cleansing. In recent years, laboratory studies have shown promising activity of borututu bark against Plasmodium berghei, a rodent malaria parasite, suggesting potential therapeutic applications worth further research.',
      },
      {
        type: 'paragraph',
        text: "While these medicinal applications are distinct from its use in shea butter production, they underscore the plant's versatility and the depth of knowledge held by traditional healers and processors.",
      },
      {
        type: 'heading',
        level: 2,
        text: 'A Testament to African Knowledge',
      },
      {
        type: 'paragraph',
        text: 'The use of borututu in shea butter processing is more than just a technique—it is a testament to the ingenuity and environmental wisdom of African communities. For generations, women in Northern Ghana and across the region have understood how to work with nature, using locally available plants to enhance their products without compromising quality or safety.',
      },
      {
        type: 'paragraph',
        text: 'This knowledge reflects a deep connection to the land, a respect for natural processes, and a commitment to creating products that are both beautiful and beneficial. At Maltiti A. Enterprise Ltd, we honor this tradition by supporting local women processors and ensuring that their expertise is recognized and valued.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Conclusion',
      },
      {
        type: 'paragraph',
        text: 'Borututu enriches shea butter visually without any known negative effects. The result is a naturally beautiful product that reflects centuries of African knowledge and tradition. Whether you choose yellow or white shea butter, you are connecting with a legacy of craftsmanship, sustainability, and community empowerment.',
      },
      {
        type: 'paragraph',
        text: 'At Maltiti, we believe that understanding the "why" behind our products helps you appreciate their true value. Yellow shea butter colored with borututu is not just a cosmetic choice—it is a celebration of heritage, nature, and the skilled hands of the women who create it.',
      },
    ],
  },
  {
    slug: 'white-vs-yellow-shea-butter-differences',
    title: 'The Difference Between White and Yellow Shea Butter',
    subtitle: 'Understanding the variations in appearance and processing',
    excerpt:
      'Discover the key differences between white and yellow shea butter, and learn which one is right for your skincare needs.',
    category: 'Shea Butter',
    tags: ['Shea Butter', 'Skincare', 'Natural Beauty'],
    featuredImage: '/blog/white-yellow-shea-comparison.svg',
    author: 'Maltiti Team',
    publishDate: '2026-01-02',
    readingTime: 4,
    content: [
      {
        type: 'paragraph',
        text: 'When shopping for authentic shea butter, you may notice products labeled as either "white" or "yellow" shea butter. Both are genuine, high-quality products, but understanding their differences can help you make the best choice for your needs.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Color: The Most Visible Difference',
      },
      {
        type: 'paragraph',
        text: 'As the names suggest, the most obvious distinction is color. White (or ivory) shea butter has a pale, cream-colored appearance, while yellow shea butter displays a rich golden hue. This difference stems from the processing method, not from the quality of the raw shea nuts.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Processing Methods',
      },
      {
        type: 'paragraph',
        text: 'White shea butter is processed using traditional methods without any colorants. After extraction, it naturally settles into an off-white or ivory color. Yellow shea butter undergoes an additional step where borututu bark or turmeric is added during processing to achieve its distinctive golden color.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Nutritional Content',
      },
      {
        type: 'paragraph',
        text: 'Both white and yellow shea butter contain the same beneficial fatty acids, vitamins A and E, and moisturizing properties. The colorant used in yellow shea butter does not diminish or enhance the nutritional profile—it simply adds color.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Which Should You Choose?',
      },
      {
        type: 'paragraph',
        text: 'Your choice between white and yellow shea butter largely comes down to personal preference. Both offer identical skincare benefits. Some people prefer the pure, natural appearance of white shea butter, while others appreciate the warm, golden tone of yellow shea butter.',
      },
      {
        type: 'paragraph',
        text: "At Maltiti, we produce both varieties using traditional methods, ensuring authenticity and quality in every batch. Whichever you choose, you're supporting sustainable practices and the women who craft these products with care.",
      },
    ],
  },
  {
    slug: 'empowering-women-northern-ghana-shea-butter',
    title: 'How Shea Butter Empowers Women in Northern Ghana',
    subtitle: 'Economic independence through traditional knowledge',
    excerpt:
      'Explore how shea butter production provides sustainable income and empowerment opportunities for women in Northern Ghana.',
    category: 'Empowerment',
    tags: ['Women Empowerment', 'Community', 'Economic Development', 'Ghana'],
    featuredImage: '/blog/women-empowerment-ghana.svg',
    author: 'Maltiti Team',
    publishDate: '2025-12-28',
    readingTime: 6,
    content: [
      {
        type: 'paragraph',
        text: 'In the rural communities of Northern Ghana, shea butter production is more than just a trade—it is a lifeline for thousands of women and their families. For generations, women have been the custodians of shea processing knowledge, transforming raw nuts into valuable butter that supports education, healthcare, and economic independence.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'A Women-Led Industry',
      },
      {
        type: 'paragraph',
        text: 'Shea butter production in Ghana is almost exclusively carried out by women. From harvesting the nuts to the final processing stages, women control every aspect of the production chain. This unique dynamic gives them both economic power and social recognition within their communities.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Economic Independence',
      },
      {
        type: 'paragraph',
        text: 'For many women in Northern Ghana, shea butter processing provides their primary source of income. This economic independence allows them to pay school fees for their children, access healthcare, invest in small businesses, and contribute meaningfully to household finances.',
      },
      {
        type: 'paragraph',
        text: 'Fair trade partnerships, like those championed by Maltiti A. Enterprise Ltd, ensure that women receive fair compensation for their labor and products. This creates sustainable income streams that can lift entire families out of poverty.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Preserving Traditional Knowledge',
      },
      {
        type: 'paragraph',
        text: 'The knowledge of shea processing is passed from mother to daughter, preserving centuries-old techniques. This intergenerational transfer of skills ensures that traditional wisdom remains alive while adapting to modern market demands.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Building Community',
      },
      {
        type: 'paragraph',
        text: 'Shea processing often occurs in cooperative settings where women work together, share knowledge, and support one another. These cooperatives become centers of social connection, mutual aid, and collective empowerment.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'The Maltiti Commitment',
      },
      {
        type: 'paragraph',
        text: 'At Maltiti A. Enterprise Ltd, we are deeply committed to supporting the women who make our products possible. We ensure fair pricing, provide training opportunities, and create market access that allows these skilled artisans to thrive. When you purchase our shea butter, you are directly contributing to the empowerment of women in Northern Ghana.',
      },
      {
        type: 'paragraph',
        text: 'Every jar of shea butter tells a story of resilience, skill, and community. By choosing authentic, ethically sourced products, you become part of that story—supporting traditions and transforming lives.',
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getRelatedPosts(slug: string, limit: number = 3): BlogPost[] {
  const currentPost = getBlogPost(slug);
  if (!currentPost) {
    return [];
  }

  return blogPosts
    .filter((post) => post.slug !== slug && post.category === currentPost.category)
    .slice(0, limit);
}

export function getAllCategories(): BlogCategory[] {
  return Array.from(new Set(blogPosts.map((post) => post.category)));
}
