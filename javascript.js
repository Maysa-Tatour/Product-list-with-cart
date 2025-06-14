const productList=document.getElementById('product-list');
const cartItems=document.getElementById('cart-items');
const cartTotal=document.getElementById('cart-total');
const cartP=document.querySelector('.cartitem');
const overlay=document.getElementById("overlay");
const confirmedItems=document.getElementById("confirmed-items");
const confirmedTotal= document.getElementById("confirmed-total");
const confirmBtn = document.getElementById("confirm-btn");
const startNewOrderBtn = document.getElementById("start-new-order");
let cart=[];
let products=[];
let qty=1;
    const saveCart=localStorage.getItem("cart");
     if(saveCart){
      cart=JSON.parse(saveCart);
      updateCartUI();
     }
fetch('data.json').then(res=>res.json())
   .then(data=>{
    products=data;
    data.forEach((product,index) => {
    product.id=index;
    const productCard=document.createElement('div');
    productCard.classList.add('product-card');
    productCard.innerHTML=`
     <div class="product-image-wrapper">
     <picture>
     <source media="(min-width: 1024px)" srcset="${product.image.desktop}">
     <source media="(min-width: 768px)" srcset="${product.image.tablet}">
     <source media="(max-width: 768px)" srcset="${product.image.mobile}">
    <img src="${product.image.thumbnail}" alt="${product.name}">
    </picture>
    <button class="add-btn" onclick="addToCart(${product.id})"
    onmouseenter="showQuantity(this)"
    onmouseleave="hideQuantity(this)">
    <span class="default-text"><i class="fas fa-shopping-cart"></i> Add to Cart</span>
    <div class="quantity-controls hidden">
    <i class="fas fa-minus icon qty-btn left-btn" onclick="event.stopPropagation(); decrease(this)"> 
    </i>
    <span class="qty">1</span>
    <i   class="fas fa-plus icon qty-btn right-btn" onclick="event.stopPropagation(); increase(this)"> 
    </i>
    </div>
</button>
   </div>
    
    <div class="product-info">
      <span class="category">${product.category}</span>
      <p class="product-title">${product.name}</p>
      <p class="product-price">$${product.price.toFixed(2)}</p>
  
    </div>
    </div>
 `;
 productList.appendChild(productCard);
    
   }); 
  });
   function showQuantity(button) {
  button.querySelector(".default-text").classList.add("hidden");
  button.querySelector(".quantity-controls").classList.remove("hidden");
   }
   function hideQuantity(button) {
  button.querySelector(".default-text").classList.remove("hidden");
  button.querySelector(".quantity-controls").classList.add("hidden");
}
function increase(plusIcon){
  const qtySpan= plusIcon.parentElement.querySelector(".qty");
  let quantity= parseInt(qtySpan.textContent);
  quantity++;
  qtySpan.textContent=quantity;
  qty=quantity;
}
function decrease(minusIcon){
  const qtySpan=minusIcon.parentElement.querySelector(".qty");
  let quantity=parseInt(qtySpan.textContent);
  if(quantity > 1){
    quantity--;
    qtySpan.textContent=quantity;
    qty=quantity;
  }
}
function addToCart(productId){
  const selectedProduct=cart.find(item=>item.id===productId);
  if(selectedProduct){
    selectedProduct.quantity=qty;
  }
  else {
      const product = products.find(p => p.id === productId);
    cart.push({...product,quantity:qty});
  }
  updateCartUI();
}
function updateCartUI(){
  cartItems.innerHTML="";
  let total=0;

   const emptyCart=document.getElementById("empty-cart");

      if(cart.length===0){
        emptyCart.style.display="block";
        cartP.style.display="none";
      } else {
        emptyCart.style.display="none";
        cartP.style.display="block";
      }
      
      document.querySelector('.cart-title').textContent=`Your Cart (${cart.length})`;
  cart.forEach(item=>{
    total += item.price * item.quantity;
    const li=document.createElement("li");
    li.innerHTML=`
    <div class="item-header"><span class="item-name">${item.name}</span> 
      <button class="remove-btn" onclick="removeFromCart(${item.id})">X</button> 
    </div>
    
    <div class="item-info">${item.quantity}x @$${item.price.toFixed(2)}$${(item.price * item.quantity).toFixed(2)}</div>
    
    `
    cartItems.appendChild(li);

  });
  cartTotal.textContent=`$${total.toFixed(2)}`;
  localStorage.setItem("cart",JSON.stringify(cart))
}
function removeFromCart(productId){
  cart=cart.filter(item=>item.id != productId);
    updateCartUI();
}
confirmBtn.addEventListener("click",()=>{
  if(cart.length === 0) return;

  confirmedItems.innerHTML="";
  let total=0;
  cart.forEach(item=>{
    const li= document.createElement("li");
    li.innerHTML=`
    <img src="${item.image.thumbnail}" alt="${item.name}">
    <div class="info">
    <span>${item.name}</span> <p class="quantity"><span class="price">${item.quantity}x</span> @$${item.price.toFixed(2)}</p>
    </div>
    <p>$${(item.price * item.quantity).toFixed(2)}</p>  
    `;
    confirmedItems.appendChild(li);
    total+= item.price * item.quantity;
  });
   confirmedTotal.textContent = `$${total.toFixed(2)}`;
   overlay.classList.remove("hidden");
   overlay.classList.add("overlay-show");
});
 startNewOrderBtn.addEventListener("click",()=>{
  cart=[];
  updateCartUI();
  localStorage.removeItem("cart");
  overlay.classList.add("hidden");
  overlay.classList.remove("overlay-show");
 });