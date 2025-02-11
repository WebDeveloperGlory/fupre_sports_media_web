import html2canvas from 'html2canvas';
import { useRef, useState } from 'react';
import ShareFixtureCard from './ShareFixtureCard'; // Ensure this is correctly imported

const ShareButton = () => {
  const hiddenCardRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState(false);

  const handleShare = async () => {
    setIsRendering(true); // Temporarily render the hidden card
    await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for render

    if (!hiddenCardRef.current) {
      setIsRendering(false);
      return;
    }

    html2canvas(hiddenCardRef.current, {
      backgroundColor: null, // Preserve transparency
      useCORS: true, // Allow external images
    }).then((canvas) => {
      setIsRendering(false); // Hide the hidden card

      const imageURL = canvas.toDataURL('image/png');

      if (navigator.share) {
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'match-summary.png', { type: 'image/png' });
            navigator.share({
              title: 'Match Summary',
              text: 'Check out this match summary!',
              files: [file],
            }).catch((error) => console.error('Sharing failed:', error));
          }
        });
      } else {
        // Fallback: Download the image
        const a = document.createElement('a');
        a.href = imageURL;
        a.download = 'match-summary.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }).catch((err) => {
      setIsRendering(false);
      console.error('Capture failed:', err);
    });
  };

  return (
    <div>
      {/* Hidden component for rendering */}
      {isRendering && (
        <div ref={hiddenCardRef} className="absolute -left-[9999px] -top-[9999px]">
          <ShareFixtureCard />
        </div>
      )}

      {/* Share button */}
      <button onClick={handleShare} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Share Match Summary
      </button>
    </div>
  );
};

export default ShareButton;
