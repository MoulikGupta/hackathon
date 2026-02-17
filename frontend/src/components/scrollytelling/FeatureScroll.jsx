import React from 'react';
import FeatureSequence from './FeatureSequence';

const FeatureScroll = () => {
    return (
        <div className="relative bg-black">
            {/* Scroll Container Height (400vh for 300 frames) */}
            <div className="h-[400vh] relative">

                {/* Sticky Viewport */}
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    {/* Canvas Background */}
                    <FeatureSequence />

                    {/* Optional: Text Overlays can be added here if needed */}
                    {/* For now, just the raw animation as requested */}
                </div>
            </div>
        </div>
    );
};

export default FeatureScroll;
