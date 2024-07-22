import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginForm from "./components/login and signup/LoginForm.jsx";
import SignupForm from "./components/login and signup/SignupForm.jsx";
import GoogleSignup from "./components/login and signup/GoogleSignup.jsx";
import AddTestimonial from "./components/testimonials/AddTestimonial.jsx";
import UserDashBoard from "./components/dashboard/user_dashboard/UserDashboard.jsx";
import UserActivity from "./components/dashboard/user_dashboard/UserActivity.jsx";
import Notifications from "./components/dashboard/user_dashboard/Notifications.jsx";
import UserDetails from "./components/dashboard/user_dashboard/UserDetails.jsx";
import WorkshopRegisterd from "./components/dashboard/user_dashboard/WorkshopRegistered.jsx";
import UserBooking from "./components/dashboard/user_dashboard/UserBooking.jsx";
import UserTestimonial from "./components/dashboard/user_dashboard/UserTestimonial.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import AdminDashBoard from "./components/dashboard/admin_dashboard/AdminDashBoard.jsx";
import CustomizeHomePage from "./components/dashboard/admin_dashboard/CustomizeHomePage.jsx";
import CustomizeHeroSection from "./components/adminfeatures/HeroSection/CustomizeHeroSection.jsx";
import CustomizeSpecialitySection from "./components/adminfeatures/SpecialitySection/CustomizeSpecialitySection.jsx";
import CustomizeEventSection from "./components/adminfeatures/EventSection/CustomizeEventSection.jsx";
import CustomizeWorkshopSection from "./components/adminfeatures/WorkshopSection/ManageWorkshop.jsx";
import CustomizeTestimonialSection from "./components/adminfeatures/TestimonialSection/CustomizeTestimonialSection.jsx";
import ManageUser from "./components/adminfeatures/ManageRolesAndUser/ManageUser.jsx";
import ManageWorkshop from "./components/adminfeatures/WorkshopSection/ManageWorkshop.jsx";
import WorkshopRegistrations from "./components/adminfeatures/WorkshopSection/WorkshopRegistrations.jsx";
import CreateNotifications from "./components/adminfeatures/Notification/CreateNotifications.jsx";
import WebsiteNotification from "./components/adminfeatures/Notification/WebsiteNotificaton.jsx";
import PushNotification from "./components/adminfeatures/Notification/PushNotification.jsx";
import MailNotification from "./components/adminfeatures/Notification/MailNotification.jsx";
import ManageBooking from "./components/adminfeatures/ManageBooking/ManageBooking.jsx";
import Menu from "./components/menusection/Menu.jsx";
import MenuSection from "./components/adminfeatures/MenuSection/MenuSection.jsx";
import CreateMenu from "./components/adminfeatures/MenuSection/CreateMenu.jsx";
import MenuDetails from "./components/adminfeatures/MenuSection/MenuDetails.jsx";
import Dish from "./components/adminfeatures/MenuSection/Dish.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import Order from "./components/dashboard/user_dashboard/Order.jsx";
import ManageOrder from "./components/adminfeatures/ManageOrder/ManageOrder.jsx";
import Analytics from "./components/adminfeatures/Analytics/Analytics.jsx";
import DishAnalytics from "./components/adminfeatures/Analytics/menus/DishAnalytics.jsx";
import DashBoardAnalytics from "./components/adminfeatures/Analytics/DashBoardAnalytics.jsx";
import UserDetailedAnalytics from "./components/adminfeatures/Analytics/user/UserDetailedAnalytics.jsx";
import RevenueDetailedAnalytics from "./components/adminfeatures/Analytics/revenue/RevenueDetailedAnalytics.jsx";
import OrderDetailedAnalytics from "./components/adminfeatures/Analytics/orders/OrderDetailedAnalytics.jsx";
import TrafficDetailedAnalytics from "./components/adminfeatures/Analytics/traffic/TrafficDetailedAnalytics.jsx";
import NotFound from "./components/notfound/NotFound.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <CartProvider>
        <App />
      </CartProvider>
    ),
    loader: App.loader,
    errorElement: <NotFound />
  },
  {
    path: "/auth/login",
    element: (
      <>
        <LoginForm />
      </>
    ),
  },
  {
    path: "/auth/signup",
    element: (
      <>
        <SignupForm />
      </>
    ),
  },
  {
    path: "/auth/signup/google",
    element: <GoogleSignup />,
  },
  {
    path: "/testimonial",
    element: (
      <>
        <AddTestimonial />
      </>
    ),
  },
  {
    path: "/dashboard",
    element: <UserDashBoard />,
    children: [
      {
        index: true,
        element: <UserDetails />,
      },
      {
        path: "activity",
        element: <UserActivity />,
        children: [
          {
            path: "",
            index: true,
            element: <UserBooking />,
          },
          {
            path: "workshop",
            element: <WorkshopRegisterd />,
          },
          {
            path: "testimonial",
            element: <UserTestimonial />,
          },
        ],
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "order",
        element: <Order />
      }
    ],
  },
  {
    path: "/admin",
    element: <AdminDashBoard />,
    children: [
      {
        element: <Analytics />,
        path: "analytics",
        children: [
          {
            index: true,
            element: <DashBoardAnalytics />
          },
          {
            path: 'user',
            element: <UserDetailedAnalytics />
          },
          {
            path: 'revenue',
            element: <RevenueDetailedAnalytics />
          },
          {
            path: 'orders',
            element: <OrderDetailedAnalytics />
          },
          {
            path: "review",
            element: <DishAnalytics />
          },
          {
            path: "traffic",
            element: <TrafficDetailedAnalytics />
          }
        ]
      },
      {
        index: true,
        path: "user",
        element: <ManageUser />
      },
      {
        element: <CustomizeHomePage />,
        path: "customize",
      },
      {
        path: "customize/Hero",
        element: <CustomizeHeroSection />
      },
      {
        path: "customize/speciality",
        element: <CustomizeSpecialitySection />
      },
      {
        path: "customize/event",
        element: <CustomizeEventSection />
      },
      {
        path: "customize/workshop",
        element: <CustomizeWorkshopSection />
      },
      {
        path: "customize/testimonial",
        element: <CustomizeTestimonialSection />
      }
      , {
        path: "workshop",
        element: <ManageWorkshop />,
        children: [
          {
            path: "registrations",
            element: <WorkshopRegistrations />
          }
        ]
      },
      {
        path: "notification",
        element: <CreateNotifications />,
        children: [
          {
            path: "website",
            element: <WebsiteNotification />
          },
          {
            path: "email",
            element: <MailNotification />
          },
          {
            path: "pushnotification",
            element: <PushNotification />
          }
        ]
      },
      {
        path: "booking",
        element: <ManageBooking />
      },
      {
        path: "menu",
        element: <MenuSection />,
        children:
          [
            {
              element: <CreateMenu />,
              index: true
            },
            {
              path: "show",
              element: <MenuDetails />
            },
            {
              path: "dishes/:menuId",
              element: <Dish />
            }
          ]

      },
      {
        path: "order",
        element: <ManageOrder />
      }
    ]
  },

  {
    path: "menu",
    element: <>
      <CartProvider>
        <Menu />
      </CartProvider>
    </>
  }



]);

ReactDOM.createRoot(document.querySelector("#root")).render(
  // <React.StrictMode>
  <AuthProvider>
    <>
      <ToastContainer style={{ width: "100%", padding: "2rem", maxWidth: "65rem", textAlign: "center" }} limit={2} />
      <RouterProvider router={router} />
    </>
  </AuthProvider>
  // </React.StrictMode>
);
