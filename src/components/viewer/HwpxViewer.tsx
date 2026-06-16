import type { HwpxContent } from "@/types/document";

interface Props {
  content: HwpxContent;
}

export default function HwpxViewer({ content }: Props) {
  return (
    <article className="hwpx-viewer max-w-3xl mx-auto px-4 py-6">
      <header className="mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">{content.title}</h1>
        <p className="text-sm text-gray-500 mt-1">HWPX 문서</p>
      </header>
      {content.sections.map((section, si) => (
        <section key={si} className="mb-6">
          {section.paragraphs.map((para, pi) => {
            if (!para.text) return <div key={pi} className="h-4" />;
            const alignClass =
              para.align === "CENTER" ? "text-center" :
              para.align === "RIGHT" ? "text-right" :
              para.align === "JUSTIFY" ? "text-justify" : "text-left";
            return (
              <p key={pi} className={`mb-3 leading-relaxed text-gray-800 text-base ${alignClass}`}>
                {para.text}
              </p>
            );
          })}
        </section>
      ))}
    </article>
  );
}
