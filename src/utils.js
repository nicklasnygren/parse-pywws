export function parseDate(date) {
  const parsedDate = Date.parse(date);
  if (!isNaN(parsedDate)) {
    return new Date(parsedDate);
  }

  try {
    return new Date(date);
  }
  catch (err) {
    return null;
  }
}

export function dateRange(start, end) {
  if (!start || !end) {
    throw new TypeError('range.date called with invalid aguments');
  }

  const startDate = parseDate(start);
  const endDate = parseDate(end);

  let res = [];
  let n = -1;
  let curDate;

  do {
    curDate = new Date(+startDate + (++n * 24 * 60 * 60 * 1000));
    res.push(curDate.toISOString().split('T')[0]);
  }
  while (curDate <= endDate);
  return res;
}

// Get a range of ints starting at min and ending at max
//
export function intRange(min, max) {
  const res = [];

  for (let i = min; i <= max; i++) {
    res.push(i);
  }

  return res;
}

export function getDateTimeFilter(date, before) {
  return item => {
    const timestamp = new Date(item[0]);

    if (before) {
      return timestamp <= date;
    }
    else {
      return timestamp >= date;
    }
  };
}
