function getRandomChar(set: string) {
  return set[Math.floor(Math.random() * set.length)];
}

export function generateRandomPassword(length = 16) {
   length = Math.floor(Math.random() * 40) + 12;

  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digitChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let password = "";

  for (let i = 0; i < 4; i++) 
  {
    if (i == 0) 
    {
      password += getRandomChar(lowerChars); // lowercase
    } 
    else if (i == 1) 
    {
      password += getRandomChar(upperChars); // uppercase
    } 
    else if (i == 2) 
    {
      password += getRandomChar(digitChars); // digit
    } 
    else if (i == 3) 
    {
      password += getRandomChar(symbolChars); // symbol
    }
  }

  const allChars = lowerChars + upperChars + digitChars + symbolChars;
  while (password.length < length) 
  {
    password += getRandomChar(allChars);
  }

  let pass_arr = password.split("");
  for (let i = pass_arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    let temp = pass_arr[i];
    pass_arr[i] = pass_arr[j];
    pass_arr[j] = temp;
  }
  let pass = pass_arr.join("")


  return pass;
}
