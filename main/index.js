
//კომენტარის დამატება
document.querySelector(".send-comment").addEventListener("click", function () {
    const input = document.querySelector(".write-comment");
    const commentText = input.value.trim();
    const list = document.querySelector(".comment-list");

    if (!commentText) {
        alert("Please enter a comment.");
        return;
    }

    const commentBubble = document.createElement("div");
    commentBubble.className = "user-comment";
    commentBubble.innerHTML = `
        <p>${commentText}</p>
        <button class="delete-comment">Delete</button>
    `;

    // კომენტარის წაშლა
    commentBubble.querySelector(".delete-comment").addEventListener("click", function () {
        commentBubble.remove();
    });

    list.appendChild(commentBubble);
    input.value = "";
});


   // ფოტოს გამოჩენა
  const fileInput = document.getElementById('profile-upload');
  const preview = document.getElementById('profile-preview');

  fileInput.addEventListener('change', () => {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

