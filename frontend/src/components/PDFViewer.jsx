import { useEffect, useState } from "react";

export default function PDFViewer() {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    async function loadPdf() {
      const response = await fetch(
        "https://pdf-temp-files.s3.us-west-2.amazonaws.com/M5DLZI9YSPDNXQENKLXOZO5A0G2ZTJO9/top-3-quantity-report.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA4NRRSZPHPZV7KQXY%2F20260711%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260711T142229Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=66b2c6c1db5f52de176216ffa6cffee72c3edf15c2a587240d597cb50c8d4bc3",
      );
      const blob = await response.blob();
      setPdfUrl(URL.createObjectURL(blob));
    }

    loadPdf();
  }, []);

  return (
    pdfUrl && <iframe src={pdfUrl} width="100%" height="800" title="PDF" />
  );
}
