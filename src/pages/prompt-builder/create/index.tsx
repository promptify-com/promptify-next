import { useSearchParams } from "next/navigation";
import { Layout } from "@/layout";
import WelcomeScreen from "@/components/builder/WelcomeScreen";
import PromptBuilder from "@/components/builder/PromptBuilder";

function CreatePage() {
  const searchParams = useSearchParams();

  return (
    <>
      {searchParams.has("editor") ? (
        <PromptBuilder isNewTemplate />
      ) : (
        <Layout>
          <WelcomeScreen />
        </Layout>
      )}
    </>
  );
}

export default CreatePage;
