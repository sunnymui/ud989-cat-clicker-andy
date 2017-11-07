// anon closure to keep the namespace clear
(function(window){
	// stores the raw data for the app
	var data;
	// initiate the incrementer
	var i;

	// manipulates and stores data
	var model = {
		init: function() {
		/*
		Do initial setup and structuring of raw data storage
		*/
			if (!data) {
				data = {
					// stores urls for external resources to be loaded
					assets: {
						// stores srcs for the cat pics
						cats: [
							'cat_picture1.jpg',
							'cat_picture2.jpeg',
							'cat_picture3.jpeg',
							'cat_picture4.jpeg',
							'cat_picture5.jpeg'
						]
					},
					// stores the possible names for each cat
					names: [
						'Joey',
						'Marcus',
						'Penelope',
						'Milo Jr',
						'Oscar'
					],
					// storage for the actual Cat instances
					cats: [
						// Cat objs
					],
					state: {
						current_cat: 0
					}
				};
			}
		},
		Cat: function (name, src) {
			/*
			Constructs a Cat object for the cat clicker app with relevant info likely
			the name, the pic to use, the click count.
			Args: name (string) - name to show for the cat,
						src (string) - the image src link for the cat's picture
			Return: na
			*/
			// the name of this cat
			this.name = name;
			// the picture to use for this cat
			this.pic = src;
			// the click count for this cat
			this.count = 0;
		},
		add_cat: function(cat) {
			/*
			Adds a cat to the data cats array.
			Args: cat (obj) - an instance of the cat object
			Return: na
			*/
			// push the cat object to the cats array
			data.cats.push(cat);
		},
		// functions specifically for getting/setting cat data
		get: function(id) {
			/*
			Get specific cat instance's data by its id.
			Args: id (int) - index of the cat to get from the cats array
			Return: the specified cat instance (obj)
			*/
			return data.cats[id];
		},
		get_all: function() {
			/*
			Get the entire array of cats data.
			Args: na
			Return: the entire array of cat instances (array)
			*/
			return data.cats;
		},
		get_current_cat: function() {
			/*
			Gets the id of the current cat being displayed.
			Args: na
			Return: the index # (int) of the current cat
			*/
			return data.state.current_cat;
		},
		set: {
			clicks: function(id, value) {
				/*
				Set a specific cats click count to the passed value.
				Args: id (int) - the index of the cat to set clicks for
							value (number) - the value to set the clicks amount to
				Return: na
				*/
				data.cats[id].count = value;
			},
			name: function(id, name) {
				/*
				Set a specified cats name to the passed value.
				Args: id (int) - the index of the cat to set clicks for
							name (string) - the new name for the cat instance
				Return: na
				*/
				data.cats[id].name = name;
			},
			img: function(id, src) {
				/*
				Set a specified cats img src to the passed value
				Args: id (int) - the index of the cat to set clicks for
							src (string) - the new img src url for the cat instance
				Return: na
				*/
				data.cats[id].pic = src;
			},
			current_cat: function(id) {
				/*
				Sets the current cat in the data.
				Args: id (int) - the index # of the current cat
				Return: na
				*/
				// set current cat equal to the passed in id
				data.state.current_cat = id;
			}
		},
		add_click: function(id, increment) {
			/*
			Increment a specific cat's click count by the passed increment.
			Args: id (int) - the index of the cat instance to increment
						increment (number) - the amount to increment the click count
			Return: na
			*/
			data.cats[id].count += increment;
		},
		get_data: function() {
			/*
			Returns the full table of raw data
			Args: na
			Return: the full data table (obj)
			*/
			return data;
		}

	};

	// gets data for the view and handles user interactions
	var controller = {
		init: function() {
			/*
			Initiates and setups basically the whole app.
			Args: na
			Return: na
			*/

			// initiate and populate the raw data
			model.init();
			// generate the starting number of cats
			this.generate_cats(5);
			// initiate and build the user interface
			view.init();
			// attach event listeners
			this.generate_event_listeners();
		},
		generate_cats: function(amount) {
			/*
			Generates the initial instances of Cat objects for the cats data.
			Args: amount (int) - number of cat instances to create/add to
			Return: na
			*/
			// grab all the data
			var data = model.get_data();
			// max number of cats that can be made based on # of cat names
			var max_cats = model.get_data().assets.cats.length;

			// check if the amount of cats to generate is larger than max possible
			if (amount > max_cats) {
				console.log('Too many Cats requested, generating max amount instead.');
				// set amount equal to maximum possible
				amount = max_cats;
			}
			// loop the specified amount to construct the cats
			for (i=0; i < amount; i+=1) {
				// instantiate the Cat object w/ respective name, img src and add to cats
				model.add_cat(new model.Cat(data.names[i], data.assets.cats[i]));
			}
		},
		generate_event_listeners: function() {
			/*
			Adds event listeners to all relevant interactive elements.
			Args: na
			Return: na
			*/

			// listen for clicks on the cat img element
			view.elements.cat_img.addEventListener('click', function(e) {
				// grab the data id of the clicked img
				var current_id = e.target.dataset.id;

				// increment the cat clicks and update counter
				controller.click.cat(current_id);
			});

			// listen for clicks on the buttons element container
			view.elements.buttons_container.addEventListener('click', function(e) {
				// store reference to the current button's data id
				var current_id = e.target.dataset.id;

				// switch the current cat to the clicked one
				controller.click.button(current_id);
				// switch current cat to clicked in the state tracker
				model.set.current_cat(current_id);
				// make the clicked button active in the view
				view.update.button(e.target);
			});

			// listen for clicks on the admin button to show/hide admin panel
			view.elements.admin_btn.addEventListener('click', function() {
				// grab the current id from the cat elements
				var current_id = model.get_current_cat();
				// toggle active class on admin button
				this.classList.toggle('active');
				// update the admin form with the latest data
				view.update.admin(current_id);
				// toggle visibility for the admin form
				view.elements.admin_form.classList.toggle('active');
			});

			// listen for clicks on the admin form cancel button
			view.elements.admin_cancel_btn.addEventListener('click', function() {
				// grab the current id from the cat elements
				var current_id = model.get_current_cat();
				// reset the info in the admin form to the current cat's info
				view.update.admin(current_id);
				// toggle active class on admin button
				view.elements.admin_btn.classList.toggle('active');
				// toggle visibility for the admin form
				view.elements.admin_form.classList.toggle('active');
			});

			// listen for clicks on the admin form save button
			view.elements.admin_save_btn.addEventListener('click', function() {
				// grab the id for the current cat
				var current_id = model.get_current_cat();
				// grab the name in the admin input field
				var input_name = view.elements.admin_name.value;
				// grab the img url in the img src field
				var input_img = view.elements.admin_img.value;
				// grab the clicks amount in the relevant input field
				var input_clicks = view.elements.admin_clicks.value;

				// set the cat name to the inputted name
				model.set.name(current_id, input_name);
				// set the cat img src to the inputted src
				model.set.img(current_id, input_img);
				// set the cat click count to the inputted clicks
				model.set.clicks(current_id, parseInt(input_clicks));

				// update the counter view with new click amount
				view.update.counter(model.get(current_id).count);
				// update the button text in the view with the new name
				view.update.button_text(current_id, model.get(current_id).name);
				// update the cat img src in the view w/ new src
				view.update.cat(current_id);
			});

		},
		click: {
			cat: function(id) {
				/*
				Deals with the click event on the cat by incrementing stuff.
				Args: id (int) - index number of the cat to change in the cats array
				Return: na
				*/
				// amount to increment the clicks amount for current cat by
				var click_increment = 1;
				// increment the clicks for the current cat
				model.add_click(id, click_increment);

				// update the click counter view with the current cat's click count
				view.update.counter(model.get(id).count);
			},
			button: function(id) {
				/*
				Deals with clicks on the buttons by making them active and updateing
				the view.
				Args: id (int) - index # of the cat to switch to
				Return: na
				*/
				// update the view w/ the new cat
				view.update.cat(id);
				// update the counter w/ clicks for new cat
				view.update.counter(model.get(id).count);
				// update the admin panel w/ info for the new cat
				view.update.admin(id);
			}
		}
	};

	// presents the data in the dom
	var view = {
		elements: {
			// cache references to dom node elements here from the init function
		},
		init: function() {
			// get the cat img container and cache it
			this.elements.cat_container = document.querySelector('.cat');
			// get the buttons container and cache it
			this.elements.buttons_container = document.querySelector('.catlist');
			// get the admin container
			this.elements.admin_container = document.querySelector('.admin');

			// get the current cat to start with
			var start_cat = model.get_current_cat();
			// doc fragment to hold all buttons before appending them to dom
			var buttons_pre_dom = document.createDocumentFragment();
			// doc fragment to hold cat container elements before append to dom
			var cat_pre_dom = document.createDocumentFragment();
			// doc fragment to hold admin elements before adding to live dom
			var admin_pre_dom = document.createDocumentFragment();

			// generate counter, cat img, admin dom elements, cache ref in elements obj
			this.elements.counter = this.render.counter(start_cat);
			this.elements.cat_img = this.render.cat(start_cat);
			this.elements.admin_btn = this.render.admin_btn();
			this.elements.admin_form = this.render.admin_form(start_cat);

			// cache references to admin form elements in view.elements obj
			this.elements.admin_name = this.elements.admin_form.querySelector('#admin-name');
			this.elements.admin_img = this.elements.admin_form.querySelector('#admin-img');
			this.elements.admin_clicks = this.elements.admin_form.querySelector('#admin-clicks');
			this.elements.admin_cancel_btn = this.elements.admin_form.querySelector('.cancel');
			this.elements.admin_save_btn = this.elements.admin_form.querySelector('.save');

			// append the click counter to the dom frag
			cat_pre_dom.appendChild(this.elements.counter);
			// append the first cat pic to the dom frag
			cat_pre_dom.appendChild(this.elements.cat_img);

			// init var to store the button rendered in the loop
			var current_button;
			// loop through the cats array amd make the buttons for all the cats
			for (i=0; i < model.get_all().length; i+=1) {
				// generate the button for the current cat
				current_button = this.render.button(i);
				// if we're on the button for the current cat
				if (i === start_cat) {
					// add the active class to that cat's button
					current_button.classList.add('active');
				}
				// append button for the current cat to the dom fragment for buttons
				buttons_pre_dom.appendChild(current_button);
			}

			// append the admin dom elements to the admin doc fragment
			admin_pre_dom.appendChild(this.elements.admin_btn);
			admin_pre_dom.appendChild(this.elements.admin_form);

			// append the dom fragments to the live, visible dom tree
			this.elements.cat_container.appendChild(cat_pre_dom);
			this.elements.buttons_container.appendChild(buttons_pre_dom);
			this.elements.admin_container.appendChild(admin_pre_dom);
		},
		render: {
			cat: function(id) {
				/*
				Builds the image element with relevant info.
				Args: id (int) - the index of the cat from the cats array
				Return: cat img element (obj)
				*/
				// create img element
				var cat_img = document.createElement('img');
				// assign the img src
				cat_img.src = model.get(id).pic;
				// assign the img alt
				cat_img.alt = model.get(id).name;
				// assign a data id w/ this cat's id #
				cat_img.dataset.id = id;
				// make it undraggable
				cat_img.draggable = false;

				return cat_img;
			},
			name: function (id) {
				/*
				Creates the cat name display element.
				Args: id(int) - index of cat from cats aray to grab name from
				return: cat name dom element (obj)
				*/
				// create an h3 for the cat name display
				var cat_name = document.createElement('h3');
				// set the cat name equal to the current cat's name
				cat_name.textContent = model.get(id).name;

				return cat_name;
			},
			button: function(id) {
				/*
				Builds a button element labeled with the relevant name and id.
				Args: id (int) - the index of the cat from the cats array
				Return: button dom element (obj)
				*/
				// create the button element
				var button = document.createElement('button');
				// set the label of the button to the cat's name
				button.textContent = model.get(id).name;
				// set the data-id attribute to the passed in id #
				button.dataset.id = id;

				return button;
			},
			counter: function(value) {
				/*
				Creates a counter element with the specified value.
				Args: value (number) - the value to set for the counter to display
				Return: counter dom lement (obj)
				*/
				// create an h2 for the counter element
				var counter = document.createElement('h2');
				// add counter class
				counter.classList.add('counter');
				// set the counter text to the passed value
				counter.textContent = value;

				return counter;
			},
			admin_btn: function() {
				/*
				Generate the admin button dom element.
				Args: na
				Return: na
				*/
				// create the admin show/hide button
				var admin_btn = document.createElement('button');
				// add the toggle class
				admin_btn.classList.add('toggle');
				// text should be admin
				admin_btn.textContent = 'Admin';

				return admin_btn;
			},
			admin_form: function(id) {
				/*
				Generate the admin button and form dom elements.
				Args: id (int) - index # of cat in cats array to get info from
				Return: admin dom elements (obj)
				*/
				// grab the info for the current cat to populate the form with
				var current_cat = model.get(id);
				// creat the admin form ul containing element
				var admin_form = document.createElement('ul');
				// add editor class to the container
				admin_form.classList.add('editor');
				// create all the interior dom elements and inputs
				admin_form.innerHTML ='<li>'+
												        '<label for="admin-name">Name: </label>'+
												        '<input type="text" id="admin-name" value="'+ current_cat.name +'">'+
												      '</li>'+
												      '<li>'+
												        '<label for="admin-img">Image Source:</label>'+
												        '<input type="text" id="admin-img" value="'+ current_cat.pic +'">'+
												      '</li>'+
												      '<li>'+
												        '<label for="admin-clicks">Clicks: </label>'+
												        '<input type="text" id="admin-clicks" value="'+ current_cat.count +'">'+
												      '</li>'+
															'<li>'+
																'<button class="cancel">Cancel</button>'+
																'<button class="save">Save</button>'+
															'</li>';

				return admin_form;
			}
		},
		update: {
			cat: function(id) {
				/*
				Reassigns the cat dom element's img src and alt tag.
				Args: id (int) - index # of the cat in cats array to switch to
				Return: na
				*/
				// reassign the img src
				view.elements.cat_img.src = model.get(id).pic;
				// reassign the img alt
				view.elements.cat_img.alt = model.get(id).name;
				// reassign the cat img id
				view.elements.cat_img.dataset.id = id;
			},
			button: function(button_element) {
				/*
				Switches which button looks active via css styling.
				Args: button_element (dom node obj) - the dom element to make active
				Return: na
				*/
				// clear active class from any button with it
				$(button_element).siblings().removeClass('active');
				// add active class to currently clicked button
				button_element.classList.add('active');
			},
			button_text: function(id, text) {
				/*
				Changes the text of a specified cat's button.
				Args: id (int) - the id of the cat you want to change the button for,
							text (string) - the text to change the button text to
				Return: na
				*/
				// grab the button with the relevant id #
				var current_button = document.querySelector('.catlist button[data-id="'+id+'"]');
				// change the button's text to the passed in text
				current_button.textContent = text;
			},
			counter: function(value) {
				/*
				Changes the displayed value of the click counter to whatever
				is passed as an argument.
				Args: value (int) - number you want the click counter element to show
				Return: na
				*/

				// change the value of the click counter to passed in value
				view.elements.counter.textContent = value;
			},
			admin: function(id) {
				/*
				Changes the displayed data in the admin form menu.
				Args: id (int) - index of cat info to display
				Return: na
				*/
				// grab the cat instance we want to show info for
				var current_cat = model.get(id);

				// change the name field to the selected cat instance name
				view.elements.admin_name.value = current_cat.name;
				// change the img src field to the selected cat img src
				view.elements.admin_img.value = current_cat.pic;
				// change the clicks field to the selected cat's count value
				view.elements.admin_clicks.value = current_cat.count;
			}
		}
	};

	// start the clicker
	controller.init();

})(window);
