import { Image } from 'react-native';
import { icons } from '../constants/icons';

const iconMap = {
    home: {
      active: icons.home_clicked,
      inactive: icons.home,
    },
    user: {
      active: icons.user_clicked,
      inactive: icons.user,
    },
    favorite: {
      active: icons.heart_clicked,
      inactive: icons.heart,
    },
    create: {
        active: icons.plus,
        inactive: icons.plus,
    },
    search: {
        active: icons.search,
        inactive: icons.search,
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