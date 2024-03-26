import { Layout } from "@/layout";
import WelcomeScreen from "@/components/builder/WelcomeScreen";
import { useSearchParams } from "next/navigation";

function CreatePage() {
  const searchParams = useSearchParams();

  return <Layout>{searchParams.has("editor") ? <div>loading...</div> : <WelcomeScreen />}</Layout>;
}

export default CreatePage;
