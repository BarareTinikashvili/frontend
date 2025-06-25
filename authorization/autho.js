const warning = document.getElementById('warning');
const submitBtn = document.querySelector('.inputs button');

submitBtn.addEventListener('click', () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const agreed = document.getElementById('check').checked;

    if (!email || !password) {
        warning.textContent = "Please fill in all fields.";
    } else if (!agreed) {
        warning.textContent = "You must agree to the Terms and Conditions.";
    } else {
        warning.textContent = "";
        loginUser()
    }
});


async function loginUser(){
  const user = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,

  }
  console.log(user)
  fetch('http://localhost:3000/users/login', {
    method:'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body:JSON.stringify(user)
  }).then((res)=> res.json())
  .then((res) =>{
      console.log(res)
      localStorage.setItem('user', JSON.stringify(res.user))
      window.location.href = "/main/index.html"
    })
  .catch((err) => console.log(err))
}