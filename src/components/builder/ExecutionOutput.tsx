import React, { useEffect, useState } from "react";
import { isImageOutput } from "@/components/Prompt/Utils";
import ImagePopup from "@/components/dialog/ImagePopup";
import { EngineOutput } from "@/core/api/dto/templates";
import Image from "@/components/design-system/Image";
import Skeleton from "@mui/material/Skeleton";
import { ExecutionContent } from "@/components/common/ExecutionContent";

interface Props {
  output: string;
  engineType: EngineOutput;
}

function ExecutionOutput({ output, engineType }: Props) {
  const [showImage, setShowImage] = useState<boolean>(false);
  const [content, setContent] = useState(output);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (!isImageOutput(output, engineType)) {
      import("@/common/helpers/htmlHelper").then(({ markdownToHTML, sanitizeHTML }) => {
        markdownToHTML(output).then(res => setContent(sanitizeHTML(res)));
      });
    }
  }, [engineType, output]);

  return isImageOutput(output, engineType) ? (
    <>
      <Image
        src={!imgError ? output : require("@/assets/images/default-thumbnail.jpg")}
        alt={"Expired"}
        style={{
          borderRadius: "8px",
          objectFit: "cover",
          width: "80%",
          height: imgLoaded ? "fit-content" : 0,
        }}
        priority={false}
        onClick={() => setShowImage(!imgError)}
        onError={e => setImgError(true)}
        onLoad={() => setImgLoaded(true)}
      />
      {!imgLoaded && (
        <Skeleton
          animation="wave"
          variant="rectangular"
          sx={{
            width: "80%",
            height: "230.4px",
            borderRadius: "8px",
          }}
        />
      )}
      {!imgError && (
        <ImagePopup
          open={showImage}
          imageUrl={content}
          onClose={() => setShowImage(false)}
        />
      )}
    </>
  ) : (
    <ExecutionContent content={content} />
  );
}

export default ExecutionOutput;
