import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from "react-native";
import {
  requestPermissionsAsync,
  getCurrentPositionAsync
} from "expo-location";
import api from "../services/api";
import {connect, disconnect, subscribeToNewDevs} from "../services/socket";

import { MaterialIcons } from "@expo/vector-icons";
import MapView, { Marker, Callout } from "react-native-maps";
function Main({ navigation }) {
  const [techs, setTechs] = useState("");
  const [devs, setDevs] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  
  useEffect(()=>{
    subscribeToNewDevs((dev) => setDevs([...devs, dev]))
  }, [devs])

  useEffect(() => {
    async function loadInitialLocation() {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true
        });

        const { latitude, longitude } = coords;
        setCurrentPosition({
          latitude: -10.2446804,
          longitude: -48.328996,
          longitudeDelta: 1,
          latitudeDelta: 1
        });
      }
    }
    loadInitialLocation();
  }, []);

  
  async function setupWebSocket(){
    disconnect();

    const { latitude, longitude } = currentPosition;

    connect(latitude, longitude, techs);
  }

  async function loadDevs() {

    const { latitude, longitude } = currentPosition;

    const { data } = await api.get("/search", {
      params: {
        latitude,
        longitude,
        techs
      }
    });
    setDevs(data.dev);
    setupWebSocket()
  }

  function handleRegionChanged(region) {
    setCurrentPosition(region);
  }

  if (!currentPosition) {
    return null;
  }
  return (
    <>
      <MapView
        onRegionChangeComplete={handleRegionChanged}
        initialRegion={currentPosition}
        style={styles.map}
      >
        {devs.map(dev => {
          return (
            <Marker
              key={dev._id}
              coordinate={{
                latitude: dev.location.coordinates[1],
                longitude: dev.location.coordinates[0]
              }}
            >
              <Image style={styles.avatar} source={{ uri: dev.avatar_url }} />
              <Callout
                onPress={() => {
                  navigation.navigate("Profile", {
                    github_username: dev.github_username
                  });
                }}
                style={styles.callout}
              >
                <View style={styles.devInfo}>
                  <Text style={styles.devName}>{dev.name}</Text>
                  <Text style={styles.devBio}>{dev.bio}</Text>
                  <Text style={styles.devTechs}>{dev.techs.join(", ")}</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
      {/* essa view é o que envolve o input e o botão e faz ficar na mesma linha */}
      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          autoCapitalize="words"
          placeholder="Techs ..."
          placeholderTextColor="#666"
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
        />
        <TouchableOpacity onPress={loadDevs} style={styles.searchButtom}>
          <MaterialIcons name="my-location" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: "#fff"
  },
  callout: {
    width: 260,
    borderRadius: 20
  },
  devName: {
    fontWeight: "bold",
    fontSize: 16
  },
  devTechs: {
    marginTop: 5
  },
  devBio: {
    color: "#666",
    marginTop: 5
  },
  searchForm: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 5,
    flexDirection: "row"
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    elevation: 10
  },
  searchButtom: {
    height: 50,
    width: 50,
    backgroundColor: "#8E4DFF",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15
  }
});

export default Main;
