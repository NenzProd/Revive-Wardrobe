import type { FC } from "react";
import { Link } from "react-router-dom";

const RelatedBlogs: FC = () => (
  <section className="py-12 text-center">
    <Link to="/blog" className="text-[#a51c30] hover:text-[#2a1b15] font-medium">
      Explore More Stories
    </Link>
  </section>
);

export default RelatedBlogs;
