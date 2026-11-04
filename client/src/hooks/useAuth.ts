// Auth hook for custom authentication (Google OAuth + Email/Password)
import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  emailVerified: boolean;
  oauthProvider?: string;
  lastLoginAt?: string;
  completed?: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  subscriptionInterval?: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
