
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
        // console.log(result);
        alert("Đăng kí tài khoản thành công")
        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem('user', JSON.stringify(name));
        window.location.href = 'carts.html';
    }).catch(function (error) {
        // console.log(error);
        alert("Email đã được sử dụng")

    });

}

function SignIn() {
    const email = document.getElementById("emailLogin").value;
    const password = document.getElementById("passwordLogin").value;

    var tkKhachHang = new Login(email, password);

    axios({
        method: 'post',
        url: 'https://shop.cyberlearn.vn/api/Users/signin',
        data: tkKhachHang
    }).then(function (result) {
        console.log(result);
        alert("Đăng nhập thành công");
        // Lưu thông tin dang nhap vào localStorage
        localStorage.setItem('user', JSON.stringify(result.data));
        window.location.href = 'carts.html';
    }).catch(function (error) {
        // console.log(error);
        alert("Đăng nhập thất bại");
    });


}















