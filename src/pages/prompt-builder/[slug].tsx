import PromptBuilder from "@/components/builder/PromptBuilder";
import { BUILDER_DESCRIPTION } from "@/common/constants";

function PromptBuilderPage() {
  return <PromptBuilder />;
}

export async function getServerSideProps() {
  return {
    props: {
      title: "Chain of Thoughts Builder",
      description: BUILDER_DESCRIPTION,
    },
  };
}

export default PromptBuilderPage;
