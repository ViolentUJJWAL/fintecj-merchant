export const useFormValidation = () => {
    const validateField = (field, value) => {
        let error = '';
        switch (field) {
            case 'name':
                if (!value.trim()) error = 'Full name is required';
                else if (value.length < 2) error = 'Name must be at least 2 characters';
                else if (!/^[a-zA-Z\s]*$/.test(value)) error = 'Name can only contain letters';
                break;
            // ... rest of the validation cases
        }
        return error;
    };

    const validateStep = (step, formData, stepFields) => {
        const fieldsToValidate = stepFields[step];
        const newErrors = {};
        let isValid = true;

        fieldsToValidate.forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
        });

        return { isValid, errors: newErrors };
    };

    return {
        validateField,
        validateStep
    };
};