interface Props {
  text: string;
}

export default function TxtViewer({ text }: Props) {
  return (
    <article className="txt-viewer max-w-3xl mx-auto px-4 py-6">
      <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-gray-800">
        {text}
      </pre>
    </article>
  );
}
