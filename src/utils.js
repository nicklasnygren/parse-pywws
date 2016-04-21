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

export function formatDate(date) {
  return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
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
