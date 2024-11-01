import Toast from 'react-native-simple-toast';
import { AxiosError } from 'axios';

const processError = (error: AxiosError, cb?: CallableFunction) => {
  let msg = '';
  let isProdEnv = process.env.NODE_ENV === 'production';

  if ((error?.response?.data as Record<string, any>)?.message) {
    msg = (error?.response?.data as Record<string, any>)?.message;

    if (!cb) {
      Toast.show(msg, Toast.LONG);
    } else {
      cb(msg);
    }
    return msg;
  } else if (
    (error?.response?.data as Record<string, any>)?.detail &&
    (error?.response?.data as Record<string, any>)?.detail instanceof Array
  ) {
    (error?.response?.data as Record<string, any>)?.detail?.map((det: { msg: string; loc: string | any[] }) => {
      msg = det?.msg;
      let field = det?.loc?.slice(-1);
      msg = `${field}:${msg}`;
      if (msg) {
        if (!cb) {
          Toast.show(msg, Toast.LONG);
        } else {
          cb(msg);
        }
        return msg;
      }
      return 'incomplete or incorrect details';
    });
  } else if ((error?.response?.data as Record<string, any>)?.detail) {
    msg = (error?.response?.data as Record<string, any>)?.detail;

    if (msg === 'Invalid Credentials') {
      // Handle navigation to login screen
    }

    if (cb) {
      cb(msg);
    } else {
      Toast.show(msg, Toast.LONG);
    }
    return msg;
  } else if (error?.response?.status === 422) {
    Toast.show('Incomplete or incorrect details', Toast.LONG);
    return 'Incomplete or incorrect details';
  } else if (error?.response?.status! >= 500) {
    Toast.show('We could not connect to the server', Toast.LONG);
    return 'We could not connect to the server';
  } else {
    if (!isProdEnv) {
      console.error({ error });
    }
    Toast.show('An Error Occurred', Toast.LONG);
  }
};

export default processError;
