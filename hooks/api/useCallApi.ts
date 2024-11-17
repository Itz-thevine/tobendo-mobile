
import { useState } from "react";

export type apiRequestHeaders = HeadersInit | undefined;
export type apiRequestMethod = 'get' | 'post' | 'delete' | 'put';
type CallProps = {
    method?: apiRequestMethod;
    form: FormData | string;
    headers?: apiRequestHeaders;
    url: string;
}

type errorDetailItem = {
    msg?: string;
};
type errorDetail = errorDetailItem[] | string;

type ResponseProps = {
    error?: string;
    errorDetail?: any;
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

        let rawFetchResp: any;
        
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
            rawFetchResp = fetchResp;
            const fetchData = await fetchResp.json();

            if(fetchResp.ok){
                newResponse.success = true;
                newResponse.data = fetchData;
            }
            else {
                const detail = fetchData?.detail as errorDetail | undefined;
                const errorMsg = (
                    typeof detail === 'string' ? detail :
                    Array.isArray(detail) ? detail[0].msg : undefined
                );
                newResponse.success = false;
                newResponse.data = undefined;
                newResponse.error = errorMsg ?? 'something went wrong';
                newResponse.errorDetail = fetchData?.detail;

                console.log('---useCallApi--error---', fetchData?.detail)
            }
            
            newResponse.loading = false;
            newResponse.key = `${Date.now()}`;
            setResponse({...newResponse});
        }
        catch(err){
            console.log('---useCallApi--catch---', err, rawFetchResp);

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