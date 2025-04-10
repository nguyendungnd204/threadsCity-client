import { Image } from 'react-native';

const iconMap = {
    home: {
      active: require('../assets/images/home-clicked.png'),
      inactive: require('../assets/images/home.png'),
    },
    user: {
      active: require('../assets/images/user-clicked.png'),
      inactive: require('../assets/images/user.png'),
    },
    favorite: {
      active: require('../assets/images/heart-clicked.png'),
      inactive: require('../assets/images/heart.png'),
    },
    create: {
        active: require('../assets/images/plus.png'),
        inactive: require('../assets/images/plus.png'),
    },
    search: {
        active: require('../assets/images/search.png'),
        inactive: require('../assets/images/search.png'),
    },
  };
   const IconTabs = ({ focused, color, size, name }) => {
  const iconSource = focused ? iconMap[name].active : iconMap[name].inactive;

  return (
    <Image
      source={iconSource}
      style={{ width: size, height: size, tintColor: focused ? 'black' : 'gray', }}
      resizeMode="contain"

    />
  );
};
export default IconTabs;