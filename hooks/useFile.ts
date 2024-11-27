
const convertImageToBase64 = async (uri: string) => {
    console.log('1');
    let base64String: string | undefined;

    try {
      const response = await fetch(uri);
      const blob = await response.blob();
  
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('2');
        const result = reader.result ?? undefined;
        if(typeof result === 'string'){
            base64String = result.split(',')[1]; //to remove the prefix
            console.log('Base64 String:', base64String);
        }
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error converting image to Base64:', error);
    }
    console.log('3');

    return {
        base64String,
    };
  };
  