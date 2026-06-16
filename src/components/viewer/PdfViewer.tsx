interface Props {
  url: string;
}

export default function PdfViewer({ url }: Props) {
  return (
    <div className="pdf-viewer h-full w-full">
      <iframe
        src={url}
        className="w-full h-full border-0"
        title="PDF 문서"
      />
    </div>
  );
}
