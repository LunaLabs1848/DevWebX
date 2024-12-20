document.addEventListener("DOMContentLoaded", () => {
  const eyeDropperBtn = document.getElementById("eye_dropper_btn");
  const pickedColors = document.getElementById("picked_colors_container");

  if (!eyeDropperBtn || !pickedColors) {
    console.error("Button element not found!");
    return;
  }

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

  const calculateLuminance = (hexColor) => {
    // Convert hex color to RGB
    const rgb = hexColor.match(/[A-Za-z0-9]{2}/g).map((x) => parseInt(x, 16));
    // Calculate relative luminance
    const [r, g, b] = rgb.map((channel) => {
      const scaled = channel / 255;
      return scaled <= 0.03928
        ? scaled / 12.92
        : Math.pow((scaled + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const getTextColor = (hexColor) => {
    const luminance = calculateLuminance(hexColor);
    return luminance > 0.5 ? "#333333" : "#F0F0F0"; // Dark gray for light colors, off-white for dark colors
  };

  // Function to render picked colors
  const renderPickedColors = (colors) => {
    pickedColors.innerHTML = ""; // Clear existing colors
    colors.reverse().forEach((color) => {
      const colorItem = document.createElement("div");
      colorItem.classList.add("color-item");
      colorItem.style.backgroundColor = color;
      colorItem.style.color = getTextColor(color);
      colorItem.textContent = color;
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
      // Keep only the latest 10 colors
      if (colors.length > 10) {
        colors.shift(); // Remove the oldest color
      }
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
