// QR Code Display Component
interface QRCodeDisplayProps {
  qrCodes: any[];
  onDownload: (qrCode: any) => void;
}

export default function QRCodeDisplay({ qrCodes, onDownload }: QRCodeDisplayProps) {
  const animations = ['fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom-in', 'flip-up'];
  const durations = ['duration-fast', 'duration-normal', 'duration-light-slow', 'duration-slow', 'duration-very-slow'];

  const renderQRPreview = (qrCode: any) => {
    if (qrCode.format === 'svg') {
      // For SVG, render as data URL
      const svgBlob = new Blob([qrCode.qrCodeData], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);
      return (
        <img
          src={svgUrl}
          alt={`QR Code for ${qrCode.sku?.code}`}
          className="w-full h-auto mb-3"
          onLoad={() => URL.revokeObjectURL(svgUrl)}
        />
      );
    } else if (qrCode.format === 'pdf') {
      // For PDF, show a placeholder icon or message
      return (
        <div className="w-full h-64 mb-3 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm text-gray-600 font-semibold">PDF Document</p>
            <p className="text-xs text-gray-500">Click download to view</p>
          </div>
        </div>
      );
    } else {
      // For PNG (default)
      return (
        <img
          src={qrCode.qrCodeData}
          alt={`QR Code for ${qrCode.sku?.code}`}
          className="w-full h-auto mb-3"
        />
      );
    }
  };

  const getFormatBadge = (format: string) => {
    const badges = {
      png: 'bg-blue-100 text-blue-800',
      svg: 'bg-green-100 text-green-800',
      pdf: 'bg-red-100 text-red-800',
    };
    return badges[format as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {qrCodes.map((qrCode, index) => (
        <div key={index} className={`border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow animate-on-load ${animations[index % animations.length]} ${durations[index % durations.length]}`}>
          {/* Format Badge */}
          <div className="flex justify-between items-center mb-3">
            <span className={`text-xs font-semibold px-2 py-1 rounded ${getFormatBadge(qrCode.format)}`}>
              {qrCode.format.toUpperCase()}
            </span>
          </div>

          {/* QR Code Preview */}
          {renderQRPreview(qrCode)}

          {/* SKU Info */}
          {qrCode.sku && (
            <div className="mb-3">
              <p className="font-semibold text-gray-800 animate-on-load fade-up duration-very-fast">{qrCode.sku.name}</p>
              <p className="text-sm text-gray-600 animate-on-load fade-down duration-fast">SKU: {qrCode.sku.code}</p>
            </div>
          )}

          {/* Target URL */}
          <p className="text-xs text-gray-500 mb-3 break-all animate-on-load zoom-in duration-normal">{qrCode.targetUrl}</p>

          {/* Download Button */}
          <button
            onClick={() => onDownload(qrCode)}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors animate-on-load flip-up duration-light-slow"
          >
            Download {qrCode.format.toUpperCase()}
          </button>
        </div>
      ))}
    </div>
  );
}
