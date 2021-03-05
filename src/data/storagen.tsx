import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from '../services/uuid';

export async function Create(key: string, name: any, event: string | null = null) {
   try {
      let valueObj = { id: uuid(), name, event, presence: false };

      const guestData: [any] = await FindAll(key);
      guestData.push(valueObj)
      const jsonValue = JSON.stringify(guestData)

      return await AsyncStorage.setItem(key, jsonValue)
   } catch (e) {
      // saving error
   }
}

export async function FindOnById(key: string, id: string) {
   console.log(key)
   console.log(id)
   const jsonValue = await AsyncStorage.getItem(key)
   const jsonConvert = (jsonValue != null) ? JSON.parse(jsonValue) : [];

   return jsonConvert.filter((obj: any) => obj.id == id)
}

export async function FindAll(key: string, filters: string | null = null) {
   try {
      const jsonValue = await AsyncStorage.getItem(key)
      const jsonConvert = (jsonValue != null) ? JSON.parse(jsonValue) : [];
      let data: any = jsonConvert;
      if (filters?.length) {
         data = jsonConvert.filter((obj: any) => obj.event == filters)
      }

      return data;
   } catch (e) {
      // error reading value
   }
}

export async function Update(key: string, id: string) {
   try {
      const valueStorage = await AsyncStorage.getItem(key)
      const jsonValue: [] = (valueStorage != null) ? JSON.parse(valueStorage) : [];

      let data = jsonValue.filter((obj: any) => obj.id == id);

      const indexData = jsonValue.indexOf(data[0]);
      const deleteObj: any = jsonValue.splice(indexData, 1);
      const guestEdit = { id: deleteObj[0].id, name: deleteObj[0].name, event: deleteObj[0].event, presence: true };

      const jsonValueAny: any[] = jsonValue;
      jsonValueAny.push(guestEdit)
      const valueEnd = JSON.stringify(jsonValue)
      await AsyncStorage.setItem(key, valueEnd)

      return guestEdit;

   } catch (e) {
      // saving error
   }
}

export async function Delete(key: string, id: string) {
   try {
      const valueStorage = await AsyncStorage.getItem(key)
      const jsonValue: [] = (valueStorage != null) ? JSON.parse(valueStorage) : [];

      let data = jsonValue.filter((obj: any) => obj.id == id);

      const indexData = jsonValue.indexOf(data[0]);
      const DeleteObj = jsonValue.splice(indexData, 1);
      const valueEnd = JSON.stringify(jsonValue)

      return await AsyncStorage.setItem(key, valueEnd)

   } catch (e) {
      // saving error
   }
}
