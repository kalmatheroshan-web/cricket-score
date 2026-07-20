import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

function AdminUi() {
    return (
        <View className="flex-1 bg-black">
            <SafeAreaView >
                <Text className="text-white">Admin ui</Text>
            </SafeAreaView>
        </View>
    )
}

export default AdminUi
