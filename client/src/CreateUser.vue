<template>
  <div>
    <div v-if="errorFlag" style="color: red">
      {{ error }}
    </div>

    <form >
      <div class="container" style="margin-bottom: 400px">
        <div class="row">
          <div class="col-sm-6 col-md-4 col-md-offset-4">
            <h1 class="text-center login-title">Sign in</h1>
            <div class="account-wall">
              <form class="form-signin">
                <form class="form-group">
                  <label><span class="glyphicon glyphicon-user"></span> Username</label>
                  <input v-model="username" class="form-control" placeholder="Username" required autofocus>
                </form>

                <form class="form-group">
                  <label><span class="glyphicon glyphicon-envelope"></span> Email</label>
                  <input v-model="email" class="form-control" type="text" placeholder="Email" required>
                </form>

                <form class="form-group">
                  <label><span class="glyphicon glyphicon-pencil"></span> Given Name</label>
                  <input v-model="firstname" class="form-control" type="text" placeholder="Given Name" required>
                </form>

                <form class="form-group">
                  <label><span class="glyphicon glyphicon-pencil"></span> Family Name</label>
                  <input v-model="lastname" class="form-control" type="text" placeholder="Family Name" required>
                </form>

                <form class="form-group">
                  <label><span class="glyphicon glyphicon-lock"></span> Password</label>
                  <input v-model="password" class="form-control" type="password" placeholder="Password" required>
                </form>

                <button v-on:click="createUser()" type="button" value="Add" class="btn btn-info btn-block">Create Account</button>
              </form>
            </div>
            <a href="/UserLogin" class="text-center new-account">Have an account? sign in</a>

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
            username: "",
            email: "",
            firstname: "",
            lastname: "",
            password: "",
            error: "",
            errorFlag: ""
          }
        },
      methods: {
          createUser: function(){
            alert("create users called");
            this.$http.post('http://localhost:4941/api/v1/users', JSON.stringify(
              {
                "username": this.username,
                "givenName": this.firstname,
                "familyName": this.lastname,
                "email": this.email,
                "password": this.password
              }
            ))
              .then(function(response){
                if(response.status == 201){
                  alert("new account: " + this.username + " created");
                  this.$router.push("/UserLogin");
                  this.$router.go(this.$router.currentRoute);
                } else {
                  alert("Something wen wrong =( status = " + response.status);
                  this.$router.push("/");
                  this.$router.go(this.$router.currentRoute);
                }
              }, function(error){
                this.error = error;
                this.errorFlag
              })
          }
      }
    }
</script>

<style>

</style>
