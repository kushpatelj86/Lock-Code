type CrackEstimate = {
  combos: number;
  years: number;
  seconds: number;
  passedChecks: { lowercase: boolean; uppercase: boolean; digits: boolean; symbols: boolean };
  charsetSize: number;
};

export function estimateCrackTime(password: string, guessesPerSecond = 1e9): CrackEstimate {
  const lower = /[a-z]/.test(password);
  const upper = /[A-Z]/.test(password);
  const digits = /[0-9]/.test(password);
  const symbols = /[^A-Za-z0-9]/.test(password);

  let charset = 0;
  if (lower) 
  {
    charset += 26;
  }
  if (upper) 
  {
    charset += 26;
  }
  if (digits) 
  {
    charset += 10;
  }
  if (symbols) 
  {
    charset += 33;
  }

  if (charset === 0) 
  {
    charset = 1;
  }

  const length = password.length;
  const combos = Math.pow(charset, length);

  const seconds = combos / guessesPerSecond;
  const years = seconds / (3600 * 24 * 365);

  return {
    combos,
    seconds,
    years,
    passedChecks: { lowercase: lower, uppercase: upper, digits, symbols },
    charsetSize: charset,
  };
}

export function formatYears(y: number): string {
  if (!isFinite(y)) 
  {
    return "∞";
  }
  if (y < 1e-6) 
  {
    return "< 1 microyear";
  }
  if (y < 1e-3)
  { 
    return "< 1 milliyear";
  }
  if (y < 1)
  { 
    return `${(y * 365).toFixed(2)} days`;
  }
  if (y < 1000)
  { 
    return `${y.toFixed(2)} years`;
  }



  const powers = ["k", "M", "B", "T"];
  let v = y;
  let idx = -1;
  while (v >= 1000 && idx < powers.length - 1) 
  {
    v /= 1000;
    idx++;
  }
  if(idx >= 0)
  {
    return `${v.toFixed(2)} ${powers[idx]} years`
  }
  else
  {
      return `${y.toFixed(2)} years`;

  }
}
