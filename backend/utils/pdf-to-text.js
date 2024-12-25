import { PDFExtract } from "pdf.js-extract";

// Function to extract text from a PDF file
const extractTextFromPdf = (pdfPath) => {
    console.log("extracting...");
    const pdfExtract = new PDFExtract();

    return new Promise((resolve, reject) => {
        pdfExtract.extract(pdfPath, {}, (err, data) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }

            let extractedText = "";
            data.pages.forEach((page) => {
                page.content.forEach((item) => {
                    extractedText += item.str + " ";
                });
            });

            resolve(extractedText.trim()); // Return the extracted text
        });
    });
};

export default extractTextFromPdf;
