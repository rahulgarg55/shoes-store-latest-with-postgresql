document.addEventListener('DOMContentLoaded',()=>{
    const loginform=document.getElementById('login-form') as HTMLFormElement;
    loginform.addEventListener('submit',(event)=>{
        event.preventDefault();
        const username=(loginform.elements.namedItem('username') as HTMLInputElement).value;
        const password=(loginform.elements.namedItem('password') as HTMLInputElement).value;
        const usertype=(loginform.elements.namedItem('usertype') as HTMLSelectElement).value;

        if(usertype==='admin'){
            window.location.href='admin_dashbord.html';
        }else{
            window.location.href='user_dashboard.html';
        }
    })
})