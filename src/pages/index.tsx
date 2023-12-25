import Chat from "./chat";

export default function HomePage() {
  return <Chat />;
}

export const getServerSideProps = () => {
  return {
    props: {
      title: "Promptify | Boost Your Creativity",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
    },
  };
};
