import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import Main from "./pages/Main";
import Profile from "./pages/Profile";

const Routes = createAppContainer(
  createStackNavigator(
    {
      Main: {
        screen: Main,
        navigationOptions: {
          title: "Dev Radar",
          headerTitleAlign: "center"
        }
      },
      Profile: {
        screen: Profile,
        navigationOptions: {
          headerStyle: {
            backgroundColor: "#24292E"
          },
          title: "Perfil no Github",
          headerTitleAlign: "center"
        }
      }
    },
    {
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: "#4a258b"
        },
        headerTintColor: "#FFF",
        headerBackTitleVisible: false
      }
    }
  )
);

export default Routes;
