import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import Image from "@/components/design-system/Image";

interface ITestimonials {
  image: string;
  content: string;
  name: string;
  profession: string;
}

const Testimonial: ITestimonials = {
  image: require("./empower.png"),
  content:
    "Before Promptify.com, I'd spend hours staring at a blank page. Now? Essays are a breeze, and I even have time for video games afterward! 🎮📝",
  name: "Alex",
  profession: "High School Student",
};

const TestimonialCard = ({ testimonial }: { testimonial: ITestimonials }) => (
  <Card
    elevation={0}
    sx={{
      width: "668px",
      minWidth: "668px",
      bgcolor: "#F7F6FE",
      borderRadius: "24px",
      "&:hover": {
        bgcolor: "white",
      },
    }}
  >
    <Stack direction={"row"}>
      <CardContent sx={{ flex: 1, padding: "24px 32px", m: 0 }}>
        <Stack
          height={"100%"}
          justifyContent={"space-between"}
          alignItems={"flex-start"}
        >
          <Typography
            fontSize={18}
            fontWeight={400}
            color={"#000000"}
          >
            &quot;{testimonial.content}&quot;
          </Typography>
          <Stack gap={1}>
            <Typography
              fontSize={16}
              fontWeight={500}
              color={"#2A2A3C"}
            >
              {testimonial.name}
            </Typography>
            <Typography
              fontSize={14}
              fontWeight={500}
              color={"#2A2A3C"}
            >
              {testimonial.profession}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
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
          style={{ borderRadius: "16px", objectFit: "cover", width: "100%", height: "100%" }}
          priority={false}
        />
      </CardMedia>
    </Stack>
  </Card>
);

function Testimonials() {
  return (
    <Stack
      py={"48px"}
      gap={4}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        p={"8px 16px"}
        gap={1}
      >
        <Stack
          flex={1}
          gap={1}
          px={"16px"}
        >
          <Typography
            fontSize={32}
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
        <IconButton sx={{ border: "none", color: "#67677C" }}>
          <ArrowBackIosNew />
        </IconButton>
        <IconButton sx={{ border: "none", color: "#67677C" }}>
          <ArrowForwardIos />
        </IconButton>
      </Stack>
      <Stack
        direction={"row"}
        gap={3}
        sx={{
          overflow: "auto",
          overscrollBehavior: "contain",
        }}
      >
        {Array.from({ length: 10 }).map((_, idx) => (
          <TestimonialCard
            key={idx}
            testimonial={Testimonial}
          />
        ))}
      </Stack>
    </Stack>
  );
}

export default Testimonials;
