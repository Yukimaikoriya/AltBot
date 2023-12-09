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
    let image_src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/440px-Image_created_with_a_mobile_phone.png';
    let alt = await getAltText(image_src);
    console.log(alt);
  } catch (error) {
    console.error('Failed to get alt text:', error.message);
  }
})();