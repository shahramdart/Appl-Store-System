import React, { useState, useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

function BarcodeList() {
  const [barcodeValue, setBarcodeValue] = useState("");
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current && barcodeValue) {
      JsBarcode(barcodeRef.current, barcodeValue, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 100, // Adjust the height here to make the barcode larger or smaller
        displayValue: true,
      });
    }
  }, [barcodeValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setBarcodeValue(formData.get("barcode"));
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=600,height=400");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode</title>
        </head>
        <body>
          <div style="text-align: center;">
            <svg id="barcodeToPrint" width="100%" height="100"></svg>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js"></script>
          <script>
            JsBarcode("#barcodeToPrint", "${barcodeValue}", {
              format: "CODE128",
              lineColor: "#000",
              width: 2,
              height: 100,
              displayValue: true
            });
            window.print();
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col justify-center items-center p-6 bg-white shadow-lg w-[30%] min-h-[200px] max-h-[500px] rounded-lg">
        <span className="text-2xl font-primaryRegular">
          باڕکۆد دروستکەری کۆد کرافت
        </span>
        {barcodeValue && (
          <>
            <svg ref={barcodeRef} className="w-full h-auto"></svg>
            <button
              onClick={handlePrint}
              className="mt-6 font-primaryRegular flex-row justify-center w-36 items-center rounded-md bg-slate-800 py-3 px-4 border border-transparent text-center text-lg text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              Print Barcode
            </button>
          </>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col mt-12 justify-center items-center"
        >
          <input
            type="text"
            name="barcode"
            className="flex-2 peer bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-4 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow rtl:text-right"
            placeholder="ژمارەی باڕکۆد بنوسە"
            required
          />
          <button
            type="submit"
            className="flex mt-12 font-primaryRegular flex-row justify-center w-36 items-center rounded-md bg-slate-800 py-3 px-4 border border-transparent text-center text-lg text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none "
          >
            بەرهەم هێنان
          </button>
        </form>
      </div>
    </div>
  );
}

export default BarcodeList;
