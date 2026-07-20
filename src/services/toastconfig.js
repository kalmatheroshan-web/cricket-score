import { Text, View, Platform } from "react-native";
import { BaseToast } from "react-native-toast-message";

const renderLeadingIcon = (icon, bgColor) => (
  <View
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: 12,
      paddingRight: 4,
    }}
  >
    <View
      style={{
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: bgColor,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 14 }}>{icon}</Text>
    </View>
  </View>
);

const baseStyle = {
  borderLeftWidth: 0,
  backgroundColor: 'rgba(30, 30, 30, 0.92)',
  borderRadius: 14,
  marginHorizontal: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 8,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.08)',
};

const baseContentStyle = {
  paddingHorizontal: 12,
  paddingVertical: 10,
};

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={baseStyle}
      contentContainerStyle={baseContentStyle}
      text1Style={{
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
      }}
      text2Style={{
        color: '#a1a1a6',
        fontSize: 13,
        fontWeight: '400',
      }}
      renderLeadingIcon={() => renderLeadingIcon('✓', '#34c759')}
    />
  ),
  error: (props) => (
    <BaseToast
      {...props}
      style={baseStyle}
      contentContainerStyle={baseContentStyle}
      text1Style={{
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
      }}
      text2Style={{
        color: '#a1a1a6',
        fontSize: 13,
        fontWeight: '400',
      }}
      renderLeadingIcon={() => renderLeadingIcon('✕', '#ff3b30')}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={baseStyle}
      contentContainerStyle={baseContentStyle}
      text1Style={{
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
      }}
      text2Style={{
        color: '#a1a1a6',
        fontSize: 13,
        fontWeight: '400',
      }}
      renderLeadingIcon={() => renderLeadingIcon('ℹ', '#007aff')}
    />
  ),
};