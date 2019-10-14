<template>
  <div id="login">


    <!-------login-------->
    <form >
      <div class="container" style="margin-bottom: 400px">
        <div class="row">
          <div class="col-sm-6 col-md-4 col-md-offset-4">
            <h1 class="text-center login-title">Sign in</h1>
            <div class="account-wall">
              <form class="form-signin">
                <form class="form-group">
                  <label><span class="glyphicon glyphicon-user"></span>Username/Emal</label>
                  <input v-model="username" class="form-control" placeholder="Username/Email" required autofocus>
                </form>

                <form class="form-group">
                  <label><span class="glyphicon glyphicon-lock"></span>Password</label>
                  <input v-model="password" class="form-control" type="password" placeholder="Password" required>

                </form>
                <button v-on:click="login()" type="button" value="Add" class="btn btn-info btn-block">Sign In</button>
              </form>
            </div>
            <a href="/CreateUser" class="text-center new-account">Create an account </a>

          </div>
        </div>
      </div>

    </form>
  </div>

</template>


<script>
    export default {
      data: function(){
        return {
          error:"",
          errorFlag: false,
          token: "",
          username: "",
          password: "",
          userid: "",
          output: "....."
        }},

        methods:{
          login: function() {

            if (this.username === "" && this.password === "") {
              alert("Enter a username and password");

            } else {
              alert("username = " + this.username + " password = " + this.password);
              this.$http.post('http://localhost:4941/api/v1/users/login', JSON.stringify(
                {
                  "username": this.username,
                  "password": this.password
                }))
                .then(function (response) {
                  this.output = response;
                  this.token = response.data.token;
                  this.userid = response.data.id;
                  this.$cookies.set("user_id", this.userid, "1h");
                  this.$cookies.set("user_session", this.token, "1h");
                  alert('login sucessfull, token = ' + this.$cookies.keys());
                  this.$router.push('/');
                  this.$router.go(this.$router.currentRoute);


                }, function (error) {
                  alert(error);
                  this.error = error;
                  this.errorFlag = true;
                })
            }
          }
        }
    }
</script>

<style>
</style>
