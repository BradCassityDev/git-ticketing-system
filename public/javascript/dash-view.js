const categorySelector = document.getElementById("view-category");
const itemSelector = document.getElementById("view-item");
const categoryDisplay = document.getElementById("category-display");

function categoryChangeHandler(event) {
  populateItems(categorySelector.value, true);
};

function itemChangeHandler(event) {
  setSpinners();
  changeCategoryDisplay();
  loadTasks(categorySelector.value, itemSelector.value)
};

const changeCategoryDisplay = () => {
  if (itemSelector.options[0]) {
    categoryDisplay.innerHTML = categorySelector.options[categorySelector.selectedIndex].text + " Issues - " + itemSelector.options[itemSelector.selectedIndex].text;
  }
  else {
    categoryDisplay.innerHTML = categorySelector.options[categorySelector.selectedIndex].text + " Issues - ";
  }
};

// Return list of Items for dropdown
async function populateItems(category, firstRunFinished) {
  itemSelector.innerHTML = '';

  await fetch(`/api/${category}`)
    .then(response => {
      if (response.ok) {
        response.json().then(data => {
          for (let i = 0; i < data.length; i++) {
            const option = document.createElement("option");
            option.text = (data[i].username) ? data[i].username : data[i].name;
            option.value = data[i].id;

            if ((data[i].username) && (parseInt(userID) === data[i].id)) {
              option.selected = true;
            }

            itemSelector.add(option);
          }
          setSpinners();
          changeCategoryDisplay();

          // The script.js file handles the first load of issues, so don't call this on first run
          if (firstRunFinished) {
            loadTasks(categorySelector.value, itemSelector.value)
          }
        });
      } else {
        alert('No users found');
      }
    })
    .catch(err => {
      console.log(err);
      alert('No users found');
    });
}

categorySelector.addEventListener("change", categoryChangeHandler);
itemSelector.addEventListener("change", itemChangeHandler);

populateItems('user', false);
changeCategoryDisplay();