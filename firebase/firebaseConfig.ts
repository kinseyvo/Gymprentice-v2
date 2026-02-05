import { getAuth } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';

const app = getApp();
const auth = getAuth(app);

export { auth };