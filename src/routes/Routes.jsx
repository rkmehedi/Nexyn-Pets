import { createBrowserRouter } from "react-router";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../components/pages/Home";
import PetListing from "../components/pages/PetListing";
import PetDetails from "../components/pages/PetDetails";
import DonationCampaigns from "../components/pages/DonationCampaigns";
import DonationDetails from "../components/pages/DonationDetails";
import Login from "../components/pages/Login";
import Register from "../components/pages/Register";

import AddPet from "../components/pages/AddPet";
import MyAddedPets from "../components/pages/MyAddedPets";
import UpdatePet from "../components/pages/UpdatePet";
import CreateDonationCampaign from "../components/pages/CreateDonationCampaign";
import MyDonationCampaigns from "../components/pages/MyDonationCampaigns";
import MyDonations from "../components/pages/MyDonations";
import AdoptionRequests from "../components/pages/AdoptionRequests";
import EditDonationCampaign from "../components/pages/EditDonationCampaign";

import AllUsers from "../components/pages/AllUsers";
import AllPets from "../components/pages/AllPets";
import AllDonations from "../components/pages/AllDonations";

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

import ErrorPage from "../components/pages/ErrorPage";
import InternalErrorPage from "../components/pages/InternalErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "pet-listing", element: <PetListing /> },
      { path: "pets/:id", element: <PetDetails /> },
      { path: "donation-campaigns", element: <DonationCampaigns /> },
      { path: "donations/:id", element: <DonationDetails /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      { path: "add-pet", element: <PrivateRoute><AddPet /></PrivateRoute> },
      { path: "my-added-pets", element: <PrivateRoute><MyAddedPets /></PrivateRoute> },
      { path: "update-pet/:id", element: <PrivateRoute><UpdatePet /></PrivateRoute> },
      { path: "create-donation-campaign", element: <PrivateRoute><CreateDonationCampaign /></PrivateRoute> },
      { path: "donations-edit/:id", element: <PrivateRoute><EditDonationCampaign /></PrivateRoute> },
      { path: "my-donation-campaigns", element: <PrivateRoute><MyDonationCampaigns /></PrivateRoute> },
      { path: "my-donations", element: <PrivateRoute><MyDonations /></PrivateRoute> },
      { path: "adoption-requests", element: <PrivateRoute><AdoptionRequests /></PrivateRoute> },
      { path: "admin/users", element: <AdminRoute><AllUsers /></AdminRoute> },
      { path: "admin/all-pets", element: <AdminRoute><AllPets /></AdminRoute> },
      { path: "admin/all-donations", element: <AdminRoute><AllDonations /></AdminRoute> },
    ],
  },
  {
    path: "/error/internal",
    element: <InternalErrorPage />
  }
]);
