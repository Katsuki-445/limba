import React from 'react';

const AtelierVideo = () => {
  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/video/hero-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 h-full w-full flex flex-col justify-center items-center text-center px-4">
        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white tracking-wide">
          CRAFTING THE CULTURAL LEGACY
        </h2>
        <div className="mt-4 text-sm md:text-base text-white/80 tracking-widest uppercase">
          The Atelier
        </div>
      </div>
    </section>
  );
};

export default AtelierVideo;
