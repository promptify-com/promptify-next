import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import React from "react";
import { ITemplateWorkflow } from "@/components/Automation/types";
import GPTbanner from "../GPTbanner";

interface Props {
  items?: ITemplateWorkflow[];
}

function CarouselSectionAuto({ items }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = items?.length ?? 0;

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 10000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  return (
    <Stack gap={"24px"}>
      <Stack overflow={"hidden"}>
        <Stack
          direction={"row"}
          sx={{
            display: "flex",
            flexWrap: "nowrap",
            transition: "transform 0.5s ease-in-out",
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {items?.map((item, index) => (
            <Box
              key={index}
              sx={{
                flex: "0 0 100%",
              }}
            >
              <GPTbanner
                key={item.id}
                title={item.name}
                description={item.description}
                href={`/apps/${item.slug}`}
                image={item.image}
              />
            </Box>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default CarouselSectionAuto;
