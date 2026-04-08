import type { FC } from "react";
import BlogIntro from "./BlogIntro";
import ImageText from "./ImageText";
import FabricCards from "./FabricCards";
import QuoteBlock from "./QuoteBlock";
import VideoBlock from "./VideoBlock";
import SplitSection from "./SplitSection";
import TagSection from "./TagSection";
import ProductSection from "./ProductSection";
import CareSection from "./CareSection";
import CTASection from "./CTASection";
import type { StorySection } from "./types";

interface StorySectionRendererProps {
  sections: StorySection[];
}

const StorySectionRenderer: FC<StorySectionRendererProps> = ({ sections }) => (
  <>
    {sections.map((section, index) => {
      switch (section.type) {
        case "intro":
          return <BlogIntro key={index} heading={section.heading} content={section.content} />;
        case "imageText":
          return <ImageText key={index} image={section.image} title={section.title} content={section.content} />;
        case "fabricCards":
          return <FabricCards key={index} items={section.items} />;
        case "quote":
          return <QuoteBlock key={index} text={section.text} />;
        case "video":
          return <VideoBlock key={index} url={section.url} />;
        case "splitSection":
          return <SplitSection key={index} title={section.title} image={section.image} content={section.content} />;
        case "tags":
          return <TagSection key={index} title={section.title} items={section.items} />;
        case "products":
          return <ProductSection key={index} title={section.title} items={section.items} />;
        case "care":
          return <CareSection key={index} title={section.title} items={section.items} />;
        case "cta":
          return (
            <CTASection
              key={index}
              heading={section.heading}
              content={section.content}
              button={section.button}
              buttonLink={section.buttonLink}
            />
          );
        default:
          return null;
      }
    })}
  </>
);

export default StorySectionRenderer;
