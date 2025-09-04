"use client";
import { useTranslations } from "next-intl";

export default function CreateButton(params: { multiLanguage: string }) {
  const tCreateButton = useTranslations(params.multiLanguage);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div>
        <h2 className="flex flex-col items-center text-3xl md:text-4xl font-extrabold mb-4 text-center text-blue-700">
          {tCreateButton("cta.title")}
        </h2>
        <div className="flex flex-col items-center">
          <div className="max-w-5xl text-center mb-8">
            <p className="text-xl text-gray-700 leading-relaxed">
              {tCreateButton("cta.description")}
            </p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center px-8 py-4 bg-blue-700 text-white text-lg font-semibold rounded-lg hover:bg-indigo-500 transition-colors duration-200"
            >
              {tCreateButton("cta.cta")}
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
