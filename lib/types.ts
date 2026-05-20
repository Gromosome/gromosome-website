export type Product = {
  name: string;
  logo: string;
  description: string;
  isAvailable: boolean;
  link: string;
};

export type Cta = {
  label: string;
  href: string;
};

export type ProductGridSection = {
  component: 'productGrid';
  title: string;
  subtitle: string;
  items: Product[];
};
