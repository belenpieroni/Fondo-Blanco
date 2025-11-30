import { createBrowserRouter } from "react-router";
import { MainLayout } from "../components/MainLayout";
import { HomePage } from "../components/HomePage";
import { CreateDrinkPage } from "../components/CreateDrinkPage";
import { MyDrinksPage } from "../components/MyDrinksPage";
import { DrinkDetailPage } from "../components/DrinkDetailPage";
import { UserProfilePage } from "../components/UserProfilePage";
import { EditDrinkPage } from "../components/EditDrinkPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "mis-tragos", Component: MyDrinksPage },
      { path: "trago/:id", Component: DrinkDetailPage },
      { path: "perfil/:userId", Component: UserProfilePage },
    ],
  },
  {
    path: "/crear-trago",
    Component: CreateDrinkPage,
  },
  {
    path: "/editar-trago/:id",
    Component: EditDrinkPage,
  },
]);
