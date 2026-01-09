// QR Code Display Component
interface QRCodeDisplayProps {
  qrCodes: any[];
  onDownload: (qrCode: any) => void;
}

export default function QRCodeDisplay({ qrCodes, onDownload }: QRCodeDisplayProps) {
  const animations = ['fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom-in', 'flip-up'];
  const durations = ['duration-fast', 'duration-normal', 'duration-light-slow', 'duration-slow', 'duration-very-slow'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {qrCodes.map((qrCode, index) => (
        <div key={index} className={`border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow animate-on-load ${animations[index % animations.length]} ${durations[index % durations.length]}`}>
          <img
            src={qrCode.qrCodeDataUrl}
            alt={`QR Code for ${qrCode.sku?.code}`}
            className="w-full h-auto mb-3"
          />
          {qrCode.sku && (
            <div className="mb-3">
              <p className="font-semibold text-gray-800 animate-on-load fade-up duration-very-fast">{qrCode.sku.name}</p>
              <p className="text-sm text-gray-600 animate-on-load fade-down duration-fast">SKU: {qrCode.sku.code}</p>
            </div>
          )}
          <p className="text-xs text-gray-500 mb-3 break-all animate-on-load zoom-in duration-normal">{qrCode.targetUrl}</p>
          <button
            onClick={() => onDownload(qrCode)}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors animate-on-load flip-up duration-light-slow"
          >
            Download PNG
          </button>
        </div>
      ))}
    </div>
  );
}
