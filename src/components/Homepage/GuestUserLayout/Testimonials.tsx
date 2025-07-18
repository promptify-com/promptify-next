import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Image from "@/components/design-system/Image";
import useCarousel from "@/hooks/useCarousel";
import CarouselButtons from "@/components/common/buttons/CarouselButtons";
import { Avatar, Box } from "@mui/material";
import useBrowser from "@/hooks/useBrowser";
interface ITestimonial {
  image: string;
  content: string;
  name: string;
  profession: string;
}

const TestimonialExamples: ITestimonial[] = [
  {
    image: require("@/assets/images/testimonial1.png"),
    content:
      "Before Promptify.com, I'd spend hours staring at a blank page. Now? Essays are a breeze, and I even have time for video games afterward! 🎮📝",
    name: "Alex",
    profession: "High School Student",
  },
  {
    image: require("@/assets/images/testimonial2.png"),
    content:
      "Drafting business proposals and emails has never been this efficient. Promptify.com is like having an AI assistant by my side. Absolute game-changer! 👩💼🚀",
    name: "Jordan",
    profession: "Marketing Manager",
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: ITestimonial }) => {
  const { isMobile } = useBrowser();
  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: "#F7F6FE",
        borderRadius: "24px",
      }}
    >
      <Stack direction={"row"}>
        <CardContent sx={{ flex: 1, padding: { xs: "24px 16px", md: "24px 32px" }, m: 0 }}>
          <Stack
            height={"100%"}
            justifyContent={"space-between"}
            alignItems={"flex-start"}
            gap={2}
          >
            <Typography
              fontSize={18}
              fontWeight={400}
              color={"onSurface"}
              minHeight={{ xs: "130px", md: "auto" }}
            >
              &quot;{testimonial.content}&quot;
            </Typography>
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={2}
            >
              {isMobile && (
                <Box
                  width={"60px"}
                  height={"60px"}
                  borderRadius={"60px"}
                  overflow={"hidden"}
                  position={"relative"}
                >
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    sizes="60px"
                    priority={false}
                  />
                </Box>
              )}

              <Stack gap={1}>
                <Typography
                  fontSize={16}
                  fontWeight={500}
                  color={"secondary.main"}
                >
                  {testimonial.name}
                </Typography>
                <Typography
                  fontSize={14}
                  fontWeight={500}
                  color={"secondary.main"}
                >
                  {testimonial.profession}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
        {!isMobile && (
          <CardMedia
            sx={{
              zIndex: 1,
              borderRadius: "16px",
              width: "223px",
              height: "312px",
            }}
          >
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              style={{ borderRadius: "16px", objectFit: "contain", width: "100%", height: "100%" }}
              priority={false}
              sizes="223px"
            />
          </CardMedia>
        )}
      </Stack>
    </Card>
  );
};

const CARDS_GAP = 24;
const cardWidth = CARDS_GAP / TestimonialExamples.length;

function Testimonials() {
  const { containerRef, scrollNext, scrollPrev, canScrollNext, canScrollPrev } = useCarousel();

  return (
    <Stack
      py={{ xs: "30px", md: "48px" }}
      gap={4}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={1}
      >
        <Stack gap={1}>
          <Typography
            fontSize={{ xs: 24, md: 32 }}
            fontWeight={400}
            color={"#2A2A3C"}
          >
            Testimonials
          </Typography>
          <Typography
            fontSize={16}
            fontWeight={400}
            color={"#2A2A3C"}
          >
            What people says about Promptify
          </Typography>
        </Stack>
        {TestimonialExamples.length > 2 && (
          <Box ml={"auto"}>
            <CarouselButtons
              scrollPrev={scrollPrev}
              scrollNext={scrollNext}
              canScrollNext={canScrollNext}
              canScrollPrev={canScrollPrev}
            />
          </Box>
        )}
      </Stack>
      <Stack
        ref={containerRef}
        overflow={"hidden"}
      >
        <Stack
          direction={"row"}
          gap={`${CARDS_GAP}px`}
        >
          {TestimonialExamples.map((testimonial, idx) => (
            <Box
              key={idx}
              sx={{
                width: { xs: "100%", md: `calc(50% - ${cardWidth}px)` },
                minWidth: { xs: "100%", md: `calc(50% - ${cardWidth}px)` },
                mr: idx === 1 ? 3 : 0,
              }}
            >
              <TestimonialCard testimonial={testimonial} />
            </Box>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Testimonials;
