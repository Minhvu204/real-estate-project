// import React, { useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// import "react-pdf/dist/esm/Page/TextLayer.css";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.mjs",
//   import.meta.url
// ).toString();

// interface ViewContractProps {
//   pdfUrl: string;
// }

// const ViewContract: React.FC<ViewContractProps> = ({ pdfUrl }) => {
//   const [numPages, setNumPages] = useState<number>(0);
//   const [pageNumber, setPageNumber] = useState<number>(1);

//   const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
//     setNumPages(numPages);
//   };

//   return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//       <Document
//         file={pdfUrl}
//         onLoadSuccess={onDocumentLoadSuccess}
//         loading="Đang tải file hợp đồng..."
//       >
//         <Page pageNumber={pageNumber} />
//       </Document>
//       <p>
//         Trang {pageNumber} / {numPages}
//       </p>
//       <div>
//         <button
//           disabled={pageNumber <= 1}
//           onClick={() => setPageNumber((prev) => prev - 1)}
//         >
//           Trang trước
//         </button>
//         <button
//           disabled={pageNumber >= numPages}
//           onClick={() => setPageNumber((prev) => prev + 1)}
//         >
//           Trang tiếp
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ViewContract;
