
// SIGN UP / SIGN IN
function ThemTK() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const gender = document.getElementById("gender").value === "male";
    // console.log(name, email, password, phone, gender);

    var tkKhachHang = new SignUp(name, email, password, phone, gender);

    axios({
        method: 'post',
        url: 'https://shop.cyberlearn.vn/api/Users/signup',
        data: tkKhachHang
    }).then(function (result) {
        console.log(result);
        alert("Đăng kí tài khoản thành công")
        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem('user', name);
        window.location.href = 'carts.html';
    }).catch(function (error) {
        console.log(error);
        alert("Email đã được sử dụng")

    });

    // Nếu thông tin người dùng tồn tại trong localStorage, in ra tên đầy đủ của người dùng.
    const userNameEl = document.querySelector('.user-name');
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        userNameEl.innerHTML = user.name;
    }

}
function SignIn() {
    const email = document.getElementById("emailLogin").value;
    const password = document.getElementById("passwordLogin").value;

    // console.log(name, password);

    var tkKhachHang = new Login(email, password)

    axios({
        method: 'post',
        url: 'https://shop.cyberlearn.vn/api/Users/signin',
        data: tkKhachHang
    }).then(function (result) {
        console.log(result);
        alert("Đăng nhập thành công");
        window.location.href = 'carts.html';
    }).catch(function (error) {
        console.log(error);
        alert("Đăng nhập thất bại");
    });

    // Nếu thông tin người dùng tồn tại trong localStorage, in ra tên đầy đủ của người dùng.
    const userNameEl = document.querySelector('.user-name');
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        userNameEl.innerHTML = user.name;
    }


}


// const logoutBtn = document.querySelector('.logout-btn');
// logoutBtn.addEventListener('click', () => {
//     localStorage.removeItem('user');
//     window.location.href = 'carts.html';
// });















