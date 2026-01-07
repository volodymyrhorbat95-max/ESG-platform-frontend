// Social Share Component - Share impact on social media
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createShareableLink, fetchUserLinks, deleteShareableLink } from '../../store/shareableLinkSlice';

interface SocialShareProps {
  userId: string;
  totalImpactKg: string;
  plasticBottles: number;
}

export default function SocialShare({ userId, totalImpactKg, plasticBottles }: SocialShareProps) {
  const dispatch = useAppDispatch();
  const { links, loading } = useAppSelector((state) => state.shareableLinks);
  const [showLinks, setShowLinks] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCreateLink = async () => {
    await dispatch(createShareableLink({ userId, expiresInDays: 30 }));
    await dispatch(fetchUserLinks(userId));
    setShowLinks(true);
  };

  const handleDeleteLink = async (linkId: string) => {
    await dispatch(deleteShareableLink({ userId, linkId }));
  };

  const handleCopyLink = (shareUrl: string) => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getShareText = () => {
    return `I've helped remove ${totalImpactKg}kg of plastic from the environment - that's equivalent to ${plasticBottles} plastic bottles! Join me in making a difference.`;
  };

  const shareOnTwitter = (shareUrl?: string) => {
    const text = encodeURIComponent(getShareText());
    const url = shareUrl ? encodeURIComponent(shareUrl) : '';
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareOnLinkedIn = (shareUrl?: string) => {
    const url = shareUrl ? encodeURIComponent(shareUrl) : '';
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const shareOnFacebook = (shareUrl?: string) => {
    const url = shareUrl ? encodeURIComponent(shareUrl) : '';
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const activeLink = links.find((l) => l.isValid);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6 animate-on-load fade-up duration-slow">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-on-load fade-right duration-normal">
        Share Your Impact
      </h2>

      <p className="text-gray-600 mb-4 animate-on-load fade-left duration-light-slow">
        Share your environmental impact with friends and colleagues to inspire others to take action.
      </p>

      {/* Quick Social Share Buttons */}
      <div className="flex flex-wrap gap-3 mb-6 animate-on-load zoom-in duration-normal">
        <button
          onClick={() => shareOnTwitter(activeLink?.shareUrl)}
          className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Share on X
        </button>

        <button
          onClick={() => shareOnLinkedIn(activeLink?.shareUrl)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </button>

        <button
          onClick={() => shareOnFacebook(activeLink?.shareUrl)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </button>
      </div>

      {/* Shareable Link Section */}
      <div className="border-t border-gray-200 pt-4 animate-on-load fade-up duration-light-slow">
        <h3 className="font-semibold text-gray-700 mb-3">Shareable Dashboard Link</h3>

        {!activeLink ? (
          <button
            onClick={handleCreateLink}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 cursor-pointer"
          >
            {loading ? 'Creating...' : 'Create Shareable Link'}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={activeLink.shareUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={() => handleCopyLink(activeLink.shareUrl)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Views: {activeLink.viewCount}</span>
              <span>
                {activeLink.expiresAt
                  ? `Expires: ${new Date(activeLink.expiresAt).toLocaleDateString()}`
                  : 'Never expires'}
              </span>
              <button
                onClick={() => handleDeleteLink(activeLink.id)}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              >
                Delete Link
              </button>
            </div>
          </div>
        )}

        {/* Show all links toggle */}
        {links.length > 1 && (
          <button
            onClick={() => setShowLinks(!showLinks)}
            className="mt-3 text-sm text-primary hover:underline cursor-pointer"
          >
            {showLinks ? 'Hide all links' : `Show all ${links.length} links`}
          </button>
        )}

        {showLinks && links.length > 0 && (
          <div className="mt-4 space-y-2">
            {links.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm truncate max-w-xs">{link.shareUrl}</span>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">{link.viewCount} views</span>
                  <span className={link.isValid ? 'text-green-600' : 'text-red-600'}>
                    {link.isValid ? 'Active' : 'Expired'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
