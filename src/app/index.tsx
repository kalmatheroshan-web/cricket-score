import { View } from "react-native"
import Auth from "./(auth)/login"

function Index() {
    return (
        <View className="flex-1 w-full h-full bg-white">
            <Auth />
        </View>
    )
}

export default Index