
type promiseResponse = {
    base64String?: string;
    error?: string;
}
type promiseCallback = (promiseResponse: promiseResponse) => void;
const promiseToConvertImageToBase64 = (uri: string) => {
    return new Promise(async (resolve: promiseCallback, reject: promiseCallback) => {
        if(uri){
            try {
            const response = await fetch(uri);
            const blob = await response.blob();
        
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result ?? undefined;
                if(typeof result === 'string'){
                    resolve({
                        base64String: result,
                    });
                    // base64String = result.split(',')[1]; //to remove the prefix
                    console.log('Base64 String:', result);
                }
                else {
                    reject({
                        error: `could not convert image`,
                    });
                }
            };
            reader.readAsDataURL(blob);
            } catch (error) {
                console.error(error);
                reject({
                    error: `error converting image to Base64`,
                });
            }
        }
    });
};
export const convertImageToBase64 = async (uri: string) => {
    const base64String = (await promiseToConvertImageToBase64(uri)).base64String;

    return {
        base64String,
    };
  };
  