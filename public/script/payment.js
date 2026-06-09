// Selecting the payment method
const methods = document.querySelectorAll(".payment_method");
if (methods) {
   function methodHandler(element) {
      element.classList.remove("outline-gray-300");
      element.classList.add("outline-2", "outline-blue-500");
      const info = JSON.parse(element.dataset.info);
      document.getElementById("paymentMethod").innerText = info.name;

      const checkoutForm = document.getElementById("checkoutForm");
      checkoutForm.setAttribute("method", info.method);
      checkoutForm.setAttribute("action", info.route);

      const phoneInput = document.getElementById("otpPhone");
      if (phoneInput) {
         if (info.sub_type == 'sslcommerz') {
            phoneInput.classList.remove("hidden");
            phoneInput.classList.add("block");
            phoneInput.setAttribute('required', true);
         } else {
            phoneInput.classList.add("hidden");
            phoneInput.classList.remove("block");
            phoneInput.removeAttribute('required')
         }
      }
   }

   methods.forEach((element, index) => {
      element.classList.add("outline-gray-300");
      // checkoutForm
      if (index === 0) methodHandler(element);

      element.addEventListener("click", () => {
         methods.forEach((item) => {
            item.classList.add("outline-gray-300");
            item.classList.remove("outline-2", "outline-blue-500");
         });
         methodHandler(element);
      });
   });

   const checkout = document.getElementById("checkout");
   const paymentMethod = document.getElementById("paymentMethod").innerText;
   if (!Boolean(paymentMethod)) {
      checkout.setAttribute("disabled", true);
   }
}
