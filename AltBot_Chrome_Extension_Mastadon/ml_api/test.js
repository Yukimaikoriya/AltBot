async function getAltText(imageUrl) {
  const BASE_URL = 'https://yuuu.pythonanywhere.com/';

  const url = new URL(BASE_URL);
  url.searchParams.append('input', imageUrl);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data['text'];
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

(async () => {
  try {
    let image_src = "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D";
    let alt = await getAltText(image_src);
    console.log(alt);
  } catch (error) {
    console.error('Failed to get alt text:', error.message);
  }
})();