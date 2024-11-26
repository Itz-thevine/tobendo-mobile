
import { apiRequestHeaders, apiRequestMethod, useCallApi, useCallApiProps } from "./useCallApi";
import { useLocalUser } from "@/context/local-user/useLocalUser";

interface tsCallProps {
    formObject?: object;
    url: string;
    headers?: apiRequestHeaders;
    method?: apiRequestMethod;
    endContentType?: 'json' | 'form-data' | 'urlencoded';
}
export const useApi = (props?: useCallApiProps) => {
    const api = useCallApi(props);
    const localUser = useLocalUser();
    
    const handle = {
        call: (call_props: tsCallProps) => {
            const contentType = (
                call_props.endContentType === 'form-data' ? 'multipart/form-data' :
                call_props.endContentType === 'urlencoded' ? 'application/x-www-form-urlencoded' :
                'application/json'
            );
            let url = call_props.url;
            const method = call_props.method ?? 'get';

            const formData = new FormData();
            let queryParams = '';

            if(call_props.formObject){
                Object.entries(call_props.formObject).map(([name, value]) => {
                    if(method === 'get' && (value === undefined || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')){
                        queryParams += `${queryParams ? '&' : ''}${name}=${value ?? ''}`;
                    }

                    if(call_props.endContentType === 'form-data'){
                        if(typeof value === 'object'){
                            //could be a file;
                            const files = value as FileList | File | undefined;
                            if(files){
                                if(Array.isArray(files)){
                                    for(let a = 0; a < files.length; a++){
                                        const file = files[a];
                                        formData.append(`${name}[]`, file);
                                    }
                                }
                                else if(typeof files === 'object'){
                                    const file = files as File;
                                    formData.append(`${name}`, file);
                                }
                            }
                        }
                        else {
                            formData.append(name, value || '');
                        }
                    }
                })
            };
            if(queryParams){
                url += `?${queryParams}`;
            }

            const form = (
                call_props.endContentType === 'form-data' ? formData :
                call_props.endContentType === 'urlencoded' ? "" :
                JSON.stringify(call_props.formObject)
            );
            
            api.call({
                form: form,
                method,
                url,
                headers: {
                    'Content-Type': contentType,
                    'Accept': contentType,
                    // 'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${localUser?.data?.access_token}`,
                    ...call_props.headers
                },
            });
        },
    };

    return {
        response: api.response,
        ...handle,
    };
}