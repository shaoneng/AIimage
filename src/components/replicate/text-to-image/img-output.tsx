import { Button } from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";
import { useTranslations } from "next-intl";

export default function Output({
  error,
  prediction,
  defaultImage,
  showImage,
}: {
  error: string;
  prediction: any;
  defaultImage: string;
  showImage: string | null;
}) {
  const t = useTranslations("PhotoToCartoon.generator");
  return (
    <div className="flex flex-col w-full md:w-1/2 px-4 mt-8 md:mt-0">
      {error && error !== "" && (
        <div className="flex justify-center items-center text-red-500 mb-4">
          {error}
        </div>
      )}
      <div className="flex-1 flex items-center justify-center">
        {prediction ? (
          <>
            {prediction.output ? (
              <div className="flex justify-center items-center relative group rounded-lg">
                <img
                  src={
                    showImage
                      ? showImage
                      : Array.isArray(prediction.output) &&
                        prediction.output.length > 1
                      ? prediction.output[1]
                      : prediction.output
                  }
                  alt="Result"
                  className="object-contain max-w-full max-h-[420px] rounded-lg"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    className="bg-black text-white"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = showImage
                        ? showImage
                        : Array.isArray(prediction.output) &&
                          prediction.output.length > 1
                        ? prediction.output[1]
                        : prediction.output;
                      link.setAttribute("download", "");
                      link.setAttribute("target", "_blank");
                      link.click();
                    }}
                  >
                    {t("output.downloadButton")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full bg-gray-200 border-2 border-dashed animate-pulse rounded-lg">
                <CircularProgress
                  color="primary"
                  aria-label="Loading..."
                  classNames={{
                    svg: "text-black",
                  }}
                />
                <span className="text-black font-semibold">
                  {prediction.status}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full border-2 border-dashed rounded-lg">
            <img
              src={defaultImage}
              className="object-contain max-w-full max-h-[420px] rounded-lg py-6"
            />
          </div>
        )}
      </div>
    </div>
  );
}
