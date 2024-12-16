import React from 'react';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

const CustomIcon = ({ iconPackage, name, size, color }) => {
    switch (iconPackage) {
        case 'FontAwesome':
            return <FontAwesomeIcon name={name} size={size} color={color} />;
        case 'MaterialIcons':
            return <MaterialIcon name={name} size={size} color={color} />;
        case 'Entypo':
            return <EntypoIcon name={name} size={size} color={color} />;
        case 'FontAwesome5':
            return <FontAwesome5Icon name={name} size={size} color={color} />;
        case 'MaterialCommunityIcons':
            return <MaterialCommunityIcon name={name} size={size} color={color} />;
        case 'Feather':
            return <FeatherIcon name={name} size={size} color={color} />;
        case 'AntDesign':
            return <AntDesignIcon name={name} size={size} color={color} />;
        case 'Ionicons':
            return <IoniconsIcon name={name} size={size} color={color} />;
        default:
            return null;
    }
};

export default CustomIcon;
