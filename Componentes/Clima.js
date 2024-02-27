import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";

const Clima = () => {
  const [data, setData] = useState(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    fetch(
      "https://api.weatherapi.com/v1/forecast.json?key=5a492ff34efa492b91a172441211110%20&q=huejutla&days=10&aqi=no&alerts=no&lang=es"
    )
      .then((res) => res.json())
      .then((obj) => {
        setData(obj);
        setLoad(true);
      })
      .catch((err) => Alert.alert("Error inesperado : " + err));
  }, []);

  const Card = ({ fecha, iko, min, max }) => {
    return (
      <View style={styles.cardContainer}>
        <Text>{fecha} </Text>
        <Image style={styles.weatherIcon} source={{ uri: "https:" + iko }} />
        <Text style={styles.temperature}> {max}°C </Text>
        <Text style={styles.temperature}> {min}°C </Text>
      </View>
    );
  };

  const LScreen = () => {
    const [currentHourlyForecast, setCurrentHourlyForecast] = useState([]);

    useEffect(() => {
      if (data) {
        const currentHour = new Date().getHours();
        const next24Hours = data.forecast.forecastday[0].hour.slice(
          currentHour,
          currentHour + 24
        );
        setCurrentHourlyForecast(next24Hours);
      }
    }, [data]);

    return (
      <ScrollView>
        <Text style={styles.title}>{data.location.name}</Text>
        <Text style={styles.currentTemperature}>{data.current.temp_c}°</Text>
        <Text style={styles.condition}>
          {data.current.condition.text} - Máx:{" "}
          {data.forecast.forecastday[0].day.maxtemp_c}°C / Min:{" "}
          {data.forecast.forecastday[0].day.mintemp_c}°C
        </Text>

        <View style={styles.color}>
          <FlatList
            horizontal
            data={currentHourlyForecast}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.hourlyContainer}>
                <Text style={styles.hour}>{item.time.split(" ")[1]}</Text>
                <Image
                  style={styles.hourIcon}
                  source={{ uri: "https:" + item.condition.icon }}
                />
                <Text style={styles.hourTemperature}>{item.temp_c}°C</Text>
              </View>
            )}
          />
        </View>

        <View style={styles.color}>
          <FlatList
            data={data.forecast.forecastday}
            renderItem={({ item }) => (
              <Card
                fecha={item.date}
                iko={item.day.condition.icon}
                max={item.day.maxtemp_c}
                min={item.day.mintemp_c}
              />
            )}
          />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}> UV {data.current.uv}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Temperatura {data.current.temp_c}°C
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Humedad {data.current.humidity}%
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Viento E {data.current.wind_kph} km/h
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Presión d aire {data.current.pressure_mb} hPa
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Visibilidad {data.current.vis_km} km
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.color}>
          <Text style={styles.temperature}>
            Hora de salida del sol: {data.forecast.forecastday[0].astro.sunrise}
          </Text>
          <Text style={styles.temperature}>
            Hora de puesta del sol: {data.forecast.forecastday[0].astro.sunset}
          </Text>
        </View>
      </ScrollView>
    );
  };

  const Uscreen = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={"large"} color={"darkblue"} />
        <Text>Cargando datos...</Text>
      </View>
    );
  };

  return <View>{load ? <LScreen /> : <Uscreen />}</View>;
};
const styles = StyleSheet.create({
  title: {
    marginTop: 16,
    fontSize: 30,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  currentTemperature: {
    fontSize: 80,
    fontWeight: "200",
    color: "#000",
    textAlign: "center",
    marginVertical: 12,
  },
  cardContainer: {
    backgroundColor: "#FFF3E0",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    margin: 8,
    elevation: 3, // for Android shadow
    shadowOpacity: 0.1, // for iOS shadow
    shadowRadius: 4,
    shadowOffset: { height: 2, width: 0 },
  },
  weatherIcon: {
    height: 60,
    width: 60,
    margin: 8,
  },
  temperature: {
    fontSize: 18,
    fontWeight: "400",
    color: "#757575",
  },
  condition: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#616161",
    textAlign: "center",
    marginVertical: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFECB3",
  },
  infoContainer: {
    paddingVertical: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  infoBox: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#FFF8E1",
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  infoText: {
    fontSize: 15,
    color: "#455A64",
    textAlign: "center",
  },
  hourlyContainer: {
    alignItems: "center",
    padding: 10,
  },
  color: {
    backgroundColor: "#FFFDE7",
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  hour: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  hourIcon: {
    height: 50,
    width: 50,
    marginVertical: 8,
  },
  hourTemperature: {
    fontSize: 18,
    fontWeight: "300",
    color: "#FF5722",
  },
});

export default Clima;
