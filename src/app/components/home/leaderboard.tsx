import { Text, View } from "react-native";
import { Fontisto } from "@expo/vector-icons";

function LeaderBoard() {
    return (<View className="flex-1 w-full">
        <View className="border-yellow-200/50 rounded-md mx-2 border">
            
            <Text>lajd</Text>
            <Fontisto name="bookmark" size={16} color={"#f59e0b"} />
        </View>

    </View>)
}

export default LeaderBoard; 