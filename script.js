function speak(text) {
  const characterContainer = document.getElementById('character-container');
  const textElement = document.getElementById('text');

  textElement.innerText = text;
  characterContainer.classList.add('show-bubble');

  setTimeout(() => {
    characterContainer.classList.remove('show-bubble');
  }, 5000); // Hide text bubble after 2 seconds
}
