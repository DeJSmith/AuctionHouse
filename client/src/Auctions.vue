<template>
  <div id="AuctionMain">

    <div v-on:load="getLoggedIn()"></div>
    <div v-if="errorFlag" style="color: red">
      {{ error }}
    </div>

    <!--------------------------------------------------------- Single Auction -------------------------------------------------------->
    <h1 v-if="!auctionTitle" class="text-center">{{title}}</h1>

    <div v-if="this.$route.path == '/auctions'">
      <form>
        <ul>
          <li style="padding-top: 10px">
            <input v-model="searchParams.searchString" id="searchInput"  type="text" placeholder="Search Auctions..">
            <button type="button" class="btn btn-xs" id="submitStr" v-on:click="getXAuctions()">Submit</button>
          </li>

          <li style="padding-top: 13px; padding-left: 8px">

            <!------- Open search param modal -------->
            <button type="button" class="btn btn-xs" data-toggle="modal" data-target="#searchModal">Refine Search</button>
          </li>
        </ul>
      </form>

      <div>

        <!-- Refine Modal -->
        <div class="modal fade" id="searchModal" role="dialog">
          <div class="modal-dialog">

            <!-- Modal content-->
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Filter By</h4>
              </div>
              <div class="modal-body">
                <table>

                  <tr>
                    <td style="text-align: left">Auction Status: </td>
                    <td style="padding-left: 5px">
                      <select class="form-control" id="selStatus">
                        <option> </option>
                        <option>active</option>
                        <option>expired</option>
                        <option>won</option>
                        <option>upcomming</option>
                      </select>
                    </td>
                  </tr>

                  <tr>
                    <td style="text-align: left">Auction Category: </td>
                    <td style="padding-left: 5px">
                      <select class="form-control" id="selCategoryId">
                        <option> </option>
                        <option>Apparel</option>
                        <option>Equipment</option>
                        <option>Vehicles</option>
                        <option>Property</option>
                        <option>Other</option>
                      </select>
                    </td>
                  </tr>

                </table>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal" id="searchSumbit" v-on:click="getSerchParams()">Submit</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div v-if="$route.params.aucId">
      <div id="Auction">
        <div v-if="!personalAuction">
        <router-link :to="{name: 'getAuctions' }">Back to Auctions</router-link>
        </div>

        <div v-if="personalAuction">
          <router-link :to="{name: 'userAuctions' }">Back to My Auctions</router-link>
        </div>
        <br /><br />

        <table class="col-md-12" style="text-align: center">
          <tr>
            <td><h2>{{getSingleAuction($route.params.aucId).title }}</h2></td>
          </tr>

          <br /><br />

          <tr>
            <td><img src="assets/logo.png"/></td>
          </tr>
          <!---------------------------------------- Auction Details ---------------------------------------->
          <tr style="background-color: aliceblue">
            <td>
              <div class="container">
                <h2>Auction Details</h2>
                <div class="panel-group">
                  <div class="panel panel-default">
                    <div class="panel-heading">Seller</div>
                    <div class="panel-body">{{this.auction.seller}}</div>
                    <div class="panel-heading">Auction Opened</div>
                    <div class="panel-body">{{this.auction.startDateTime}}</div>
                    <div class="panel-heading">Auction Ends</div>
                    <div class="panel-body">{{this.auction.endDateTime}}</div>
                    <div class="panel-heading">Item Description</div>
                    <div class="panel-body">{{this.auction.description}}</div>
                  </div>
                  <div class="panel panel-default">
                    <div class="panel-heading">ReservePrice</div>
                    <div class="panel-body">{{"$" + this.auction.reservePrice}}</div>
                    <div class="panel-heading">Current Bid</div>
                    <div class="panel-body">{{"$" + this.auction.currentBid}}</div>
                  </div>
                  <div class="panel panel-default" style="text-align: center">
                    <div class="panel-heading" style="text-align: center">Bid History</div>
                      <table v-for="bid in auction.bids" style="text-align: center">
                        <tr style="text-align: center">
                          <td><div class="panel-heading">{{"User: " + bid.buyerUsername}}</div></td>
                        </tr>
                        <tr>
                          <td><div class="panel-body">{{"Time: " + getDate(bid.datetime)}}</div></td>
                        </tr>
                        <tr>
                          <td><div class="panel-body">{{"Amount: $" + bid.amount}}</div></td>
                        </tr>
                      </table>
                  </div>
                  <div class="panel-heading"><span><button type="button" class="btn btn-xl" data-toggle="modal" data-target="#bidModal">Place Bid</button></span>
                  <!-- bid Modal -->
                  <div class="modal fade" id="bidModal" role="dialog">
                    <div class="modal-dialog">

                      <!-- bid content-->
                      <div class="modal-content">
                        <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal">&times;</button>
                          <h4 class="modal-title">Place Bid</h4>
                        </div>
                        <div class="modal-body">
                          <table>

                            <tr>
                              <td style="text-align: left">Bid: </td>
                              <td><input v-model="bid" id="bidInput"  type="text" placeholder=" Amount"></td>
                            </tr>

                          </table>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-default" data-dismiss="modal" id="bidSumbit" v-on:click="placeBid($route.params.aucId)">Submit</button>
                          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </table>

      </div>
    </div>




    <!-------------------------------------------------- All Auctions ---------------------------------------------------->
    <div v-else>
      <div v-if="this.currentCategory != ''">
        <h2>{{this.currentCategory}}</h2>

      </div>
      <div id="Auctions" style="padding-left: 420px; padding-top: 50px; padding-bottom: 50px;">
        <table>
          <tr v-for="auction in auctions">
            <td><router-link :to="{ name: 'getAuction', params: { aucId: auction.id}}"><h3>{{auction.title}}</h3></router-link></td>
            <td><img src="assets/churr.jpg"/> </td>
          </tr>
        </table>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        personalAuction: false,
        title: 'Auctions',
        error: "",
        errorFlag: false,
        currentCategory: '',
        auctions: [],
        bid: "",
        auction: {
          id: "",
          categoryTitle: "",
          categoryId: "",
          title: "",
          seller: "",
          description: "",
          reservePrice: "",
          startDateTime: "",
          endDateTime: "",
          currentBid: "",
          bids: []
        },
        auctionTitle: false,
        loggedIn: false,

        searchParams: {
          searchString: "",
          categoryId: 0,
          auctionStatus: ""
        }
      }
    },

    mounted: function() {
      this.getAuctions();
    },

    methods: {
      //Default get all auctions
      getAuctions: function(){
        this.$http.get('http://localhost:4941/api/v1/auctions')
          .then(function(response){
            this.auctions = response.data;
          }, function(error){
            this.error = error;
            this.errorFlag = true;
          });
      },


      //gets all details about single auction
      getSingleAuction: function(id){
        this.$http.get('http://localhost:4941/api/v1/auctions/' + id)
          .then(function(response){
            var userId = this.$cookies.get("user_id");
            var data = response.body;
            if(userId == data.seller.id){
              this.personalAuction = true;
            }
            this.auction.seller = data.seller.username;
            this.auction.title = data.title;
            this.auction.description = data.description;
            this.auction.reservePrice= data.reservePrice;
            var startDate = new Date(data.startDateTime);
            var endDate = new Date(data.endDateTime);
            this.auction.startDateTime = startDate;
            this.auction.endDateTime = endDate;
            this.auction.currentBid = data.currentBid;
            this.auction.bids = data.bids;
            this.sortBids();
          }, function(error){
            this.error = error;
            this.errorFlag = true;
          });
        return this.auction;
      },

      sortBids: function(){
        var sorted = [];
        for(var i = this.auction.bids.length - 1; i > 1; i--){
          sorted.push(this.auction.bids[i])
        }
        this.auction.bids = sorted;
      },

      //Get the photo for each auction
      getAuctionPhoto: function (id) {
        this.$http.get('http://localhost:4941/api/v1/auctions/:' + id + '/photos')
          .then(function(response){
            return(response.photo_image_URI);
          }, function(error){
            this.error = error;
            this.errorFlag = true;
          });
      },

      placeBid: function(id){
        if(this.$cookies.isKey("user_session")) {
          var today = Date.now();
          var endDate = this.auction.endDateTime.getTime();

          if (endDate > today) {

            if (this.bid > this.auction.currentBid) {
              this.$http.post('http://localhost:4941/api/v1/auctions/' + id + '/bids?amount=' + this.bid, {}, {
                headers: {'X-Authorization': this.$cookies.get("user_session")}
              })
                .then(function (response) {
                  if (response.status == 201) {
                    alert("bid successfully place");
                  } else {
                    alert("something went wrong");
                  }
                }, function (error) {
                  this.error = error;
                  this.errorFlag = true;
                });
            } else {
              alert("You must place a bid higher than " + this.auction.currentBid)
            }
        } else {
            alert("This auction has ended");
          }
        } else {
          alert("you must be logged in to place a bid");
        }
      },

      getLoggedIn: function(){
        if(this.$cookies.isKey(user_session)){
          this.loggedIn = true;
          alert("logged in")
        } else {
          this.loggedIn = false;
          alert("not logged in")
        }
      },

      //Pulls selected values from the search modal
      getSerchParams: function(){
        var category = document.getElementById("selCategoryId").options;
        this.searchParams.categoryId = category.selectedIndex;

        switch(category.selectedIndex){
          case 0:
            this.currentCategory = '';
            break;
          case 1:
            this.currentCategory = "Apparel";
            break;
          case 2:
            this.currentCategory = "Equipment";
            break;
          case 3:
            this.currentCategory = "Vehicles";
            break;
          case 4:
            this.currentCategory = "Property";
            break;
          case 5:
            this.currentCategory = "Other";
            break;
        }

        var status = document.getElementById('selStatus').options;


        switch(status.selectedIndex){
          case 0:
            this.searchParams.auctionStatus = "";
            break;
          case 1:
            this.searchParams.auctionStatus = 'active';
            break;
          case 2:
            this.searchParams.auctionStatus = 'expired';
            break;
          case 3:
            this.searchParams.auctionStatus = 'won';
            break;
          case 4:
            this.searchParams.auctionStatus = 'upcomming';
            break;

        }

        this.getXAuctions();
      },

      getXAuctions: function(){


        alert("searchString = " + this.searchParams.searchString + " categoryId = " +this.searchParams.categoryId + " status = " + this.searchParams.auctionStatus )
        var req = 'http://localhost:4941/api/v1/auctions?';
        if(this.searchParams.categoryId != 0){
          req += 'category-id=' + this.searchParams.categoryId + "&";
        }
        if(this.searchParams.auctionStatus != ""){
          req += 'status=' + this.searchParams.auctionStatus + "&";
        }
        if(this.searchParams.searchString != ""){
          req += 'q=' + this.searchParams.searchString + "&";
        }

        this.$http.get(req)
          .then(function(response){
            this.searchParams.auctionStatus = "";
            this.searchParams.categoryId = 0;
            this.searchParams.searchString = "";
            this.auctions = response.data;
          }, function(error){
            this.error = error;
            this.errorFlag = true;
          })


      },

      getDate: function(t){
        var date = new Date(t);
        return date;
      }
    }
  }
</script>

<style>
  table td{
    text-align: center;
  }
</style>






















