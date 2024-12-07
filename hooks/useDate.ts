
export const fromIsoDate = (isoDate?: string) => {
    let readableDate: string | undefined;

    if(isoDate){
        const formatter = new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
        
        readableDate = formatter.format(new Date(isoDate));
    }

    return {
        readableDate,
    };
}