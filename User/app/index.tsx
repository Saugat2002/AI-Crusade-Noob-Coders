import {Text, View} from "react-native";
import {useState} from "react";
import {Redirect} from "expo-router";

export default function Index() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <Redirect href={isLoggedIn ? "/home" : "/onboarding"} />
    );
}
