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
					]
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
		Adds a cat to the cats array.
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
			*/
			return data.cats[id];
		},
		get_all: function() {
			/*
			Get the entire array of cats data.
			*/
			return data.cats;
		},
		set: function(id, value) {
			/*
			Set a specific cats click count to the passed value.
			*/
			data.cats[id] = value;
			return data.cats[id];
		},
		add_click: function(id, increment) {
			/*
			Increment a specific cat's click count by the passed increment.
			*/
			data.cats[id] += increment;
			return data.cats[id];
		},
		get_data: function() {
			/*
			returns the full table of raw data
			*/
			return data;
		}

	};

	// gets data for the view and handles user interactions
	var controller = {
		init: function() {
			// initiate and populate the raw data
			model.init();
			// generate the starting number of cats
			this.generate_cats(5);
			// initiate and build the user interface
			view.init();
		},
		generate_cats: function(amount) {
			/*
			Generates the initial instances of Cat objects for the cats data.
			Args: amount (int) - number of cat instances to create/add to
			Return:
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
			console.log(data);
		},
		click: {
			switcher: function(id) {

			},
			counter: function(id) {

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

			// doc fragment to hold all buttons before appending them to dom
			var buttons_pre_dom = document.createDocumentFragment();
			// doc fragment to hold cat container elements before append to dom
			var cat_pre_dom = document.createDocumentFragment();

			// generate counter and cat img dom elements, cache ref in elements obj
			this.elements.counter = this.render.counter(0);
			this.elements.cat_img = this.render.cat(0);

			// append the click counter to the dom frag
			cat_pre_dom.appendChild(this.elements.counter);
			// append the first cat pic to the dom frag
			cat_pre_dom.appendChild(this.elements.cat_img);

			// loop through the cats array amd show the buttons for all the cats
			for (i=0; i < model.get_all().length; i+=1) {
				// append button for the current cat to the dom fragment for buttons
				buttons_pre_dom.appendChild(this.render.button(i));
			}

			// append the dom fragments to the live, visible dom tree
			this.elements.cat_container.appendChild(cat_pre_dom);
			this.elements.buttons_container.appendChild(buttons_pre_dom);

		},
		render: {
			cat: function(id) {
				/*
				Builds the image element with relevant info.
				Args: id (int) - the index of the cat from the cats array
				Return:na
				*/
				// create img element
				var cat_img = document.createElement('img');
				// assign the img src
				cat_img.src = model.get(id).pic;
				// assign the img alt
				cat_img.alt = model.get(id).name;

				return cat_img;
			},
			name: function (id) {
				/*
				Creates the cat name display element.
				Args: id(int) - index of cat from cats aray to grab name from
				return: cat name dom element
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
				Return:na
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
				Return: na
				*/
				// create an h2 for the counter element
				var counter = document.createElement('h2');
				// add counter class
				counter.classList.add('counter');
				// set the counter text to the passed value
				counter.textContent = value;

				return counter;
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
				this.elements.cat_img.src = model.get(id).pic;
				// reassign the img alt
				this.elements.cat_img.alt = model.get(id).name;
			},
			button: function() {
			},
			counter: function(value) {
				/*
				Changes the displayed value of the click counter to whatever
				is passed as an argument.
				Args: value (int) - number you want the click counter element to show
				Return: na
				*/
				// change the value of the click counter to passed in value
				this.elements.counter.textContent = value;
			}
		}
	};

	// start the clicker
	controller.init();

})(window);
