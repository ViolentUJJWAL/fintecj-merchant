export const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

export const createFormData = (formData) => {
    const formDataToSend = new FormData();
    
    // Add all form fields
    Object.keys(formData).forEach(key => {
        if (formData[key] instanceof File) {
            formDataToSend.append(key, formData[key]);
        } else if (typeof formData[key] === 'object') {
            formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
            formDataToSend.append(key, formData[key]);
        }
    });

    return formDataToSend;
};