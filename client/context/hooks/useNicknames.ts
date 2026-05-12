import { useUser } from "@clerk/expo";

export const useUserIdAndNickname = () => {
  const { user } = useUser();

  return [user?.id, user?.primaryEmailAddress?.emailAddress.split("@")[0]];
};
