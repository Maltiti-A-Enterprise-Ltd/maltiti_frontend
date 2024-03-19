export const emailValidator = (email) => {
  if (email === "") {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email";
  }
  return "";
};

export const passwordValidator = (password) => {
  if (password === "") {
    return "Password is required";
  }
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return "Password must be at least 8 characters, include atleast one upper case, one symbol and one number";
  }
  return "";
};

export const confirmPasswordValidator = (password, confirmPassword) => {
  if (confirmPassword === "") {
    return "Confirm Password is required";
  }

  if (confirmPassword !== password) {
    return "Confirm Password and password must be the same";
  }

  return "";
};

export const requiredValidator = (field) => {
  if (field === "") {
    return "This field is required";
  }
  return "";
};

export const capitalizeNames = (name) => {
  const names = name.split(" ");
  let fullName = "";
  for (let i = 0; i < names.length; i++) {
    const firstLetter = names[i].substring(0, 1).toUpperCase();
    const restOfLetters = names[i].substring(1).toLowerCase();
    fullName += firstLetter + restOfLetters + " ";
  }

  return fullName.trim();
};
