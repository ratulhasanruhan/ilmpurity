// Selecting the payout method
const methods = document.querySelectorAll(".payout_method");
if (methods) {
   function methodHandler(element) {
      element.classList.remove("outline-gray-300");
      element.classList.add("outline-2", "outline-blue-500");
      const info = JSON.parse(element.dataset.info);
      document.getElementById("payoutMethod").innerText = info.name;

      const checkoutForm = document.getElementById("checkoutForm");
      checkoutForm.setAttribute("method", info.method);
      checkoutForm.setAttribute("action", info.route);
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
   const payoutMethod = document.getElementById("payoutMethod").innerText;
   if (!Boolean(payoutMethod)) {
      checkout.setAttribute("disabled", true);
   }
}
