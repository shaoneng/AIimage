"use client";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

export default function UserExample(params: {
  multiLanguage: string;
  images: { img: string; video: string }[];
}) {
  const t = useTranslations(params.multiLanguage);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <div className="flex flex-col w-full items-center max-w-7xl space-y-8 px-4">
      <h2 className="text-3xl md:text-4xl mb-6 sm:mb-10 font-extrabold text-blue-700 text-center">
        {t("userExample.title")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-12">
        {params.images?.map((src, index) => (
          <div key={index} onClick={() => setSelectedVideo(src.video)}>
            <div className="relative cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg">
              <img
                src={src.img}
                alt={t("userExample.title")}
                className="w-full h-full max-h-[205px] object-cover rounded-lg cursor-pointer shadow-lg"
                loading="lazy"
              />
              {src.video && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-black"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {selectedVideo && (
        <div className="fixed flex inset-0 z-50 items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-4 rounded-lg max-w-full sm:max-w-md">
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="w-full h-auto rounded-lg"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedVideo(null)}
                className="px-4 sm:px-6 py-2 bg-indigo-700 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
