interface Props {
  html: string;
}

export default function DocxViewer({ html }: Props) {
  return (
    <article className="docx-viewer max-w-3xl mx-auto px-4 py-6">
      <div
        className="prose prose-gray max-w-none
          prose-headings:text-gray-900 prose-p:text-gray-800 prose-p:leading-relaxed
          prose-table:border prose-td:border prose-td:px-3 prose-td:py-2
          prose-th:border prose-th:px-3 prose-th:py-2 prose-th:bg-gray-50"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
