import { GoogleOAuthProvider } from "@react-oauth/google";
import SocialButtons from "./SocialButtons";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  preLogin?: (isLoading: boolean) => void;
  isChecked?: boolean;
  setErrorCheckBox?: Dispatch<SetStateAction<boolean>>;
  from?: string;
  asList?: boolean;
}

export default function SocialMediaAuth({ preLogin, isChecked, setErrorCheckBox, from, asList }: Props) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <SocialButtons
        preLogin={preLogin}
        isChecked={isChecked}
        setErrorCheckBox={setErrorCheckBox}
        from={from}
        asList={asList}
      />
    </GoogleOAuthProvider>
  );
}
