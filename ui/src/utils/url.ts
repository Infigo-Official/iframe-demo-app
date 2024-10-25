// Function to add a parameter to the query string
export function addToQueryString(url: string, key: string, value: string | boolean | number) {
  // Check if the URL is relative
  const isRelative = !url.startsWith('http://') && !url.startsWith('https://');

  // If the URL is relative, prepend the current location to it
  if (isRelative) {
    url = `${window.location.origin}${url}`;
  }

  // Get the current URL
  const urlObj = new URL(url);

  // Use URLSearchParams to manipulate the query string
  const params = new URLSearchParams(urlObj.search);

  // Add or update the parameter
  params.set(key, value?.toString());

  // Update the URL with the new query string
  urlObj.search = params.toString();

  // Return the URL without the origin if it was relative
  return isRelative ? urlObj.pathname + urlObj.search : urlObj.toString();
}
