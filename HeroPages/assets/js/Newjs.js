document.addEventListener("DOMContentLoaded", () => {
    const scrollUpButton = document.querySelector(".go-top-button");
  
    // Scroll to top functionality
    const scrollTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  
    // Toggle visibility of the button on scroll
    let lastScrollTop = 0;
    window.addEventListener("scroll", () => {
      let scrollY = window.scrollY;
      if (scrollY > 110) {
        scrollUpButton.classList.add("active");
      } else {
        scrollUpButton.classList.remove("active");
      }
    });
  
    // Add click event to scroll to top
    scrollUpButton.addEventListener("click", scrollTop);
  });
  