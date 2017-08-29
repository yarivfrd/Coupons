
let cp = {};


$.getJSON( "coupons.json", (data) => {
    
    let coupons = data.coupons;
    
    for (let coupon = 0; coupon < coupons.length; coupon++) {
        $('<li><a href=#'+coupons[coupon].id+'>'+coupons[coupon].name+'</a></li>').appendTo('.coupon-list');
        $('<div data-role="page" id='+coupons[coupon].id+'><div data-role="header" data-add-back-btn="true"><h1>'+coupons[coupon].name+'</h1></div><div data-role="content"><img src='+coupons[coupon].thumb+'><div class="location">'+coupons[coupon].location+'</div><p class="description">'+coupons[coupon].description+'</p><p class="price">Pay just ₪ '+coupons[coupon].price+' insted of ₪ '+coupons[coupon]["original-price"]+'!</p></div></div>').appendTo('body');
    }
    $(".coupon-list").listview("refresh");
    
});