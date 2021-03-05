import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Pressable, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

import { FindOnById, Update } from "../data/storagen";

export default function App(props: any) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<{ id: string | undefined, name: string | undefined }>();
  const { navigate, goBack } = useNavigation();

  useEffect(() => {
    setCurrentEvent(props.route.params);
    setScanned(false);

    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true);
    async function find() {
      const guest: { id: string, name: string, event: string | null, presence: boolean }[] | [] = await FindOnById('@guest', data);
      console.log(guest)
      if (guest.length) {
        const curretGuest = await Update('@guest', guest[0].id);

        if (!guest[0].presence) {
          navigate('FeedBackScanQrCode', { status: 1, currentEvent, curretGuest });
        } else {
          navigate('FeedBackScanQrCode', { status: 2, currentEvent, curretGuest });
        }

      } else {
        navigate('FeedBackScanQrCode', { status: 3, currentEvent, curretGuest: null });
      }
    }
    find();
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => { goBack() }}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </Pressable>

        <Text style={styles.title}>{currentEvent?.name}</Text>

        <TouchableOpacity onPress={() => { goBack() }}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    marginBottom: 8
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#006c8d'
  },
  labelButton: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff'
  },
  button: {
    backgroundColor: '#006c8d',
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
  },
});
