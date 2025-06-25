const warning = document.getElementById('warning');

document.getElementById('register-btn').addEventListener('click', async () => {
    const hasErr = await showErr()
    if(hasErr){
        warning.textContent = "Please fill in all fields.";
    }
    else{
        await createUser()
        warning.textContent = "";

    
    }
} )

document.getElementById('arrowBtn').addEventListener('click', function() {
    document.getElementById('container').classList.add('show-form');
    
});

document.getElementById('checkbox').addEventListener('click', function() {
    this.style.backgroundColor = this.style.backgroundColor === 'white' ? '#4330a5' : 'white';
});

async function createUser(){
  const user = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    last_name: document.getElementById('last-name').value,
    age: document.getElementById('age').value
  }
  console.log(user)
  fetch('http://localhost:3000/users', {
    method:'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body:JSON.stringify(user)
  }).then((res)=> res.json())
  .then((res) =>{
      console.log(res)
      window.location.href = "/authorization/autho.html"
    })
    
  .catch((err) => console.log(err))
   .localStorage.setItem('token', res.data) 
}


function showErr() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const last_name = document.getElementById('last-name').value.trim()
    const age = document.getElementById('age').value.trim()

  
    if (!name || !email || !password || !age || !last_name) {

      return true;
    }
    return false;
  }
  
