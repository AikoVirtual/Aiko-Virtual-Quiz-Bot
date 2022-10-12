const padTo2Digits = (num) => {
  return num.toString().padStart(2, '0');
}

const convertMsToMinutesSeconds = (milliseconds) => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.round((milliseconds % 60000) / 1000);

  return seconds === 60
    ? `${minutes + 1}`
    : `${minutes}:${padTo2Digits(seconds)}`;
}

exports.padTo2Digits = padTo2Digits;
exports.convertMsToMinutesSeconds = convertMsToMinutesSeconds;