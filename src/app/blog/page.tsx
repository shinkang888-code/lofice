import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { LOFFICE_BLOG_POSTS } from "@/lib/lofficeUi/portal";
import "./blog-page.css";

export const metadata = {
  title: "블로그 — Loffice",
  description: "Loffice 사용 가이드, 팁, AI·문서 작업 노하우",
};

const TAG_COLORS: Record<string, string> = {
  가이드: "blog-tag--guide",
  AI: "blog-tag--ai",
  도구: "blog-tag--tool",
  PDF: "blog-tag--pdf",
};

export default function BlogPage() {
  return (
    <PortalShell active="blog">
      <main className="portal-page-main blog-page">
        <div className="portal-grid portal-grid--2 blog-grid">
          {LOFFICE_BLOG_POSTS.map((post) => (
            <Link key={post.title} href={post.href} className="blog-card portal-card">
              <span className={`blog-tag ${TAG_COLORS[post.tag] ?? ""}`}>
                <Tag className="size-3" />
                {post.tag}
              </span>
              <h2 className="blog-card-title">{post.title}</h2>
              <p className="blog-card-excerpt">{post.excerpt}</p>
              <div className="blog-card-foot">
                <span className="blog-read">
                  <Clock className="size-3.5" />
                  {post.readMin}분 읽기
                </span>
                <span className="blog-cta">
                  읽기
                  <ArrowRight className="size-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </PortalShell>
  );
}
