import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  VerifyEmail: { userId: string; email: string };
};

export type BuyerTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Appointments: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type SellerAgentTabParamList = {
  Dashboard: undefined;
  Home: undefined;
  MyProperties: undefined;
  CreateProperty: undefined;
  Notifications: undefined;
  Profile: undefined;
};

/** U006 — users; U026 — reviews */
export type AdminTabParamList = {
  AdminUsers: undefined;
  AdminReviews: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  BuyerMain: NavigatorScreenParams<BuyerTabParamList>;
  SellerAgentMain: NavigatorScreenParams<SellerAgentTabParamList>;
  AdminMain: NavigatorScreenParams<AdminTabParamList>;
  PropertyDetails: { propertyId: string };
  EditProperty: { propertyId: string };
  AgentList: undefined;
  AgentDetail: { agentId: string };
  AssignmentList: undefined;
  PublicPropertyExplore: undefined;
  AdminReviewDetail: { reviewId: string };
};

// You can add global typical declarations to React Navigation here
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}
