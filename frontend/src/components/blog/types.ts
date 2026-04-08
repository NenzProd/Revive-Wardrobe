export interface BlogSectionBase {
  type: string;
}

export interface IntroSection extends BlogSectionBase {
  type: "intro";
  heading?: string;
  content?: string;
}

export interface ImageTextSection extends BlogSectionBase {
  type: "imageText";
  image?: string;
  title?: string;
  content?: string;
}

export interface FabricCardItem {
  name?: string;
  image?: string;
  points?: string[];
  bestFor?: string;
}

export interface FabricCardsSection extends BlogSectionBase {
  type: "fabricCards";
  items?: FabricCardItem[];
}

export interface QuoteSection extends BlogSectionBase {
  type: "quote";
  text?: string;
}

export interface VideoSection extends BlogSectionBase {
  type: "video";
  url?: string;
}

export interface SplitSectionType extends BlogSectionBase {
  type: "splitSection";
  title?: string;
  image?: string;
  content?: string;
}

export interface TagsSection extends BlogSectionBase {
  type: "tags";
  title?: string;
  items?: string[];
}

export interface ProductItem {
  name?: string;
  price?: string;
  image?: string;
  link?: string;
}

export interface ProductsSection extends BlogSectionBase {
  type: "products";
  title?: string;
  items?: ProductItem[];
}

export interface CareSectionType extends BlogSectionBase {
  type: "care";
  title?: string;
  items?: string[];
}

export interface CTASectionType extends BlogSectionBase {
  type: "cta";
  heading?: string;
  content?: string;
  button?: string;
  buttonLink?: string;
}

export type StorySection =
  | IntroSection
  | ImageTextSection
  | FabricCardsSection
  | QuoteSection
  | VideoSection
  | SplitSectionType
  | TagsSection
  | ProductsSection
  | CareSectionType
  | CTASectionType
  | BlogSectionBase;
