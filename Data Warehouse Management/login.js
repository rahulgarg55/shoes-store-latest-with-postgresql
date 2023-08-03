document.addEventListener('DOMContentLoaded', function () {
    var loginform = document.getElementById('login-form');
    loginform.addEventListener('submit', function (event) {
        event.preventDefault();
        var username = loginform.elements.namedItem('username').value;
        var password = loginform.elements.namedItem('password').value;
        var usertype = loginform.elements.namedItem('usertype').value;
        if (usertype === 'admin') {
            window.location.href = 'admin_dashbord.html';
        }
        else {
            window.location.href = 'user_dashboard.html';
        }
    });
});
