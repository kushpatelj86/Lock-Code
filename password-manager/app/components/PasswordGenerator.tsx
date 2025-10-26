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

  password = password.split("").sort(() => Math.random() - 0.5).join("");

  return password;
}
