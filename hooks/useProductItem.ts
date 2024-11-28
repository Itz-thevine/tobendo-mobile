import { userProductItem } from "./api/user/getUserProducts";

export const getImagesFromProductItem = (item?: userProductItem) => {
    let image1 = require('@/assets/images/no-image.jpg');
    let image2 = require('@/assets/images/no-image.jpg');
  
    if(item?.images){
      if(item?.images[1]){
        image1 = {uri : item?.images[1]};
        image2 = {uri : item?.images[1]};
      }
      if(item?.images[0]){
        image1 = {uri : item?.images[0]};
      }
    }

    return {
        image1,
        image2,
    }
}