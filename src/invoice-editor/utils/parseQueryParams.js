function parseEntry(key, value) {
  if (key === '') {
    return value;
  }

  return decodeURIComponent(value);
}

export function parseQueryParams() {
  try {
    const search = location.search.substring(1);
    if (search.length === 0) {
      return null;
    }
    return JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', parseEntry);
  } catch (error) {
    console.error('Error parsing query params', error);
    return null;
  }
}
