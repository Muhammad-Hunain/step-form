    document.addEventListener("DOMContentLoaded", function () {
        // Retrieve selectedOptions from localStorage or initialize an empty array
        const selectedOptions = JSON.parse(localStorage.getItem('selectedOptions')) || [];

        // Log the selectedOptions if they exist
        if (selectedOptions.length > 0) {
            console.log("Selected Options:", selectedOptions);
        }

        // Find all elements with the class "add-option"
        const addButton = document.querySelectorAll(".add-option");

        // Add click event listeners to the "add-option" buttons
        addButton.forEach(function (button) {
            button.addEventListener("click", function () {
                // Extract category, name, and price attributes from the button
                const category = button.getAttribute("data-category");
                const name = button.getAttribute("data-name");
                const price = parseFloat(button.getAttribute("data-price"));

                // Check if the option is already in the array
                const isAlreadyAdded = selectedOptions.some(option => (
                    option.category === category && option.name === name
                ));

                if (isAlreadyAdded) {
                    alert(`"${name}" from "${category}" is already added.`);
                } else {
                    selectedOptions.push({
                        category: category,
                        name: name,
                        price: price
                    });

                    localStorage.setItem('selectedOptions', JSON.stringify(selectedOptions));
                    button.textContent = "Added";
                    button.style.backgroundColor = "#9d81db"; // Change background color
                    button.disabled = true;
                    console.log(`Selected Option: Category - ${category}, Name - ${name}, Price - €${price.toFixed(2)}`);
                    console.log("Selected Options:", selectedOptions);
                }
            });
        });

        document.addEventListener("click", function (event) {
            if (event.target.classList.contains("remove")) {
                // Get the parent element of the "remove" button, which corresponds to the item
                
                
                // Remove the item from local storage
                localStorage.removeItem("selectedOptions");
                localStorage.removeItem("selectedChecklists");
        
                // Remove the item's element from the document
                itemElement.remove();
            }
        });
        


        const queryParams = new URLSearchParams(window.location.search);
        const washType = queryParams.get("type");

        console.log("Wash Type:", washType);

        const washTypePrices = {
            "small-car": 3.95,
            "medium-car": 4.95,
            "big-car": 5.95
        };

        const washTypePriceElements = document.querySelectorAll("#wash-type-price");

        if (washType && washTypePrices[washType]) {
            const priceText = `€ ${washTypePrices[washType].toFixed(2)}`;
            washTypePriceElements.forEach(function (element) {
                element.textContent = priceText;
            });

            console.log("Wash Type Price:", washTypePrices[washType]);
            console.log("Wash Type:", washType);
            localStorage.setItem('washType', washType);
            
        }

        const selectedChecklists = JSON.parse(localStorage.getItem('selectedChecklists')) || {
            interior: [],
            exterior: [],
            washType: washType
            
        };

        const addButtons = document.querySelectorAll(".wash-type-add-button");

        addButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                const category = button.parentElement.querySelector(".wash-type-heading").textContent.toLowerCase();
                const checkboxes = button.parentElement.querySelectorAll(".wash-type-checkbox");

                checkboxes.forEach(function (checkbox) {
                    if (checkbox.checked) {
                        const label = checkbox.parentElement.textContent;
                        const isAlreadyAdded = selectedChecklists[category].includes(label);

                        if (!isAlreadyAdded) {
                            selectedChecklists[category].push(label);

                            button.textContent = "Added";
                            button.style.backgroundColor = "#9d81db";
                        } else {
                            // alert(`"${label}" is already added.`);
                            button.textContent= " Already Added"
                            button.style.backgroundColor = "#FF0000";
                            button.style.color = "#FFFFFF";

                                            }
                    }
                });

                localStorage.setItem('selectedChecklists', JSON.stringify(selectedChecklists));
            
                    // Change background color
                    button.disabled = true;
                console.log(`Selected Checklists - ${category}:`, selectedChecklists[category]);
                console.log("Selected Checklists:", selectedChecklists);
            });
        });

        function groupOptionsByCategory(options) {
            const groupedOptions = {};
            options.forEach(option => {
                if (!groupedOptions[option.category]) {
                    groupedOptions[option.category] = [];
                }
                groupedOptions[option.category].push(option);
            });
            return groupedOptions;
        }

        function calculateCategoryPrice(selectedChecklist) {
            let categoryPrice = 0;
            selectedChecklist.forEach(option => {
                categoryPrice += option.price;
            });
            return categoryPrice;
        }

        
    
            // This code will run when the button is clicked

            // Your existing code for calculateTotalPrice function
            function calculateTotalPrice() {
                // Your updated code here
                let interiorPrice = 0.0;
                let exteriorPrice = 0.0;
                const selectedOptionsPrice = calculateCategoryPrice(selectedOptions);

                console.log("Wash Types:", selectedChecklists.washType);
                console.log("Interior:", selectedChecklists);

                if (selectedChecklists.washType === "small-car") {
                    interiorPrice = selectedChecklists.interior.length > 0 ? interiorPrice + 3.95 : 0;
                    exteriorPrice = selectedChecklists.exterior.length > 0 ? exteriorPrice + 3.95 : 0;
                } else if (selectedChecklists.washType === "medium-car") {
                    interiorPrice = selectedChecklists.interior.length > 0 ? interiorPrice + 4.95 : 0;
                    exteriorPrice = selectedChecklists.exterior.length > 0 ? exteriorPrice + 4.95 : 0;
                } else if (selectedChecklists.washType === "big-car") {
                    interiorPrice = selectedChecklists.interior.length > 0 ? interiorPrice + 5.95 : 0;
                    exteriorPrice = selectedChecklists.exterior.length > 0 ? exteriorPrice + 5.95 : 0;
                }

                const totalPrice = selectedOptionsPrice + interiorPrice + exteriorPrice;
                const service = totalPrice * 0.25;

                document.getElementById("interior-price").textContent = `Interior Price: € ${interiorPrice.toFixed(2)}`;
                document.getElementById("exterior-price").textContent = `Exterior Price: € ${exteriorPrice.toFixed(2)}`;
                document.getElementById("service-price").textContent = `Service Price: € ${service.toFixed(2)}`;
                document.getElementById("total-price").textContent = `Total Price: € ${totalPrice.toFixed(2)}`;
            }

            // Call the calculateTotalPrice function
            console.log("hello");
            calculateTotalPrice();
            if (selectedOptions.length > 0) {
                console.log("Selected Options:", selectedOptions);
                const selectedOptionsDisplay = document.querySelector("#selected-options");
                selectedOptionsDisplay.innerHTML = '';
        
                const groupedOptions = groupOptionsByCategory(selectedOptions);
                Object.keys(groupedOptions).forEach(category => {
                    const categoryHeading = document.createElement("h2");
                    categoryHeading.textContent = `Category: ${category}`;
                    selectedOptionsDisplay.appendChild(categoryHeading);
        
                    const optionsList = document.createElement("ul");
                    groupedOptions[category].forEach(option => {
                        const optionItem = document.createElement("li");
                        optionItem.textContent = `${option.name} - Price: € ${option.price.toFixed(2)}`;
                        optionsList.appendChild(optionItem);
                    });
                    selectedOptionsDisplay.appendChild(optionsList);
                
                });
            }
        
        });


        

