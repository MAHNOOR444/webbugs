document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signInBtn = document.getElementById('signInBtn');

    if (signInBtn && loginForm) {
        signInBtn.addEventListener('click', function(event) {
            event.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            if (email === '' || password === '') {
                alert('Please fill in both Email and Password fields.');
                return;
            }
            if (email === 'admin@hospital.com' && password === '123456')
                 {
                        window.location.href = '../dashboard.html';
                 }
                  else 
                {
                        alert('Invalid email or password. Please try again.');
                }
            console.log('Login Successful!');
            console.log('Email:', email);
            console.log('Password:', password);
            
           
        });
    }
});