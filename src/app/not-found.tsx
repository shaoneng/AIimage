"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <html>
      <head>
        <title>Page Not Found | AI Video Generator</title>
        <meta name="robots" content="noindex, follow" />
        <meta
          name="description"
          content="Sorry, the page you are looking for does not exist."
        />
      </head>
      <body>
        <main className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-black">
          <div className="w-full max-w-2xl px-6">
            {/* Error Status and Title */}
            <div className="text-center">
              <div className="relative flex items-center justify-center">
                <div className="flex text-[120px] font-extrabold text-black dark:text-white leading-tight">
                  <div className="flex justify-center items-center">4</div>
                  <div className="flex justify-center items-center mx-4">
                    <img
                      src="https://pub-68f047ab8fbb41a4b4f5864425026517.r2.dev/logo/-new.webp"
                      alt="404"
                      className="w-32 h-32  "
                      loading="lazy"
                    />
                  </div>
                  <div className="flex justify-center items-center">4</div>
                </div>
              </div>
              <h2 className="mt-4 text-4xl font-bold text-black dark:text-white">
                Page Not Found In AI Video Generator
              </h2>
              <p className="mt-4 text-lg text-gray-800 dark:text-gray-200">
                Sorry, the page you are looking for doesn't exist or has been
                moved.We will redirect you to the home page in 3 seconds
              </p>
            </div>

            {/* Suggestions */}
            <div className="mt-12 bg-gray-100 dark:bg-gray-900 p-8 rounded-2xl shadow-xl">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Try these suggestions:
              </h3>
              <ul className="mt-6 space-y-4">
                {[
                  "Check if the URL is spelled correctly",
                  "Clear your browser cache and try again",
                  "Use the website navigation or search function",
                ].map((suggestion, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gray-800 dark:bg-gray-200"></span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {suggestion}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation Button */}
            <div className="mt-12 flex justify-center">
              <Link
                href="/"
                className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-full bg-gray-800 dark:bg-gray-200 text-white dark:text-black shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 w-full h-full bg-gray-800 dark:bg-gray-200 opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <span className="font-medium">Return Home Page</span>
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
