<template>
  <div id="app">
    <div id="AuctionMain">
      <!------ Logo ------>
      <img src="assets/logo3.png" margin-bottom="20"/>

      <div v-if="errorFlag" style="color: red">
        {{ error }}
      </div>

      <!----------------------------------------------------------- Main NavBar ----------------------------------------------->
      <nav class="navbar navbar-inverse" bg-secondary>
        <div class="container-fluid">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="/">QWIK<span style="color: dodgerblue;">TRADER</span></a>
          </div>
          <div class="collapse navbar-collapse" id="myNavbar">
            <ul class="nav navbar-nav">
              <ul class="nav navbar-nav">
                <li><a href="/">Home </a>
                <li><router-link :to="{name: 'getAuctions'}">Auctions</router-link></li>
                <li v-if="loggedIn">
                  <router-link :to="{name: 'createAuction'}">Create Auction</router-link></li>
                <li v-if="loggedIn">
                  <router-link :to="{name: 'userAuctions'}">My Auctions</router-link></li>
                <li v-if="loggedIn">
                  <router-link :to="{name: 'createAuction'}">My Watch list</router-link></li>
                <li v-if="loggedIn">
                  <router-link :to="{name: 'createAuction'}">Won</router-link></li>
              </ul>
              <li v-if="loggedIn">
                <router-link :to="{name: 'createAuction'}">Lost</router-link></li>
            </ul>
            <ul>
              <ul class="nav navbar-nav navbar-right" v-if="loggedIn">
                <li><a v-on:click="Logout()"><span class="glyphicon glyphicon-log-out"></span> Logout</a></li>
                <li><router-link :to="{name: 'viewUser', params: { id: this.$cookies.get('user_id') }}"><span class="glyphicon glyphicon-user"></span> My Account</router-link></li>
              </ul>
              <ul class="nav navbar-nav navbar-right" v-if="!loggedIn">
              <li>
                <a href="/createUser"><span class="glyphicon glyphicon-pencil"></span> Create Account</a>
              </li>
              <li>
                <a href="/userLogin"><span class="glyphicon glyphicon-log-in"></span> Login</a>
              </li>
              </ul>
            </ul>
          </div>
        </div>
      </nav>

      <!--------------------------------------------------------------- End of NavBar -------------------------------------------------->


        </div>


    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    data: function(){
      return {
        loggedIn: false,
        error: "",
        errorFlag: false,
        searchString: ""

      }
    },

    mounted: function(){
      this.getLoggedIn();
    },

    methods: {
      // Check user is logged in
      getLoggedIn: function(){
        if(this.$cookies.isKey("user_session")){
          this.loggedIn = true;
          alert("logged in")
        } else {
          this.loggedIn = false;
          alert(this.getLoggedIn())
        }
      },

    // Log user out, removing token from cookies
    Logout: function() {
      alert("Logout called");
      this.$http.post('http://localhost:4941/api/v1/users/logout',
        {}, {
          headers: {'X-Authorization': this.$cookies.get("user_session")}
        })
        .then(function (response) {
          if (response.status == 200) {
            alert("logged out");
            this.loggedIn = false;
            this.$cookies.remove("user_session");
            this.$cookies.remove("user_id");
            this.$router.push("/");
            this.$router.go(this.$router.currentRoute);
          } else {
            alert(response.status);
          }
        }, function (error) {
          alert(error);
          this.error = error;
          this.errorFlag = true;
        });
    }
    }
  }
</script>
<style>
  #app{
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 10px;
  }

  ul{
    text-align: center;
  }

  table{
    text-align: center;
  }

  img{
    padding: 20px;
  }

</style>
