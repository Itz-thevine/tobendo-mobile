
import { useState } from "react";

export type apiRequestHeaders = HeadersInit | undefined;
export type apiRequestMethod = 'get' | 'post' | 'delete';
type CallProps = {
    method?: apiRequestMethod;
    form: FormData | string;
    headers?: apiRequestHeaders;
    url: string;
}
type ResponseProps = {
    error?: string;
    success?: boolean;
    data?: unknown;
    loading?: boolean;
    key: string;
}
export type useCallApiProps = {
    
}
export const useCallApi = (props?: useCallApiProps) => {
    const [response, setResponse] = useState<ResponseProps>({
        key: '',
    });

    const call = async (call_props: CallProps) => {
        setResponse({
            ...response,
            key: `${Date.now()}`,
            loading: true,
            error: undefined,
        });

        try {
            const newResponse = {...response};
            let url = call_props.url;
            const fetchReqs: RequestInit = {
                method: call_props.method,
                headers: call_props.headers,
                // credentials: 'include',
            };
            if(call_props.method && !['get', 'head'].includes(call_props.method.toLowerCase())){
                fetchReqs.body = call_props.form;
            }
            const fetchResp = await fetch(url, fetchReqs);

            if(fetchResp.ok){
                const fetchData = await fetchResp.json();
                newResponse.success = true;
                newResponse.data = fetchData;
            }
            else {
                newResponse.success = false;
                newResponse.data = undefined;
                newResponse.error = 'something went wrong';
            }
            
            newResponse.loading = false;
            newResponse.key = `${Date.now()}`;
            setResponse({...newResponse});
        }
        catch(err){
            console.log(err);

            const newResponse = {...response};
            newResponse.data = undefined;
            newResponse.loading = false;
            newResponse.success = false;
            newResponse.error = 'something went wrong';
            // newResponse.error = err.response?.data?.error || err.response?.data?.message || 'something went wrong';
            newResponse.key = `${Date.now()}`;
            setResponse({...newResponse});
        }
    }

    return {
        response,
        call,
    };
}