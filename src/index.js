document.addEventListener("DOMContentLoaded", () => {
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

  // Function to render picked colors
  const renderPickedColors = (colors) => {
    pickedColors.innerHTML = ""; // Clear existing colors
    colors.forEach((color) => {
      const colorItem = document.createElement("div");
      colorItem.classList.add("color-item");
      colorItem.style.backgroundColor = color;
      colorItem.title = color;

      colorItem.addEventListener("click", () => {
        copyToClipboard(color);
      });

      pickedColors.appendChild(colorItem);
    });
  };

  // Fetch stored colors from local storage
  const getStoredColors = () => {
    const colors = localStorage.getItem("pickedColors");
    return colors ? JSON.parse(colors) : [];
  };

  // Store colors in local storage
  const storeColor = (color) => {
    const colors = getStoredColors();
    if (!colors.includes(color)) {
      colors.push(color);
      localStorage.setItem("pickedColors", JSON.stringify(colors));
      renderPickedColors(colors);
    }
  };

  // Initialize picked colors on load
  renderPickedColors(getStoredColors());

  // EyeDropper functionality
  eyeDropperBtn.addEventListener("click", async () => {
    if (!window.EyeDropper) {
      alert("EyeDropper API is not supported in this browser.");
      return;
    }

    try {
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      const pickedColor = result.sRGBHex;
      storeColor(pickedColor);
      copyToClipboard(pickedColor);
    } catch (error) {
      console.error("Error using EyeDropper: ", error);
    }
  });
});
