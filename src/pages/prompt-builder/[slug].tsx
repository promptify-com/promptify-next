import PromptBuilder from "@/components/builder/PromptBuilder";
import { BUILDER_DESCRIPTION } from "@/common/constants";

export const PromptBuilderPage = () => <PromptBuilder />;

export async function getServerSideProps() {
  return {
    props: {
      title: "Chain of Thoughts Builder",
      description: BUILDER_DESCRIPTION,
    },
  };
}
export default PromptBuilderPage;
