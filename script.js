const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const siteNav = document.querySelector("[data-site-nav]");
const tabs = document.querySelectorAll("[data-filter]");
const menuCards = document.querySelectorAll("[data-category]");
const addButtons = document.querySelectorAll("[data-add]");
const orderList = document.querySelector("[data-order-list]");
const orderTotal = document.querySelector("[data-order-total]");
const orderEmpty = document.querySelector("[data-order-empty]");
const clearOrder = document.querySelector("[data-clear-order]");
const orderForm = document.querySelector("[data-order-form]");
const orderNote = document.querySelector("[data-order-note]");
const reserveForm = document.querySelector("[data-reserve-form]");
const formNote = document.querySelector("[data-form-note]");
const order = [];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

const renderOrder = () => {
  orderList.innerHTML = "";

  order.forEach((item) => {
    const line = document.createElement("li");
    line.innerHTML = `<span>${item.name}</span><strong>${formatPrice(item.price)}</strong>`;
    orderList.append(line);
  });

  const total = order.reduce((sum, item) => sum + item.price, 0);
  orderTotal.textContent = formatPrice(total);
  orderEmpty.classList.toggle("is-hidden", order.length > 0);
  orderNote.textContent = "";
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const filter = tab.dataset.filter;

    tabs.forEach((item) => item.classList.toggle("is-active", item === tab));
    menuCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    order.push({
      name: button.dataset.add,
      price: Number(button.dataset.price),
    });
    renderOrder();
  });
});

clearOrder.addEventListener("click", () => {
  order.length = 0;
  renderOrder();
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (order.length === 0) {
    orderNote.textContent = "Add at least one menu item before sending your order request.";
    return;
  }

  const data = new FormData(orderForm);
  const name = data.get("orderName").toString().trim();
  const fulfillment = data.get("fulfillment");
  const readyTime = data.get("readyTime");
  const total = order.reduce((sum, item) => sum + item.price, 0);

  order.length = 0;
  orderForm.reset();
  renderOrder();
  orderNote.textContent = `Thanks, ${name}. Your ${fulfillment.toLowerCase()} order request for ${readyTime.toLowerCase()} is ready for Nova Novelties to confirm. Estimated total: ${formatPrice(total)}.`;
});

reserveForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(reserveForm);
  const name = data.get("name").toString().trim();
  const party = data.get("party");
  const time = data.get("time");

  formNote.textContent = `Thanks, ${name}. Your ${party.toLowerCase()} reservation request for ${time} is ready for Nova Novelties to confirm.`;
  reserveForm.reset();
});

renderOrder();
