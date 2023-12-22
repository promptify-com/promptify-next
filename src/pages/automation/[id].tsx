import React from "react";
import ComingSoon from "../soon";

export default function Page() {
  return <ComingSoon backTo="/automation" />;
}

export async function getServerSideProps({ params }: any) {
  return {
    props: {
      title: "Promptify | Boost Your Creativity",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
    },
  };
}
