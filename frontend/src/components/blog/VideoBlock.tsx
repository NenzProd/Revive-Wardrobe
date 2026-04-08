import type { FC } from "react";

interface VideoBlockProps {
  url?: string;
}

const VideoBlock: FC<VideoBlockProps> = ({ url }) => (
  <section className="py-16">
    <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-[#7b4d2e]/15 shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
      <iframe className="w-full h-[420px]" src={url} title="Blog Video" allowFullScreen />
    </div>
  </section>
);

export default VideoBlock;
