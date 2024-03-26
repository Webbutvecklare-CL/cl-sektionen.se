// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import {
	getAnalytics,
	isSupported as analyticsIsSupported,
} from "firebase/analytics";

import { getMessaging, isSupported } from "firebase/messaging";

import { getCookie } from "../utils/cookieUtils";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => (await isSupported()) && getMessaging(app);
const analyticsAllowed = () => {
	if (typeof window !== "undefined") {
		return getCookie("allowCookies") === "true";
	}
	return false;
};

const getValidAnalytics = async () => {
	if (analyticsAllowed() && (await analyticsIsSupported())) {
		return getAnalytics(app);
	}
	return null;
};

export { app, messaging, getValidAnalytics as getAnalytics };
