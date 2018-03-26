function formatDateTime(inputTime, flag) {
  const date = new Date(inputTime);
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  if (flag === 'line') {
    return y + "-" + m + "-" + d;
  } else {
    return  y + "." + m + "." + d;
  }
};

export { formatDateTime };
