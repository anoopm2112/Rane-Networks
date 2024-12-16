import NetInfo from '@react-native-community/netinfo';

export async function checkNetworkConnectivity() {
    try {
        const netInfoState = await NetInfo.fetch();
        const isConnected = netInfoState.isConnected;
        return isConnected;
    } catch (error) {
        console.error('Error checking network status:', error);
        return false; // Assume network is disconnected on error
    }
}