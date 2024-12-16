import analytics from '@react-native-firebase/analytics';


export const trackScreen = async (screenClassName, screenName) => {
   const track= await analytics().logScreenView( {
            screen_class: screenClassName,
            screen_name: screenName,
          });
}

export const trackButtonClick = async (btnName) => {
  await analytics().logEvent('button_clicked', {
      button_name: btnName
    })
}

export const trackSelected = async (digestName) => {
  await analytics().logEvent('selected_brief',{
    brief:digestName
  })
}