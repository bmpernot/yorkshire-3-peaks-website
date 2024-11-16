"use client";

const openEmail = () => {
  window.location = "mailto:yorkshirepeaks@gmail.com";
};

function validateInputs(setErrors, formValidations) {
  let isValid = true;

  formValidations.forEach((formValidation) => {
    if (formValidation.validation(...formValidation.element)) {
      setErrors((errors) => {
        let newErrors = { ...errors };
        if (!errors[formValidation.field].includes(formValidation.errorMessage)) {
          newErrors = {
            ...errors,
            [formValidation.field]: [...errors[formValidation.field], formValidation.errorMessage],
          };
        }
        isValid = errors[formValidation.field].length > 0 ? false : true;
        return newErrors;
      });
    } else {
      setErrors((errors) => {
        let newErrors = { ...errors };
        if (errors[formValidation.field].includes(formValidation.errorMessage)) {
          const updatedFieldErrors = errors[formValidation.field].filter(
            (element) => element !== formValidation.errorMessage,
          );
          newErrors = {
            ...errors,
            [formValidation.field]: updatedFieldErrors,
          };
        }
        return newErrors;
      });
    }
  });

  return isValid;
}

export { openEmail, validateInputs };
