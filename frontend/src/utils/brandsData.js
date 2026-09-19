export const BRANDS = [
  {
    name: 'Nike',
    slug: 'nike',
    logo: '/brands/nike.svg',
    description: 'Just Do It — World leading athletic, running & sports footwear.'
  },
  {
    name: 'Adidas',
    slug: 'adidas',
    logo: '/brands/adidas.svg',
    description: 'Impossible Is Nothing — Iconic lifestyle sneakers and high-performance shoes.'
  },
  {
    name: 'Puma',
    slug: 'puma',
    logo: '/brands/puma.svg',
    description: 'Forever Faster — Cutting-edge dynamic trainers and athletic sports shoes.'
  },
  {
    name: 'Clarks',
    slug: 'clarks',
    logo: '/brands/clarks.svg',
    description: 'Heritage Craftsmanship — Premium handcrafted leather formal and oxford shoes.'
  },
  {
    name: 'Converse',
    slug: 'converse',
    logo: '/brands/converse.svg',
    description: 'Timeless Streetwear — Authentic canvas low-top & skate sneakers.'
  },
  {
    name: 'Skechers',
    slug: 'skechers',
    logo: '/brands/skechers.svg',
    description: 'Comfort Revolution — Ultra-light cushioned walking and cross-training shoes.'
  },
  {
    name: 'Woodland',
    slug: 'woodland',
    logo: '/brands/woodland.svg',
    description: 'Explore the Outdoors — Heavy-duty trekking boots and genuine suede loafers.'
  }
];

export const getBrandBySlug = (slug) => {
  if (!slug) return null;
  const clean = String(slug).trim().toLowerCase();
  return BRANDS.find((b) => b.slug.toLowerCase() === clean || b.name.toLowerCase() === clean);
};
