document.addEventListener("DOMContentLoaded", () => {
  const mainContainer = document.getElementById("main_container");
  const eyeDropperBtn = document.getElementById("eye_dropper_btn");
  const pickedColors = document.getElementById("picked_colors_container");

  // Function to copy color to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert(`Copied ${text} to clipboard!`);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };
});
