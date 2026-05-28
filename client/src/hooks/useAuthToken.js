import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { setAuthToken } from "../api";

function useAuthToken() {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const attachToken = async () => {
      if (isSignedIn) {
        const token = await getToken();
        setAuthToken(token);
      }
    };
    attachToken();
  }, [getToken, isSignedIn]);
}

export default useAuthToken;
